import cdnUploads from "@/config/cdnUploads.json?raw"

const uploadedVersions: Record<string, string> = JSON.parse(cdnUploads)
const cdnBase = String(import.meta.env.VITE_MEDIA_CDN_BASE || "").trim().replace(/\/$/, "")
const siteOrigin = String(import.meta.env.VITE_SITE_ORIGIN || "https://www.yuhetangtcm.com")
const apiBase = String(import.meta.env.VITE_API_BASE_URL || siteOrigin)

const originOf = (value: string) => {
  try { return new URL(value).origin } catch { return "" }
}

const ownedOrigins = new Set([originOf(siteOrigin), originOf(apiBase)].filter(Boolean))
if (typeof window !== "undefined") ownedOrigins.add(window.location.origin)

/** 改写本站媒体；保留第三方、data/blob URL 以及已经生成的 CDN 地址。 */
export function rewriteMediaUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (!cdnBase) return url
  try {
    const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : siteOrigin)
    if (!/^https?:$/.test(parsed.protocol)) return url
    if (parsed.origin === originOf(cdnBase)) return url
    if (!ownedOrigins.has(parsed.origin)) return url
    return `${cdnBase}${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return url
  }
}

/** 只切换本次已收集的后台上传文件；后台以后新增的图片继续使用原地址。 */
export function rewriteUploadedMediaUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (!cdnBase) return url
  try {
    const parsed = new URL(url, originOf(apiBase) || siteOrigin)
    if (!ownedOrigins.has(parsed.origin)) return url
    const version = uploadedVersions[parsed.pathname]
    if (!version) return url
    parsed.searchParams.set("v", version)
    return rewriteMediaUrl(parsed.href)
  } catch {
    return url
  }
}

/** 新闻正文只处理媒体元素，保持站内链接、第三方资源和正文内容。 */
export function rewriteArticleMedia(html: string): string {
  if (!cdnBase || typeof document === "undefined") return html
  const template = document.createElement("template")
  template.innerHTML = html
  for (const element of template.content.querySelectorAll("img, video, audio, source")) {
    for (const attribute of ["src", "poster"]) {
      const value = element.getAttribute(attribute)
      if (value) element.setAttribute(attribute, rewriteUploadedMediaUrl(value))
    }
    const srcset = element.getAttribute("srcset")
    if (srcset && !srcset.includes("data:")) {
      element.setAttribute("srcset", srcset.split(",").map((entry) => {
        const [url, ...descriptor] = entry.trim().split(/\s+/)
        return [rewriteUploadedMediaUrl(url), ...descriptor].join(" ")
      }).join(", "))
    }
  }
  return template.innerHTML
}

export function rewriteMediaList(urls: Array<string | null | undefined>): string[] {
  return urls.map((u) => rewriteMediaUrl(u)).filter(Boolean)
}
