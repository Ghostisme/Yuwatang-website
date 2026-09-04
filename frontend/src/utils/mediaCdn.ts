/** 需求2-10：可选国内 CDN 前缀，改写横幅视频等媒体 URL */
export function rewriteMediaUrl(url: string | null | undefined): string {
  if (!url) return ""
  const cdn = String(import.meta.env.VITE_MEDIA_CDN_BASE || "").trim()
  if (!cdn) return url
  try {
    const absolute = /^https?:\/\//i.test(url) ? url : new URL(url, window.location.origin).href
    const parsed = new URL(absolute)
    const base = cdn.replace(/\/$/, "")
    return `${base}${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

export function rewriteMediaList(urls: Array<string | null | undefined>): string[] {
  return urls.map((u) => rewriteMediaUrl(u)).filter(Boolean)
}
