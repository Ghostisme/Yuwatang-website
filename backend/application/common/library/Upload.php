<?php

namespace app\common\library;

use app\common\exception\UploadException;
use app\common\model\Attachment;
use fast\Random;
use FilesystemIterator;
use think\Config;
use think\File;
use think\Hook;

/**
 * 文件上传类
 */
class Upload
{

    protected $merging = false;

    protected $chunkDir = null;

    protected $config = [];

    protected $error = '';

    /**
     * @var File
     */
    protected $file = null;
    protected $fileInfo = null;

    public function __construct($file = null)
    {
        $this->config = Config::get('upload');
        $this->chunkDir = RUNTIME_PATH . 'chunks';
        if ($file) {
            $this->setFile($file);
        }
    }

    /**
     * 设置分片目录
     * @param $dir
     */
    public function setChunkDir($dir)
    {
        $this->chunkDir = $dir;
    }

    /**
     * 获取文件
     * @return File
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * 设置文件
     * @param $file
     * @throws UploadException
     */
    public function setFile($file)
    {
        if (empty($file)) {
            throw new UploadException(__('No file upload or server upload limit exceeded'));
        }

        $fileInfo = $file->getInfo();
        $suffix = strtolower(pathinfo($fileInfo['name'], PATHINFO_EXTENSION));
        $suffix = $suffix && preg_match("/^[a-zA-Z0-9]+$/", $suffix) ? $suffix : 'file';
        $fileInfo['suffix'] = $suffix;
        $fileInfo['imagewidth'] = 0;
        $fileInfo['imageheight'] = 0;

        $this->file = $file;
        $this->fileInfo = $fileInfo;
        $this->checkExecutable();
    }

    /**
     * 检测是否为可执行脚本
     * @return bool
     * @throws UploadException
     */
    protected function checkExecutable()
    {
        //禁止上传PHP和HTML文件
        if (in_array($this->fileInfo['type'], ['text/x-php', 'text/html']) || in_array($this->fileInfo['suffix'], ['php', 'html', 'htm', 'phar', 'phtml']) || preg_match("/^php(.*)/i", $this->fileInfo['suffix'])) {
            throw new UploadException(__('Uploaded file format is limited'));
        }
        return true;
    }

    /**
     * 检测文件类型
     * @return bool
     * @throws UploadException
     */
    protected function checkMimetype()
    {
        $mimetypeArr = explode(',', strtolower($this->config['mimetype']));
        $typeArr = explode('/', $this->fileInfo['type']);
        //Mimetype值不正确
        if (stripos($this->fileInfo['type'], '/') === false) {
            throw new UploadException(__('Uploaded file format is limited'));
        }
        //验证文件后缀
        if ($this->config['mimetype'] === '*'
            || in_array($this->fileInfo['suffix'], $mimetypeArr) || in_array('.' . $this->fileInfo['suffix'], $mimetypeArr)
            || in_array($typeArr[0] . "/*", $mimetypeArr) || (in_array($this->fileInfo['type'], $mimetypeArr) && stripos($this->fileInfo['type'], '/') !== false)) {
            return true;
        }

        throw new UploadException(__('Uploaded file format is limited'));
    }

