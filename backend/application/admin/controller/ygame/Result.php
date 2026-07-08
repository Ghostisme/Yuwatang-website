<?php

namespace app\admin\controller\ygame;

use app\admin\model\ygame\Cert;
use app\admin\model\ygame\WorkType;
use app\common\controller\Backend;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use think\Db;
use think\Exception;
use think\exception\PDOException;
use think\exception\ValidateException;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class Result extends Backend
{
    
    /**
     * Result模型对象
     * @var \app\admin\model\ygame\Result
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\ygame\Result;

        $project_id = $this->request->get('project_id');
        $this->assign('project_id',$project_id);
    }

    /**
     * 查看列表
     */
    public function index()
    {
        if ($this->request->isAjax())
        {
            $project_id = $this->request->param('project_id');
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();

            $total = $this->model
                ->with('type')
                ->with('cert')
                ->where($where)
                ->where(['project_id'=>$project_id])
                ->order($sort, $order)
                ->count();

            $list = $this->model
                ->with('type')
                ->with('cert')
                ->where($where)
                ->where(['project_id'=>$project_id])
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();

            $list = collection($list)->toArray();

            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        return $this->view->fetch();
    }


    /**
     * 设计电子成绩证书
     */
    public function design(){
        if($this->request->isPost()){
            $params = $this->request->post("row/a");
            if ($params) {
                $model = new Cert();
                $row = $model->where(['project_id'=>$params['project_id']])->find();
                if($row){
                    $result = $row->allowField(true)->save($params);
                }else{
                    $model = new Cert();
                    $result = $model->allowField(true)->save($params);
                }

                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }

        $project_id = $this->request->get('project_id');

        $model = new Cert();
        $row = $model->where(['project_id'=>$project_id])->find();

        $this->assign('noimage',"/assets/addons/ygame/images/cert_bg.jpg");
        $this->assign('row',$row);
        return $this->fetch();
    }

    /**
     * 导入
     */
    public function import()
    {
        $project_id = $this->request->get('project_id');

        $projectModel = new \app\admin\model\ygame\Project();
        $projectInfo = $projectModel->where(['id'=>$project_id])->find();
        if (!$projectInfo) {
            $this->error(__('当前赛事不存在'));
        }
        $file = $this->request->request('file');
        $arr = parse_url($file);
        $file = $arr['path'];
        if (!$file) {
            $this->error(__('Parameter %s can not be empty', 'file'));
        }
        $filePath = ROOT_PATH . DS . 'public' . DS . $file;
        if (!is_file($filePath)) {
            $this->error(__('No results were found'));
        }


        //实例化reader
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        if (!in_array($ext, ['xlsx'])) {
            $this->error(__('Unknown data format'));
        }
        $reader = new Xlsx();

        //加载文件
        $insert = [];
        try {
            if (!$PHPExcel = $reader->load($filePath)) {
                $this->error(__('Unknown data format'));
            }
            $currentSheet = $PHPExcel->getSheet(0);  //读取文件中的第一个工作表
            $allColumn = $currentSheet->getHighestDataColumn(); //取得最大的列号
            $allRow = $currentSheet->getHighestRow(); //取得一共有多少行


            $maxColumnNumber = Coordinate::columnIndexFromString($allColumn);

            $fields = [];
            for ($currentRow = 1; $currentRow <= 1; $currentRow++) {
                for ($currentColumn = 1; $currentColumn <= $maxColumnNumber; $currentColumn++) {
                    $val = $currentSheet->getCellByColumnAndRow($currentColumn, $currentRow)->getValue();
                    $fields[] = $val;
                }
            }


            for ($currentRow = 2; $currentRow <= $allRow; $currentRow++) {
                $values = [];
                for ($currentColumn = 1; $currentColumn <= $maxColumnNumber; $currentColumn++) {
                    $val = $currentSheet->getCellByColumnAndRow($currentColumn, $currentRow)->getValue();
                    $values[] = is_null($val) ? '' : $val;
                }
                $row = [];
                $temp = array_combine($fields, $values);

                foreach ($temp as $k => $v) {
                    if (isset($k) && $k !== '') {
                        $row[$k] = $v;
                    }
                }

                if ($row) {
                    $insert[] = $row;
                }
            }
        } catch (Exception $exception) {
            $this->error($exception->getMessage());
        }
        if (!$insert) {
            $this->error(__('No rows were updated'));
        }



        try {
            foreach($insert as $k=>$v){
                $data['project_id'] = $project_id;
                $data['name'] = $v['姓名'];
                $data['province'] = $v['省市'];
                $data['number'] = $v['编号'];
                $data['age'] = array_key_exists('年龄',$v)?$v['年龄']:null;
                $data['register_institution'] = array_key_exists('报名机构',$v)?$v['报名机构']:null;
                $data['teacher'] =array_key_exists('指导老师',$v)?$v['指导老师']:null ;
                $data['type_id'] = $v['作品类型'];
                $data['work_name'] = $v['作品名称'];
                $data['cert'] = $v['参与证书'];
                $data['idcard'] = $v['身份证'];

                if(empty($data['name']) || empty($data['number']) ){
                    continue;
                }

                $this->model->insert($data);

            }

        } catch (\think\exception\PDOException $exception) {
            $this->error($exception->getMessage());
        } catch (\Exception $e) {
            $this->error($e->getMessage());
        }



        $this->success();
    }
    public function add()
    {

        $this->view->assign('typeList', build_select('row[type_id]', WorkType::column('id,name'), 1, ['class' => 'form-control selectpicker']));
        $this->view->assign('certList', build_select('row[cert]', Cert::where('project_id', $this->request->get('project_id'))->column('id,name'), 1, ['class' => 'form-control selectpicker']));

        return parent::add();
    }

    public function edit($ids = null)
    {

        $row = $this->model->get($ids);
//        $this->modelValidate = true;
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        $this->view->assign('typeList', build_select('row[type_id]', WorkType::column('id,name'), $row['type_id'], ['class' => 'form-control selectpicker']));
        $this->view->assign('certList', build_select('row[cert]', Cert::column('id,name'), $row['cert'], ['class' => 'form-control selectpicker']));
return parent::edit($ids);
    }
    public function generetaCert(){
        $result_id=$this->request->request('result_id');

        $result = new \addons\ygame\service\Result();
        if(!$filename = $result->general_cert($result_id)){
            $this->error($result->error);
        }else{
            $model=new \app\admin\model\ygame\Result();
            $model= $model->where(['id'=>$result_id])->find();
            $model->cert_url='/'.$filename;
            $model->save();
            return $this->success("成功",'',$model);
//           $this->request->domain()."/".$filename
        }

    }
}
