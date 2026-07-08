<?php

namespace app\admin\model\ygame;

use think\Model;


class Result extends Model
{

    

    

    // 表名
    protected $name = 'ygame_result';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];


    public function type()
    {
        return $this->belongsTo('WorkType', 'type_id', 'id', [], 'LEFT');
    }
    public function project()
    {
        return $this->belongsTo('Project', 'project_id', 'id', [], 'LEFT');
    }

    public function cert()
    {
        return $this->belongsTo('Cert', 'cert', 'id', [], 'LEFT');
    }







}
