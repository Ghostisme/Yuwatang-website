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
    protected $searchFields = 'id,name,phone,email,store_name';
    protected $noNeedRight = [];

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\ygame\Feedback;
        $this->view->assign('statusList', [
            '0' => __('进行中'),
            '1' => __('通过'),
            '2' => __('拒绝'),
        ]);
    }

    /**
     * 列表：置顶优先，其次进行中，再按 weigh / id
     */
    public function index()
    {
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $total = $this->model->where($where)->count();
            $list = $this->model
                ->where($where)
                ->orderRaw('is_top DESC, CASE status WHEN 0 THEN 0 WHEN 1 THEN 1 ELSE 2 END ASC, weigh DESC, id DESC')
                ->limit($offset, $limit)
                ->select();
            $result = ['total' => $total, 'rows' => $list];
            return json($result);
        }
        return $this->view->fetch();
    }
}
