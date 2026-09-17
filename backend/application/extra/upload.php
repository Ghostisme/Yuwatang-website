<?php

//上传配置
return [
    /**
     * 上传地址,默认是本地上传
     */
    'uploadurl' => 'ajax/upload',
    /**
     * CDN地址
     */
    'cdnurl'    => '',
    /**
     * 文件保存格式
     */
    'savekey'   => '/uploads/{year}{mon}{day}/{filemd5}{.suffix}',
    /**
     * 最大可上传大小
     */
    'maxsize'   => '10mb',
    /**
     * 可上传的文件类型
     */
    'mimetype'  => 'jpg,png,bmp,jpeg,gif,webp,zip,rar,wav,mp4,mp3,webm',
    /**
     * 是否支持批量上传
     */
    'multiple'  => false,
    /**
     * 是否支持分片上传
     */
    'chunking'  => false,
    /**
     * 默认分片大小
     */
    'chunksize' => 2097152,
    /**
     * 完整URL模式
     */
    'fullmode' => false,
    /**
     * 缩略图样式
     */
    'thumbstyle' => '',
    /**
     * 上传落盘后自动压缩图片（GD）
     * - 优先建议用浏览器端压缩（require-upload.js），不依赖服务器扩展
     * - 服务端压缩保留为可选二次保险（无 GD/ImageMagick 时自动跳过）
     */
    'image_compress' => [
        'enable'      => true,
        'max_width'   => 1600,
        'max_bytes'   => 200 * 1024,
        'min_quality' => 42,
        'max_quality' => 82,
        'imagemagick_bin' => '',
    ],
    /**
     * 浏览器上传前压缩（Dropzone transformFile），不需要 GD
     */
    'browser_compress' => [
        'enable'     => true,
        'max_width'  => 1600,
        'max_bytes'  => 200 * 1024,
        'quality'    => 0.72,
    ],
];