    /**
     * 检测是否图片
     * @param bool $force
     * @return bool
     * @throws UploadException
     */
    protected function checkImage($force = false)
    {
        //验证是否为图片文件
        if (in_array($this->fileInfo['type'], ['image/gif', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/png', 'image/webp']) || in_array($this->fileInfo['suffix'], ['gif', 'jpg', 'jpeg', 'bmp', 'png', 'webp'])) {
            $imgInfo = getimagesize($this->fileInfo['tmp_name']);
            if (!$imgInfo || !isset($imgInfo[0]) || !isset($imgInfo[1])) {
                throw new UploadException(__('Uploaded file is not a valid image'));
            }
            $this->fileInfo['imagewidth'] = isset($imgInfo[0]) ? $imgInfo[0] : 0;
            $this->fileInfo['imageheight'] = isset($imgInfo[1]) ? $imgInfo[1] : 0;
            return true;
        } else {
            return !$force;
        }
    }

    /**
     * 检测文件大小
     * @throws UploadException
     */
    protected function checkSize()
    {
        preg_match('/([0-9\.]+)(\w+)/', $this->config['maxsize'], $matches);
        $size = $matches ? $matches[1] : $this->config['maxsize'];
        $type = $matches ? strtolower($matches[2]) : 'b';
        $typeDict = ['b' => 0, 'k' => 1, 'kb' => 1, 'm' => 2, 'mb' => 2, 'gb' => 3, 'g' => 3];
        $size = (int)($size * pow(1024, isset($typeDict[$type]) ? $typeDict[$type] : 0));
        if ($this->fileInfo['size'] > $size) {
            throw new UploadException(__('File is too big (%sMiB), Max filesize: %sMiB.',
                round($this->fileInfo['size'] / pow(1024, 2), 2),
                round($size / pow(1024, 2), 2)));
        }
    }

    /**
     * 获取后缀
     * @return string
     */
    public function getSuffix()
    {
        return $this->fileInfo['suffix'] ?: 'file';
    }

    /**
     * 获取存储的文件名
     * @param string $savekey  保存路径
     * @param string $filename 文件名
     * @param string $md5      文件MD5
     * @param string $category 分类
     * @return mixed|null
     */
    public function getSavekey($savekey = null, $filename = null, $md5 = null, $category = null)
    {
        if ($filename) {
            $suffix = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        } else {
            $suffix = $this->fileInfo['suffix'] ?? '';
        }
        $suffix = $suffix && preg_match("/^[a-zA-Z0-9]+$/", $suffix) ? $suffix : 'file';
        $filename = $filename ? $filename : ($this->fileInfo['name'] ?? 'unknown');
        $filename = xss_clean(strip_tags(htmlspecialchars($filename)));
        $fileprefix = substr($filename, 0, strripos($filename, '.'));
        $md5 = $md5 ? $md5 : (isset($this->fileInfo['tmp_name']) ? md5_file($this->fileInfo['tmp_name']) : '');
        $category = $category ? $category : request()->post('category');
        $category = $category ? xss_clean($category) : 'all';
        $replaceArr = [
            '{year}'       => date("Y"),
            '{mon}'        => date("m"),
            '{day}'        => date("d"),
            '{hour}'       => date("H"),
            '{min}'        => date("i"),
            '{sec}'        => date("s"),
            '{random}'     => Random::alnum(16),
            '{random32}'   => Random::alnum(32),
            '{category}'   => $category ? $category : '',
            '{filename}'   => substr($filename, 0, 100),
            '{fileprefix}' => substr($fileprefix, 0, 100),
            '{suffix}'     => $suffix,
            '{.suffix}'    => $suffix ? '.' . $suffix : '',
            '{filemd5}'    => $md5,
        ];
        $savekey = $savekey ? $savekey : $this->config['savekey'];
        $savekey = str_replace(array_keys($replaceArr), array_values($replaceArr), $savekey);

        return $savekey;
    }

    /**
     * 清理分片文件
     * @param $chunkid
     */
    public function clean($chunkid)
    {
        if (!preg_match('/^[a-z0-9\-]{36}$/', $chunkid)) {
            throw new UploadException(__('Invalid parameters'));
        }
        $iterator = new \GlobIterator($this->chunkDir . DS . $chunkid . '-*', FilesystemIterator::KEY_AS_FILENAME);
        $array = iterator_to_array($iterator);
        foreach ($array as $index => &$item) {
            $sourceFile = $item->getRealPath() ?: $item->getPathname();
            $item = null;
            @unlink($sourceFile);
        }
    }

    /**
     * 合并分片文件
     * @param string $chunkid
     * @param int    $chunkcount
     * @param string $filename
     * @return attachment|\think\Model
     * @throws UploadException
     */
    public function merge($chunkid, $chunkcount, $filename)
    {
        if (!preg_match('/^[a-z0-9\-]{36}$/', $chunkid)) {
            throw new UploadException(__('Invalid parameters'));
        }

        $filePath = $this->chunkDir . DS . $chunkid;

        $completed = true;
        //检查所有分片是否都存在
        for ($i = 0; $i < $chunkcount; $i++) {
            if (!file_exists("{$filePath}-{$i}.part")) {
                $completed = false;
                break;
            }
        }
        if (!$completed) {
            $this->clean($chunkid);
            throw new UploadException(__('Chunk file info error'));
        }

        //如果所有文件分片都上传完毕，开始合并
        $uploadPath = $filePath;

        if (!$destFile = @fopen($uploadPath, "wb")) {
            $this->clean($chunkid);
            throw new UploadException(__('Chunk file merge error'));
        }
        if (flock($destFile, LOCK_EX)) { // 进行排他型锁定
            for ($i = 0; $i < $chunkcount; $i++) {
                $partFile = "{$filePath}-{$i}.part";
                if (!$handle = @fopen($partFile, "rb")) {
                    break;
                }
                while ($buff = fread($handle, filesize($partFile))) {
                    fwrite($destFile, $buff);
                }
                @fclose($handle);
                @unlink($partFile); //删除分片
            }

            flock($destFile, LOCK_UN);
        }
        @fclose($destFile);

        $attachment = null;
        try {
            $file = new File($uploadPath);
            $info = [
                'name'     => $filename,
                'type'     => $file->getMime(),
                'tmp_name' => $uploadPath,
                'error'    => 0,
                'size'     => $file->getSize()
            ];
            $file->setSaveName($filename)->setUploadInfo($info);
            $file->isTest(true);

            //重新设置文件
            $this->setFile($file);

            unset($file);
            $this->merging = true;

            //允许大文件
            $this->config['maxsize'] = "1024G";

            $attachment = $this->upload();
        } catch (\Exception $e) {
            @unlink($destFile);
            throw new UploadException($e->getMessage());
        }
        return $attachment;
    }

    /**
     * 分片上传
     * @throws UploadException
     */
    public function chunk($chunkid, $chunkindex, $chunkcount, $chunkfilesize = null, $chunkfilename = null, $direct = false)
    {

        if ($this->fileInfo['type'] != 'application/octet-stream') {
            throw new UploadException(__('Uploaded file format is limited'));
        }

        if (!preg_match('/^[a-z0-9\-]{36}$/', $chunkid)) {
            throw new UploadException(__('Invalid parameters'));
        }

        $destDir = RUNTIME_PATH . 'chunks';
        $fileName = $chunkid . "-" . $chunkindex . '.part';
        $destFile = $destDir . DS . $fileName;
        if (!is_dir($destDir)) {
            @mkdir($destDir, 0755, true);
        }
        if (!move_uploaded_file($this->file->getPathname(), $destFile)) {
            throw new UploadException(__('Chunk file write error'));
        }

        $file = new File($destFile);
        $info = [
            'name'     => $fileName,
            'type'     => $file->getMime(),
            'tmp_name' => $destFile,
            'error'    => 0,
            'size'     => $file->getSize()
        ];
        $file->setSaveName($fileName)->setUploadInfo($info);
        $this->setFile($file);
        return $file;
    }

    /**
     * 普通上传
     * @return \app\common\model\attachment|\think\Model
     * @throws UploadException
     */
    public function upload($savekey = null)
    {
        if (empty($this->file)) {
            throw new UploadException(__('No file upload or server upload limit exceeded'));
        }

        $this->checkSize();
        $this->checkExecutable();
//        $this->checkMimetype();
        $this->checkImage();

        $savekey = $savekey ? $savekey : $this->getSavekey();
        $savekey = '/' . ltrim($savekey, '/');
        $uploadDir = substr($savekey, 0, strripos($savekey, '/') + 1);
        $fileName = substr($savekey, strripos($savekey, '/') + 1);

        $destDir = ROOT_PATH . 'public' . str_replace('/', DS, $uploadDir);

        $sha1 = $this->file->hash();

        //如果是合并文件
        if ($this->merging) {
            if (!$this->file->check()) {
                throw new UploadException($this->file->getError());
            }
            $destFile = $destDir . $fileName;
            $sourceFile = $this->file->getRealPath() ?: $this->file->getPathname();
            $info = $this->file->getInfo();
            $this->file = null;
            if (!is_dir($destDir)) {
                @mkdir($destDir, 0755, true);
            }
            rename($sourceFile, $destFile);
            $file = new File($destFile);
            $file->setSaveName($fileName)->setUploadInfo($info);
        } else {
            $file = $this->file->move($destDir, $fileName);
            if (!$file) {
                // 上传失败获取错误信息
                throw new UploadException($this->file->getError());
            }
        }
        $this->file = $file;

        // 落盘后按需压缩展示图，回写尺寸/体积/sha1
        $savedPath = $destDir . $file->getSaveName();
        $this->compressSavedImage($savedPath);
        // png/bmp/webp 可能已转为 .jpg，需用最新文件名
        $savedPath = $destDir . $this->file->getSaveName();
        clearstatcache(true, $savedPath);
        $sha1 = is_file($savedPath) ? (@sha1_file($savedPath) ?: $sha1) : $sha1;
        $this->fileInfo['size'] = is_file($savedPath) ? (@filesize($savedPath) ?: $this->fileInfo['size']) : $this->fileInfo['size'];
        if (is_file($savedPath)) {
            $imgInfo = @getimagesize($savedPath);
            if ($imgInfo) {
                $this->fileInfo['imagewidth'] = isset($imgInfo[0]) ? (int)$imgInfo[0] : $this->fileInfo['imagewidth'];
                $this->fileInfo['imageheight'] = isset($imgInfo[1]) ? (int)$imgInfo[1] : $this->fileInfo['imageheight'];
                if (!empty($imgInfo['mime'])) {
                    $this->fileInfo['type'] = $imgInfo['mime'];
                }
            }
        }

        $category = request()->post('category');
        $category = array_key_exists($category, config('site.attachmentcategory') ?? []) ? $category : '';
        $auth = Auth::instance();
        $params = array(
            'admin_id'    => (int)session('admin.id'),
            'user_id'     => (int)$auth->id,
            'filename'    => mb_substr(htmlspecialchars(strip_tags($this->fileInfo['name'])), 0, 100),
            'category'    => $category,
            'filesize'    => $this->fileInfo['size'],
            'imagewidth'  => $this->fileInfo['imagewidth'],
            'imageheight' => $this->fileInfo['imageheight'],
            'imagetype'   => $this->fileInfo['suffix'],
            'imageframes' => 0,
            'mimetype'    => $this->fileInfo['type'],
            'url'         => $uploadDir . $this->file->getSaveName(),
            'uploadtime'  => time(),
            'storage'     => 'local',
            'sha1'        => $sha1,
            'extparam'    => '',
        );
        $attachment = new Attachment();
        $attachment->data(array_filter($params));
        $attachment->save();

        \think\Hook::listen("upload_after", $attachment);
        return $attachment;
    }

    /**
     * 设置错误信息
     * @param $msg
     */
    public function setError($msg)
    {
        $this->error = $msg;
    }

    /**
     * 获取错误信息
     * @return string
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * 上传落盘后压缩图片（失败则保留原图，不影响上传）
     * 优先 GD；无 GD 时尝试 ImageMagick 命令行（convert/magick）
     * @param string $path 绝对路径
     */
    protected function compressSavedImage($path)
    {
        $cfg = $this->config['image_compress'] ?? [];
        if (empty($cfg['enable']) || !is_file($path)) {
            return;
        }

        $suffix = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($suffix, ['jpg', 'jpeg', 'png', 'bmp', 'webp'], true)) {
            return;
        }

        $maxWidth = (int)($cfg['max_width'] ?? 1600);
        $maxBytes = (int)($cfg['max_bytes'] ?? (200 * 1024));
        $minQ = (int)($cfg['min_quality'] ?? 42);
        $maxQ = (int)($cfg['max_quality'] ?? 82);
        if ($maxWidth < 320) {
            $maxWidth = 1600;
        }
        if ($maxBytes < 32 * 1024) {
            $maxBytes = 200 * 1024;
        }
        if ($minQ < 20) {
            $minQ = 20;
        }
        if ($maxQ > 95) {
            $maxQ = 95;
        }
        if ($minQ > $maxQ) {
            $minQ = $maxQ;
        }

        $size = @filesize($path);
        $info = @getimagesize($path);
        if (!$info || empty($info[0]) || empty($info[1])) {
            return;
        }
        $srcW = (int)$info[0];
        if ($size !== false && $size <= $maxBytes && $srcW <= $maxWidth) {
            return;
        }

        $best = null;
        if (extension_loaded('gd')) {
            $best = $this->compressWithGd($path, $suffix, $info, $maxWidth, $maxBytes, $minQ, $maxQ);
        }
        if (!$best) {
            $best = $this->compressWithImageMagick($path, $maxWidth, $maxBytes, $minQ, $maxQ, $cfg);
        }
        if (!$best || !is_file($best)) {
            return;
        }

        $bestSize = @filesize($best);
        if ($bestSize === false || ($size !== false && $bestSize >= $size)) {
            @unlink($best);
            return;
        }

        $this->replaceWithCompressedFile($path, $suffix, $best);
    }

    /**
     * @param string $path
     * @param string $suffix
     * @param array  $info
     * @param int    $maxWidth
     * @param int    $maxBytes
     * @param int    $minQ
     * @param int    $maxQ
     * @return string|null 临时最佳文件路径
     */
    protected function compressWithGd($path, $suffix, $info, $maxWidth, $maxBytes, $minQ, $maxQ)
    {
        $srcW = (int)$info[0];
        $srcH = (int)$info[1];
        $src = $this->gdCreateFromFile($path, $suffix, $info);
        if (!$src) {
            return null;
        }

        $dstW = $srcW;
        $dstH = $srcH;
        if ($srcW > $maxWidth) {
            $dstW = $maxWidth;
            $dstH = (int)max(1, round($srcH * ($maxWidth / $srcW)));
        }

        $dst = imagecreatetruecolor($dstW, $dstH);
        if (!$dst) {
            imagedestroy($src);
            return null;
        }

        $white = imagecolorallocate($dst, 255, 255, 255);
        imagefill($dst, 0, 0, $white);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);
        imagedestroy($src);

        $tmp = $path . '.__compress.tmp';
        $best = null;
        $bestSize = PHP_INT_MAX;
        for ($q = $maxQ; $q >= $minQ; $q -= 8) {
            if (!@imagejpeg($dst, $tmp, $q)) {
                continue;
            }
            $bytes = @filesize($tmp);
            if ($bytes === false) {
                continue;
            }
            if ($bytes < $bestSize) {
                if ($best && is_file($best)) {
                    @unlink($best);
                }
                $best = $tmp . '.' . $q;
                @rename($tmp, $best);
                $bestSize = $bytes;
            } else {
                @unlink($tmp);
            }
            if ($bytes <= $maxBytes) {
                break;
            }
        }
        imagedestroy($dst);
        @unlink($tmp);

        return ($best && is_file($best)) ? $best : null;
    }

