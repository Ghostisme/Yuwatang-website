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



    /** 需求2-19：禁止医疗功效表述 */

    private static $blockedWords = ['治好', '治愈', '疗效', '痊愈', '根治', '包治'];



    private function containsMedicalClaim($text)

    {

        foreach (self::$blockedWords as $word) {

            if (mb_strpos($text, $word) !== false) {

                return true;

            }

        }

        return false;

    }



    private function maskMedicalClaim($text)

    {

        foreach (self::$blockedWords as $word) {

            $text = str_replace($word, '***', $text);

        }

        return $text;

    }



    /**

     * 已审核反馈列表（需求2：展示墙，先审后发）

     */

    public function index()

    {

        $page = max(1, (int)$this->request->get('page', 1));

        $limit = min(50, max(1, (int)$this->request->get('limit', 20)));



        $query = Db::name('ygame_feedback')->where('status', 1);

        $total = $query->count();

        $list = $query

            ->field('id,name,content,createtime')

            ->order('createtime', 'desc')

            ->page($page, $limit)

            ->select();



        foreach ($list as &$row) {

            $row['content'] = $this->maskMedicalClaim($row['content']);

        }

        unset($row);



        $this->success('ok', [

            'total' => $total,

            'list'  => $list,

        ]);

    }



    /**

     * 提交反馈（需求2：昵称 + 文字，待审核后展示）

     */

    public function submit()

    {

        $name = trim((string)$this->request->post('name'));

        $content = trim((string)$this->request->post('content', ''));

        $phone = trim((string)$this->request->post('phone', ''));

        $storeName = trim((string)$this->request->post('store_name', ''));



        if ($name === '') {

            $this->error('请填写昵称');

        }

        if ($content === '') {

            $this->error('请填写反馈内容');

        }

        if ($this->containsMedicalClaim($name) || $this->containsMedicalClaim($content)) {

            $this->error('反馈内容请勿包含「治好」「治愈」「疗效」等医疗功效表述');

        }



        $data = [

            'name'       => mb_substr($name, 0, 50),

            'phone'      => $phone !== '' ? mb_substr($phone, 0, 20) : '-',

            'store_name' => $storeName !== '' ? mb_substr($storeName, 0, 100) : '-',

            'content'    => $content,

            'createtime' => time(),

            'ip'         => $this->request->ip(),

            'status'     => 0,

        ];



        $result = Db::name('ygame_feedback')->insert($data);

        if ($result) {

            $this->success('提交成功，审核通过后将展示在反馈墙');

        }

        $this->error('提交失败');

    }

}

