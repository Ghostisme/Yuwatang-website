<?php

namespace app\admin\controller\ygame;

use app\common\controller\Backend;

class Cert extends Backend
{

    /**
     * Result模型对象
     * @var \app\admin\model\ygame\Result
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\ygame\Cert();

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
                ->where($where)
                ->where(['project_id'=>$project_id])
                ->order($sort, $order)
                ->count();

            $list = $this->model
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
    public function add(){
        if($this->request->isPost()){
            $params = $this->request->post("row/a");
            if ($params) {
                $model = new \app\admin\model\ygame\Cert();
//                $row = $model->where(['project_id'=>$params['project_id']])->find();
//                if($row){
//                    $result = $row->allowField(true)->save($params);
//                }else{
//                    $model = new Cert();
                    $result = $model->allowField(true)->save($params);
//                }

                if ($result !== false) {
                    $this->success();
                } else {
                    $this->error(__('No rows were inserted'));
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }

        $project_id = $this->request->get('project_id');

        $model = new \app\admin\model\ygame\Cert();

        $this->assign('noimage',"/assets/addons/ygame/images/cert_bg.jpg");
        return $this->fetch();
    }
}