    /**
     * ImageMagick CLI 兜底（宝塔 PHP 扩展列表无 gd 时常用）
     * 需要系统已装 ImageMagick，且 PHP 未禁用 exec/shell_exec
     *
     * @return string|null
     */
    protected function compressWithImageMagick($path, $maxWidth, $maxBytes, $minQ, $maxQ, $cfg)
    {
        $bin = $this->resolveImageMagickBin($cfg);
        if (!$bin || !$this->canRunShell()) {
            return null;
        }

        $tmp = $path . '.__im.tmp.jpg';
        $best = null;
        $bestSize = PHP_INT_MAX;
        for ($q = $maxQ; $q >= $minQ; $q -= 8) {
            @unlink($tmp);
            // convert in.jpg -resize 1600x\> -quality 72 out.jpg
            $cmd = sprintf(
                '%s %s -resize %dx\\> -quality %d %s 2>/dev/null',
                $bin,
                escapeshellarg($path),
                (int)$maxWidth,
                (int)$q,
                escapeshellarg($tmp)
            );
            @exec($cmd, $output, $code);
            if ($code !== 0 || !is_file($tmp)) {
                continue;
            }
            $bytes = @filesize($tmp);
            if ($bytes === false) {
                continue;
            }
            if ($bytes < $bestSize) {
                if ($best && is_file($best)) {
                    @unlink($best);
                }
                $best = $tmp . '.' . $q;
                @rename($tmp, $best);
                $bestSize = $bytes;
            } else {
                @unlink($tmp);
            }
            if ($bytes <= $maxBytes) {
                break;
            }
        }
        @unlink($tmp);

        return ($best && is_file($best)) ? $best : null;
    }

