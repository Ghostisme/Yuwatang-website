import { execFileSync } from "node:child_process"
import { readFileSync, statSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import type { Plugin, ResolvedConfig } from "vite"
import zh from "../src/locales/zh"
import { SHARE_IMAGE_PATH } from "../src/config/siteMeta"
import { sitePages, type SitePage } from "./site-pages"

const locales = ["zh", "en", "jp"] as const
const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

const siteUrlFromEnv = (env: Record<string, string>) => {
  const origin = env.VITE_SITE_ORIGIN || "https://www.yuhetangtcm.com"
  const url = new URL(env.VITE_BASE_URL || "/", `${origin}/`)
  url.pathname = `${url.pathname.replace(/\/$/, "")}/`
  url.search = ""
  url.hash = ""
  return url
}

const pageUrl = (site: URL, path: string, lang: string) => {
  const url = new URL(path.replace(/^\//, ""), site)
  url.searchParams.set("lang", lang)
  return url.href
}

/** 仅使用可核实的源码修改时间；后台动态内容没有更新时间时不伪造 lastmod。 */
const lastModified = (root: string, page: SitePage): string | undefined => {
  if (page.dynamic) return undefined
  const sources = [
    "index.html",
    "src/locales/zh.ts",
    "src/locales/req2-en.ts",
    "src/locales/req2-jp.ts",
    `src/views/pc/${page.view}.vue`,
    `src/views/mobile/${page.view}.vue`
  ]
  if (page.view === "ServiceDetail") sources.push("src/config/services.ts", "src/config/serviceFaqs.ts")
  if (page.view === "Faq" || page.view === "ServiceDetail") {
    sources.push("src/locales/faq-zh.ts", "src/locales/faq-en.ts", "src/locales/faq-jp.ts")
  }
  try {
    const runGit = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
    const committed = runGit(["log", "-1", "--format=%cI", "--", ...sources])
    if (!committed) return undefined
    const dates = [new Date(committed).getTime()]
    const changed = runGit(["diff", "--name-only", "HEAD", "--", ...sources])
    for (const file of changed.split(/\r?\n/).filter(Boolean)) {
      // Git 可能输出仓库根目录路径，stat 只用于当前实际存在的源文件。
      const relative = file.startsWith("frontend/") ? file.slice("frontend/".length) : file
      try { dates.push(statSync(resolve(root, relative)).mtimeMs) } catch { /* removed file */ }
    }
    return new Date(Math.max(...dates)).toISOString().slice(0, 10)
  } catch {
    // ZIP 或无 Git 的发布环境保留 URL，不把构建日期冒充内容更新时间。
    return undefined
  }
}

const renderSitemap = (site: URL, root: string) => {
  const entries = sitePages.flatMap((page) => {
    const modified = lastModified(root, page)
    return locales.map((lang) => [
      "  <url>",
      `    <loc>${xmlEscape(pageUrl(site, page.path, lang))}</loc>`,
      ...(modified ? [`    <lastmod>${modified}</lastmod>`] : []),
      "  </url>"
    ].join("\n"))
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`
}

const renderLlms = (site: URL) => [
  "# 裕和堂 Yu Health",
  "",
  `> ${zh.seo.home.description}`,
  "",
  "## 品牌与服务",
  "",
  `- ${zh.seo.about.description}`,
  "- 服务：扶阳艾灸、中医推拿、草本精油 SPA、香薰足疗。",
  "- 更多传统调理：拔罐、刮痧、古法采耳、精致扦脚、小儿推拿。",
  `- ${zh.seo.base.description}`,
  "",
  "## 官网页面",
  "",
  ...sitePages.map((page) => `- [${page.label}](${pageUrl(site, page.path, "zh")})`),
  "",
  "## 语言与联系方式",
  "",
  `- [中文官网](${pageUrl(site, "/", "zh")})`,
  `- [English](${pageUrl(site, "/", "en")})`,
  `- [日本語](${pageUrl(site, "/", "jp")})`,
  "- 预约与咨询邮箱：tty12138@foxmail.com。",
  "- 门店地址、电话、营业时间和到店信息以官网门店详情为准。",
  "- 预约、消费、会员卡及服务注意事项以官网 FAQ 和门店说明为准。",
  "",
  "## 其他资源",
  "",
  `- [站点地图](${new URL("sitemap.xml", site).href})`,
  ""
].join("\n")

const renderRobots = (site: URL) => [
  "User-agent: *",
  "Allow: /",
  "Disallow: /yuhetangAdmin.php",
  "Disallow: /api.php",
  "Disallow: /admin/",
  "",
  `Sitemap: ${new URL("sitemap.xml", site).href}`,
  ""
].join("\n")

/** 根目录配置保持可直接使用，子目录构建时生成对应入口的配置。 */
const renderNginx = (site: URL, root: string) => {
  const template = readFileSync(resolve(root, "nginx-spa.conf"), "utf8")
  if (site.pathname === "/") return template
  const base = site.pathname
  const regexBase = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return template
    .replace("location / {", `location ${base} {`)
    .replaceAll("/index.html", `${base}index.html`)
    .replaceAll("^/", `^${regexBase}`)
    .replace(/(rewrite\s+\S+\s+)\/(about|contact|services|stores)(\b)/g, `$1${base}$2$3`)
    .replace(/(rewrite\s+\S+\s+)\/\s+permanent;/g, `$1${base} permanent;`)
}

export function websiteSeoAssets(env: Record<string, string>): Plugin {
  const site = siteUrlFromEnv(env)
  let config: ResolvedConfig
  return {
    name: "website-seo-assets",
    configResolved(resolved) { config = resolved },
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const image = new URL(SHARE_IMAGE_PATH, site).href
        return html
          .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${pageUrl(site, "/", "zh")}$2`)
          .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*("\s*\/?>)/g, `$1${image}$2`)
      }
    },
    closeBundle() {
      if (config.command !== "build") return
      const output = resolve(config.root, config.build.outDir)
      const files = {
        "sitemap.xml": renderSitemap(site, config.root),
        "llms.txt": renderLlms(site),
        "robots.txt": renderRobots(site),
        "nginx-spa.conf": renderNginx(site, config.root)
      }
      for (const [filename, content] of Object.entries(files)) writeFileSync(resolve(output, filename), content, "utf8")
    }
  }
}
