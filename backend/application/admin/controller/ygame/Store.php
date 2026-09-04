<?php

namespace app\admin\controller\ygame;

use app\common\controller\Backend;

/**
 * 门店管理
 *
 * @icon fa fa-circle-o
 */
class Store extends Backend
{

    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new  \app\admin\model\ygame\Store();
    }
}