    /**
     * @param array $cfg
     * @return string|null 可执行命令前缀，如 /usr/bin/convert 或 magick
     */
    protected function resolveImageMagickBin($cfg)
    {
        $configured = trim((string)($cfg['imagemagick_bin'] ?? ''));
        $candidates = array_filter([
            $configured,
            'magick',
            'convert',
            '/usr/bin/magick',
            '/usr/bin/convert',
            '/usr/local/bin/magick',
            '/usr/local/bin/convert',
        ]);
        foreach ($candidates as $bin) {
            if ($bin === 'magick' || $bin === 'convert' || is_executable($bin)) {
                // magick 新版：magick input.jpg ...
                if ($bin === 'magick' || substr($bin, -6) === 'magick') {
                    return escapeshellcmd($bin);
                }
                return escapeshellcmd($bin);
            }
        }
        // which
        if ($this->canRunShell()) {
            foreach (['magick', 'convert'] as $name) {
                $out = [];
                @exec('command -v ' . escapeshellarg($name) . ' 2>/dev/null', $out, $code);
                if ($code === 0 && !empty($out[0])) {
                    return escapeshellcmd(trim($out[0]));
                }
            }
        }
        return null;
    }

    /**
     * @return bool
     */
    protected function canRunShell()
    {
        if (!function_exists('exec')) {
            return false;
        }
        $disabled = array_map('trim', explode(',', (string)ini_get('disable_functions')));
        return !in_array('exec', $disabled, true);
    }

