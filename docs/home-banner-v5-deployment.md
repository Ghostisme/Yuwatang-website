# 首页视频 v5：OSS / CDN 上线步骤

当前 Bucket：`website-frontend-oss`，华东 2（上海）。官网应用继续部署在宝塔，CDN 单独承载首页视频和首帧图。

## 当前配置与验证结果（2026-10-24）

素材域名 `https://static.yuhetangtcm.com` 已可用，DNS 的 `static` CNAME 指向阿里云实际分配的 `static.yuhetangtcm.com.queniuaa.com`。CDN 已开启 HTTPS 和“同账号 OSS 私有 Bucket 回源”，回源 HOST 为 `website-frontend-oss.oss-cn-shanghai.aliyuncs.com`，Bucket 保持私有。

六个素材的完整 HTTPS GET 均返回 `200`，文件大小和 SHA-256 与交付清单一致；`Range: bytes=0-1023` 均返回 `206`、1024 字节及正确的 `Content-Range`，内容类型正确，验证期间均观察到 CDN 缓存命中。验证保留真实域名的 Host、TLS SNI 和证书校验。

`frontend/.env.production` 已设置 `VITE_MEDIA_CDN_BASE=https://static.yuhetangtcm.com`，生产构建通过。桌面和手机视窗均已在本地生产构建中实际加载 CDN 视频与海报，播放、循环、方向选择和失败回退通过。构建产物位于 `frontend/dist/`，本次未向宝塔发布。

仍需完成的上线项：

- 因备案校验未通过，接入时使用了“全球（不包含中国内地）”；客户要求的中国内地 CDN 尚未完成，需完成备案后调整加速区域。
- 当前 Let's Encrypt 泛域名证书于 2027-01-22 到期。此次使用手动 DNS 验证并将证书上传 CDN，尚未配置自动续期及 CDN 证书同步；宝塔证书续期不会自动替换手动上传的 CDN 证书。
- 将本次 `frontend/dist/` 内容发布到宝塔现有前端站点，并用 iPhone Safari、微信及安卓手机在实际网络下验收。发布前备份前端文件，保留原有 PHP/API 配置和上传目录。

## 1. 先确认备案状态

客户截图中，`www.yuhetangtcm.com` 的“域名已备案”校验为红叉。先在阿里云 ICP 备案控制台核对 `yuhetangtcm.com` 的备案状态；尚未完成备案时，先完成备案，再选择中国内地 CDN 加速。已完成备案但仍校验失败时，核对备案状态和填写的域名，并由阿里云核查。

建议使用 `static.yuhetangtcm.com` 作为素材加速域名。保留官网 `www` 当前指向宝塔的解析，以免官网请求被送到 OSS。

## 2. 上传文件到现有 Bucket

进入 `website-frontend-oss` → 文件管理 → 文件列表。在 Bucket 根目录保留下列目录结构，目录名和文件名保持英文原样：

```text
media/
  home-banner-1080p.mp4
  home-banner-720p.mp4
  home-banner-mobile-720x1280.mp4
  home-banner-mobile-1080x1920.mp4
images/
  home-banner-poster.jpg
  home-banner-mobile-poster.jpg
```

可使用交付目录 `output/home-banner-v5-20261024/oss-upload/` 中的两个文件夹。`oss-upload.zip` 需要先在本地解压，再上传两个文件夹中的素材；仅上传 ZIP 文件不会得到可播放的视频 URL。

存储类型使用标准存储。Bucket 可保留私有权限，稍后为 CDN 开启私有 Bucket 回源授权。MP4 的 `Content-Type` 为 `video/mp4`，JPEG 为 `image/jpeg`。

## 3. 添加 CDN 加速域名

进入阿里云 CDN 控制台 → 域名管理 → 添加域名：

| 字段 | 填写值 |
| --- | --- |
| 加速域名 | `static.yuhetangtcm.com`（建议值，以实际配置为准） |
| 加速区域 | 中国内地，先通过备案校验 |
| 业务类型 | 视频点播 |
| 源站类型 | OSS 域名 |
| 源站 | 下拉选择 `website-frontend-oss` 对应的 Bucket 域名 |

从 CDN 以“OSS 域名”类型添加源站时，回源 HOST 默认使用 Bucket 域名；先完成这条链路即可，无需将官网 `www` 改绑 OSS。

若出现域名所有权验证，按该页面给出的 TXT 记录完成验证。域名添加完成后，复制阿里云分配的 CNAME 目标。

## 4. 配置 DNS、HTTPS 和回源

