<?php

namespace app\admin\controller\ygame;

use app\common\controller\Backend;

/**
 * 用户反馈
 *
 * @icon fa fa-commenting-o
 */
class Feedback extends Backend
{
    protected $model = null;
    protected $searchFields = 'id,name,phone,store_name';
    protected $noNeedRight = [];

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\ygame\Feedback;
    }
}
