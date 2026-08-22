<?php

namespace app\api\controller\ygame;

use app\common\controller\Api;

/**
 * 文章接口
 */
class Article extends Api
{
    // 无需登录的接口,*表示全部
    protected $noNeedLogin = ['index', 'info'];
    // 无需鉴权的接口,*表示全部
    protected $noNeedRight = ['*'];

    /**
     * 获取文章列表
     * @throws \think\Exception
     */
    public function index()
    {
        $project_id = $this->request->post('project_id');
        if ($project_id === '' || $project_id === null) {
            $project_id = -1;
        }
        $page = $this->request->post('page') ?: 1;
        $limit = $this->request->post('limit') ?: 10;

        $where = ['project_id' => $project_id];

        $service = new \addons\ygame\service\Article();
        $data = $service->getArticleList($where, $page, $limit);
        foreach ($data['data'] as &$v) {
            $v['image'] = $this->toPublicUrl($v['image'] ?? '');
        }
        $this->success('请求成功', $data);
    }


    /**
     * 获取文章详情
     * @throws \think\Exception
     */
    public function info()
    {
        $id = $this->request->post('id');

        $service = new \addons\ygame\service\Article();
        $data = $service->getArticleInfo($id);
        $data['image'] = $this->toPublicUrl($data['image'] ?? '');
        if (!empty($data['content'])) {
            $data['content'] = $this->rewriteContentSrc($data['content']);
        }
        $this->success('请求成功', $data);
    }

    /**
     * 把上传路径转成当前访问域名下的绝对地址（本地 127.0.0.1 会替换成生产域名）
     */
    protected function toPublicUrl($url)
    {
        if ($url === '' || $url === null) {
            return $url;
        }
        $domain = rtrim($this->request->domain(), '/');
        if (preg_match('#^https?://#i', $url)) {
            return preg_replace('#^https?://(?:127\.0\.0\.1|localhost)(?::\d+)?#i', $domain, $url);
        }
        return $domain . '/' . ltrim($url, '/');
    }

    /**
     * 正文相对路径、以及本地调试域名，统一改成当前请求域名
     */
    protected function rewriteContentSrc($html)
    {
        $domain = rtrim($this->request->domain(), '/');
        $html = preg_replace('#src=(["\'])/([^/])#is', 'src=$1' . $domain . '/$2', $html);
        $html = preg_replace('#src=(["\'])https?://(?:127\.0\.0\.1|localhost)(?::\d+)?/#i', 'src=$1' . $domain . '/', $html);
        return $html;
    }

}