1. 在 `yuhetangtcm.com` 的权威 DNS 解析控制台新增一条记录：主机记录 `static`，类型 `CNAME`，记录值为 CDN 分配的完整 CNAME。保留现有 `www`、`@` 等官网记录。
2. 在 CDN → 该加速域名 → 回源配置 → 阿里云 OSS 私有 Bucket 回源，开启功能并选择“同账号回源”，按控制台完成授权。
3. 为 `static.yuhetangtcm.com` 配置 HTTPS 证书，开启 HTTPS 访问。
4. 在 CDN 域名的“视频相关”中配置 Range 回源，选择跟随客户端 Range 请求或开启 Range 回源；初次可保持分片大小默认值。
5. 为 `mp4`、`jpg` 配置较长的缓存时间，例如 30 天。缓存键保留版本参数 `v`；可关闭“忽略参数”，或使用“保留指定参数”模式并填写 `v`，使用自定义 Cache Key 时也保留 `v`。后续替换同名 OSS 文件后，刷新对应 CDN URL，再更新前端版本号并发布。

## 5. 验证并接入前端

把下面两个地址中的域名替换成最终配置的 HTTPS 加速域名，在浏览器中验证：

```text
https://static.yuhetangtcm.com/media/home-banner-1080p.mp4?v=20261024
https://static.yuhetangtcm.com/images/home-banner-mobile-poster.jpg?v=20261024
```

接入时修改 `frontend/.env.production`：

```dotenv
VITE_MEDIA_CDN_BASE=https://static.yuhetangtcm.com
```

该值只填素材根地址，不追加 `/media`、文件名或 OSS 临时签名。运行 `npm run build`，将 `frontend/dist/` 内容发布到现有宝塔前端站点。构建变量留空时使用本站素材，仅作为本地预览或 CDN 尚未配置时的回退部署方式。

当前生产环境资源根路径是 `/`。若后续改用 `/h5/` 子目录部署，OSS 目录也要包含 `h5/media/`、`h5/images/`。

验收时检查六个 URL 均返回正确内容类型；发送 `Range: bytes=0-1023` 的 MP4 请求应返回 `206` 和正确的 `Content-Range`。检查首页实际请求走 CDN、无额外音轨和控件，横竖屏选择正确，静态海报在播放前可见，视频实际播放后淡出并循环。iPhone Safari、iPhone 微信、安卓微信及手机 4G 首屏速度需用真机验证。

## 本次本地验证

四个视频均已验证为 H.264、无音轨、25 fps、约 26 秒，`moov` 位于媒体数据之前（faststart），六个文件与客户原文件 SHA-256 相同。生产构建通过。

Microsoft Edge 的本地浏览器验证覆盖：桌面横屏、手机竖屏、手机横屏、桌面竖屏、正方形视窗、3G 选择轻量版、省流模式、桌面备用视频、移动端备用视频、全部视频失败保留海报，以及本地 206 Range 请求。切换 CDN 后已重新执行，上述 11 项检查全部通过，实际视频和海报 URL 均指向 `https://static.yuhetangtcm.com` 并携带 `?v=20261024`。额外检查了 HTML `muted` 特性、无控件、实际循环、方向保持、无水平溢出和无脚本异常。验证时只模拟了未启动的新闻/门店业务 API，视频和海报实际通过 CDN 加载；本地 Range 测试之外，另对六个 CDN URL 执行了完整 GET、哈希比对和 Range 请求。

验证记录位于 `output/home-banner-v5-20261024/cdn-verification.json`、`cdn-assets-verification.json`；浏览器截图为同目录中的 `cdn-desktop.png`、`cdn-mobile.png` 和 `cdn-poster-fallback.png`。本机代理 DNS 返回虚拟地址，因此验证时仅为测试进程指定权威 DNS 返回的 CDN 节点 IP，保留真实域名与 TLS 校验；这不是生产 DNS 配置，不应把该节点 IP 写成域名 A 记录。

此前全项目 `vue-tsc --noEmit -p tsconfig.app.json` 报告 `BaseProductSection.vue`、`i18n.ts` 和 `pc/Shop.vue` 中未改动的现有类型问题；本次新增首页视频代码未报类型错误。CDN 切换后的生产构建已通过，真机验收仍待发布后进行。

## 官方资料

- [通过 CDN 加速 OSS](https://help.aliyun.com/zh/oss/user-guide/cdn-acceleration)
- [配置 Range 回源](https://help.aliyun.com/zh/cdn/user-guide/object-chunking)
- [忽略参数与缓存键](https://help.aliyun.com/zh/cdn/user-guide/ignore-parameters)
