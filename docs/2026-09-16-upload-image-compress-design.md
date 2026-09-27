# 上传图片压缩

## 目标
后台上传图片时自动压到约 100–200KB，不依赖服务器 GD / ImageMagick。

## 主方案：浏览器端压缩（已实现）
- 文件：`public/assets/js/require-upload.js`（已同步进 `require-backend.min.js`）
- 时机：Dropzone `transformFile`，**上传前**用 Canvas 压缩为 JPEG
- 配置：`application/extra/upload.php` → `browser_compress`
  - `enable`: true
  - `max_width`: 1600
  - `max_bytes`: 200KB
  - `quality`: 0.72（过大时自动降到约 0.42）
- 跳过：gif、svg、非图片；压完更大则仍传原文件

## 可选：服务端二次压缩
- `Upload.php` + `image_compress`：有 GD 或 ImageMagick 时再压一遍；没有则自动跳过
- 无服务器扩展时不影响上传

## 部署
覆盖 8091：
- `public/assets/js/require-upload.js`
- `public/assets/js/require-backend.min.js`
- `application/extra/upload.php`  
后台强刷缓存（Ctrl+F5）后新上传即生效。

## 非目标
- 不强制安装 GD / ImageMagick / PHP 8.2
- 不压缩视频
- 不自动重压历史已上传文件
