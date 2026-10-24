# vue3-ts-pinia-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

按实际部署入口选择构建命令：

| 部署入口 | 构建命令 | 环境文件 |
| --- | --- | --- |
| 当前 IP 站点 `http://8.210.181.83:8090/` | `npm run build:ip8090` | `.env.ip8090` |
| 域名站点 `http://www.yuhetangtcm.com/h5/` | `npm run build` | `.env.production` |

当前 IP 站点的发布命令：

```sh
npm run build:ip8090
```

该命令将静态资源路径设为 `/`，接口使用 `http://8.210.181.83:8091/api.php`。构建后，将 `dist` 内的全部文件和目录上传到前端站点根目录，包括 `index.html`、`js`、`css`、`images`、`media` 等。

`npm run build` 默认读取 `.env.production`，生成 `/h5/` 下的资源和路由路径，适用于表中对应的域名入口；抓取文件中的绝对链接使用该环境配置的域名。切换部署入口时需要使用对应命令重新构建。

### 艾草基地介绍视频

电脑端和手机端的 `/base` 页面默认播放约 94 秒的基地介绍片：

- 视频：`public/media/base-documentary.mp4`（720p，约 7.7 MiB，平均码率约 0.68 Mbps，已移除音轨）
- 封面：`public/media/base-documentary.jpg`

视频地址会跟随 `VITE_BASE_URL`，支持网站根目录和 `/h5/` 等子目录部署。电脑端和手机端均先显示封面，完整下载视频后再使用本地 Blob 地址静音自动循环播放；实际开始播放后才淡出封面，画面不显示播放按钮、进度条、音量、全屏或画中画等控制器。播放器在加载和播放时主动移除原生 `controls`，并通过样式隐藏浏览器的原生控制条及覆盖按钮，鼠标悬停、点击或右键均不唤出视频控件。下载期间不创建播放器，不再按 30 秒缓冲或 8 秒等待上限提前播放。离开页面或切换视频时会取消下载并释放本地视频资源。浏览器阻止自动播放或下载失败时保留封面，不叠加按钮或控制器。

内置视频采用 H.264 编码并将播放索引前置，文件体积较上一版减少约 32%。视频文件不含音轨，播放器也保持静音。电脑端和手机端的视频、封面地址均带版本参数，发布后会请求更新后的素材。

如需换成 CDN 上的视频，可在对应环境文件中设置 `VITE_DOCUMENTARY_URL`，例如：

```dotenv
VITE_DOCUMENTARY_URL=https://cdn.example.com/base-documentary.mp4
```

该配置优先于内置视频；留空时使用内置视频。MP4、WebM、OGG 地址使用完整下载后播放的视频组件，跨域 CDN 需要允许本站通过 CORS 下载视频。嵌入式播放页面地址使用 iframe，其播放方式由对应平台控制。修改环境配置后，需要重启开发服务或重新构建。

### 默认语言与分享信息

首次访问默认中文；`?lang=en`、`?lang=jp` 和已保存的用户语言选择仍然生效。页面正文位于公共 `main` 标签内，标题、描述、canonical、hreflang 和分享信息随页面与语言切换更新。

分享封面为 `public/images/og-cover.jpg`，尺寸 1200 × 630，使用已有品牌标识和门店照片。入口 HTML 包含默认中文分享信息，各页面加载后更新为对应标题、描述、语言和 URL。翻译文件中的标题使用全角 `｜`，避免半角 `|` 被 vue-i18n 当作复数规则解析。

### 站点地图与抓取说明

构建时根据 `VITE_BASE_URL` 和 `VITE_SITE_ORIGIN` 自动生成 `dist/sitemap.xml`、`dist/robots.txt`、`dist/llms.txt`。根目录 IP 构建与域名 `/h5/` 构建会使用各自入口，不需要手动批量替换域名。

页面清单在 `scripts/site-pages.ts`，目前包含 33 个页面和中文、英语、日语共 99 个 URL。静态页面的 `lastmod` 来自对应源码和文案的 Git 修改日期；后台新闻、门店、反馈没有可信更新时间时不填写，构建日期不作为内容更新时间。新增新闻或门店时，可同步更新该清单以补入站点地图与 `llms.txt`。

`public` 下的抓取文件保留默认域名部署版本；发布时使用本次构建后的 `dist` 文件。子目录部署时，搜索平台仍需能够访问域名根目录的 `robots.txt`：可将构建生成的 `robots.txt` 另放一份到域名根目录，或合并其中的 Sitemap 配置。

### History 路由与缺失资源

构建生成的 `dist/nginx-spa.conf` 已匹配当前根目录或 `/h5/` 入口。Nginx 发布时替换前端入口原有的 `location`，加入文件中的命名 `location` 和旧页面 301 规则，保留现有 PHP/API 配置。不要保留将所有 404 回落到首页的 `error_page` 规则。

Apache 使用 `public/.htaccess`，其相对路径同时支持根目录和子目录部署。合法页面刷新交给 SPA，现有静态文件直接返回，不存在的图片、文本和无效路径返回 404。新闻 ID 和门店 slug 对应记录是否存在，仍由详情页及后台接口判断。

### 首页背景视频

首页首屏按页面初次加载时的屏幕方向选择视频，旋转屏幕不切换素材：横屏默认 `public/media/home-banner-1080p.mp4`，浏览器报告 3G 或更慢网络、或开启省流模式时优先 `home-banner-720p.mp4`；竖屏默认 `home-banner-mobile-720x1280.mp4`，失败时回退 `home-banner-mobile-1080x1920.mp4`。首帧图分别为 `public/images/home-banner-poster.jpg` 和 `public/images/home-banner-mobile-poster.jpg`。旧的 `public/media/home-banner.mp4` 暂时保留，确认新素材上线后再清理。

封面先显示，页面空闲后再创建视频，`canplay` 时尝试播放，仅收到 `playing` 事件后才淡出封面；播放器保持 `autoplay muted loop playsinline`，同时显式绑定 `muted` HTML 特性以兼容 iOS/微信，不显示浏览器控件，视频加载失败时保留封面或尝试同方向的下一份素材。所有素材 URL 带 `?v=20261024`，后续换文件时更新版本号即可。

正式站将这 6 个新素材上传到阿里云 OSS，并通过国内 CDN 提供 HTTPS 访问。构建环境设置 `VITE_MEDIA_CDN_BASE` 为 CDN 素材根地址（例如 `https://static.example.com`）后，首页视频和首帧图会统一改走该域名；OSS 上保留 `media/`、`images/` 路径（网站部署在 `/h5/` 时需保留 `h5/media/`、`h5/images/`）。留空时使用当前宝塔站点的静态素材路径，可用于本地预览。CDN 需返回正确的 `Content-Type`（MP4 为 `video/mp4`、JPEG 为 `image/jpeg`）、支持 `Range` 请求；使用长缓存并在缓存键中保留版本参数 `v`。修改环境变量后重新构建前端。

2026-10-24 已将生产环境素材根地址配置为 `https://static.yuhetangtcm.com`，完成六个 CDN 文件的 HTTPS、完整哈希及 Range 验证，并通过本地生产构建中的浏览器播放检查。当前备案及中国内地加速区域切换、证书自动续期和 CDN 同步、宝塔发布及真机验收仍待完成，详见 `docs/home-banner-v5-deployment.md`。
