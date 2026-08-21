<?php

namespace app\api\controller\ygame;

use app\common\controller\Api;
use think\Db;

/**
 * 用户反馈接口
 */
class Feedback extends Api
{
    protected $noNeedLogin = ['*'];
    protected $noNeedRight = ['*'];

    /**
     * 提交反馈
     */
    public function submit()
    {
        $name = trim((string)$this->request->post('name'));
        $phone = trim((string)$this->request->post('phone'));
        $storeName = trim((string)$this->request->post('store_name'));
        $content = trim((string)$this->request->post('content', ''));

        if ($name === '' || $phone === '' || $storeName === '') {
            $this->error('姓名、电话和所属门店不能为空');
        }

        if (!preg_match('/^1\d{10}$/', $phone) && !preg_match('/^\+?\d{6,20}$/', $phone)) {
            $this->error('请输入正确的电话号码');
        }

        $data = [
            'name'       => mb_substr($name, 0, 50),
            'phone'      => mb_substr($phone, 0, 20),
            'store_name' => mb_substr($storeName, 0, 100),
            'content'    => $content,
            'createtime' => time(),
            'ip'         => $this->request->ip(),
            'status'     => 0,
        ];

        $result = Db::name('ygame_feedback')->insert($data);
        if ($result) {
            $this->success('提交成功');
        }
        $this->error('提交失败');
    }
}
