<?php

namespace addons\ygame\service;

use app\admin\model\ygame\Store as StoreModel;

class Store
{
    /**
     * 官网门店列表（仅 status=1）
     */
    public function getStoreList($page = 1, $limit = 50)
    {
        $page = max(1, intval($page ?: 1));
        $limit = max(1, min(100, intval($limit ?: 50)));

        // 不用 clone：TP5 对空串 bind + clone 会触发 PDO 2031
        $total = StoreModel::where('status', 1)
            ->where('slug', '<>', '')
            ->count();
        $list = StoreModel::where('status', 1)
            ->where('slug', '<>', '')
            ->order('weigh', 'asc')
            ->order('id', 'asc')
            ->page($page, $limit)
            ->select();

        return [
            'total'        => $total,
            'per_page'     => $limit,
            'current_page' => $page,
            'data'         => collection($list)->toArray(),
        ];
    }

    /**
     * 按 slug 取单店
     */
    public function getStoreBySlug($slug)
    {
        $slug = trim((string)$slug);
        if ($slug === '') {
            return null;
        }
        $row = StoreModel::where('status', 1)->where('slug', $slug)->find();
        return $row ? $row->toArray() : null;
    }
}
