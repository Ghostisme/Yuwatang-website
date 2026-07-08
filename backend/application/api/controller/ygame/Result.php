<?php

namespace app\api\controller\ygame;


use app\admin\model\ygame\Wechat;
use app\common\controller\Api;
use think\Exception;
use Yansongda\Pay\Exceptions\GatewayException;


/**
 * 成绩查询接口
 */
class Result extends Api
{

    // 无需登录的接口,*表示全部
    protected $noNeedLogin = [];
    // 无需鉴权的接口,*表示全部
    protected $noNeedRight = ['*'];

    public function search(){
        $name = $this->request->post('name');
        $idcard = $this->request->post('idcard');
        $shenfen = $this->request->post('shenfen');

        $record = new \addons\ygame\service\Result();
        $data = $record->scanResultList($name,$idcard,$shenfen);
        $this->success("请求成功",$data);
    }

    /**
     * Note:认领证书
     * Date:2023/6/14
     * Time:9:12
     * Author:Elyas
     */
    public function getcert(){


        $id=$this->request->request('result_id');
        $result = new \addons\ygame\service\Result();
        if(!$filename = $result->general_cert($id)){
            $this->error($result->error);
        }
        $resultModel = new \app\admin\model\ygame\Result();

        $result=$resultModel->where('id',$id)->find();
        $result->is_get=1;
        $result->cert_url='/'.$filename;
        $result->user_id=$this->auth->id;
        $result->save();
        if($result){

            $this->success();
        }
    }
    public function getbyid(){

        $id=$this->request->request('result_id');
        $resultModel = new \app\admin\model\ygame\Result();

        $result=$resultModel->with('project')->where('id',$id)->find();
        $this->success('请求成功',$result);

    }
    /**
     * 获取成绩证书
     */
    public function cert(){
        header('Content-Type: image/jpeg;');
        $result_id = $this->request->post("result_id");

        $result = new \addons\ygame\service\Result();
        if(!$filename = $result->general_cert($result_id)){
            $this->error($result->error);
        }else{
            $this->success('请求成功',$this->request->domain()."/".$filename);
        }




    }

}
