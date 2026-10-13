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

`npm run build` 默认读取 `.env.production`，生成绑定 `www.yuhetangtcm.com/h5` 的资源地址，适用于表中对应的域名入口。切换部署入口时需要使用对应命令重新构建。

### 艾草基地介绍视频

电脑端和手机端的 `/base` 页面默认播放约 94 秒的基地介绍片：

- 视频：`public/media/base-documentary.mp4`（720p，约 7.7 MiB，平均码率约 0.68 Mbps，已移除音轨）
- 封面：`public/media/base-documentary.jpg`

视频地址会跟随 `VITE_BASE_URL`，支持网站根目录和 `/h5/` 等子目录部署。进入基地页即预加载视频，优先缓冲约 30 秒内容后静音自动播放，播放过程中继续后台缓冲，原生进度条显示已缓冲内容。首次预缓冲等待上限为 8 秒；若尚未达到 30 秒但已有可播放数据，则提前播放，避免一直停在封面。播放控件支持暂停、拖动进度和全屏。

内置视频采用 H.264 编码并将播放索引前置，文件体积较上一版减少约 32%，支持边下载边播放。视频文件不含音轨，播放器也保持静音。电脑端和手机端的视频、封面地址均带版本参数，发布后会请求更新后的素材。

如需换成 CDN 上的视频，可在对应环境文件中设置 `VITE_DOCUMENTARY_URL`，例如：

```dotenv
VITE_DOCUMENTARY_URL=https://cdn.example.com/base-documentary.mp4
```

该配置优先于内置视频；留空时使用内置视频。MP4、WebM、OGG 地址使用视频播放器，嵌入式播放页面地址使用 iframe。修改环境配置后，需要重启开发服务或重新构建。