    /**
     * @param string $path   原文件
     * @param string $suffix 原后缀
     * @param string $best   压缩临时文件
     */
    protected function replaceWithCompressedFile($path, $suffix, $best)
    {
        if (in_array($suffix, ['jpg', 'jpeg'], true)) {
            @unlink($path);
            @rename($best, $path);
            return;
        }

        $jpgPath = preg_replace('/\.[^.]+$/', '.jpg', $path);
        @unlink($path);
        @rename($best, $jpgPath);
        if ($this->file && method_exists($this->file, 'setSaveName')) {
            $this->file->setSaveName(basename($jpgPath));
        }
        $this->fileInfo['suffix'] = 'jpg';
        $this->fileInfo['type'] = 'image/jpeg';
    }

    /**
     * @param string $path
     * @param string $suffix
     * @param array  $info getimagesize 结果
     * @return resource|\GdImage|false
     */
    protected function gdCreateFromFile($path, $suffix, $info)
    {
        $mime = isset($info['mime']) ? strtolower($info['mime']) : '';
        if ($mime === 'image/jpeg' || in_array($suffix, ['jpg', 'jpeg'], true)) {
            return @imagecreatefromjpeg($path);
        }
        if ($mime === 'image/png' || $suffix === 'png') {
            return @imagecreatefrompng($path);
        }
        if ($mime === 'image/webp' || $suffix === 'webp') {
            return function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false;
        }
        if ($mime === 'image/bmp' || $mime === 'image/x-ms-bmp' || $suffix === 'bmp') {
            return function_exists('imagecreatefrombmp') ? @imagecreatefrombmp($path) : false;
        }
        return false;
    }
}
