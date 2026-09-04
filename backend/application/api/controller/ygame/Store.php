<?php

namespace app\api\controller\ygame;

use app\common\controller\Api;

/**
 * 门店接口（官网动态门店档案）
 */
class Store extends Api
{
    protected $noNeedLogin = ['index', 'info'];
    protected $noNeedRight = ['*'];

    /**
     * 门店列表
     */
    public function index()
    {
        $page = (int)$this->request->param('page', 1);
        $limit = (int)$this->request->param('limit', 50);

        $subject = new \addons\ygame\service\Store();
        $data = $subject->getStoreList($page, $limit);
        $data['data'] = array_map([$this, 'formatRow'], $data['data']);
        $this->success('请求成功', $data);
    }

    /**
     * 门店详情（slug）
     */
    public function info()
    {
        $slug = trim((string)$this->request->param('slug', ''));
        $subject = new \addons\ygame\service\Store();
        $row = $subject->getStoreBySlug($slug);
        if (!$row) {
            $this->error('门店不存在');
        }
        $this->success('请求成功', $this->formatRow($row));
    }

    private function formatRow(array $row)
    {
        foreach (['image', 'image_en', 'image_jp'] as $field) {
            $row[$field] = $this->absoluteMedia($row[$field] ?? '');
        }
        $row['services'] = $this->splitCsv($row['services'] ?? '');
        $row['facilities'] = $this->splitCsv($row['facilities'] ?? '');
        return $row;
    }

    private function absoluteMedia($path)
    {
        $path = trim((string)$path);
        if ($path === '') {
            return '';
        }
        // 前端打包图（如 store-banner.png / shop-pic1.jpg）原样返回，由前端解析
        if (!preg_match('#^(https?:)?/#i', $path) && !preg_match('#^uploads/#i', $path)) {
            return $path;
        }
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }
        if ($path[0] !== '/') {
            $path = '/' . $path;
        }
        return $this->request->domain() . $path;
    }

    private function splitCsv($value)
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('trim', $value)));
        }
        $parts = preg_split('/\s*,\s*/', (string)$value, -1, PREG_SPLIT_NO_EMPTY);
        return $parts ?: [];
    }
}
