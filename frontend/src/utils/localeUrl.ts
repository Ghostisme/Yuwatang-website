/** 应用内语言码（与 vue-i18n messages key 一致） */
export type AppLocale = "zh" | "en" | "jp"

/** 需求2-9：hreflang 标准码（中英为主 / 日为辅） */
export const HREFLANG_MAP: Record<AppLocale, string> = {
  zh: "zh-CN",
  en: "en",
  jp: "ja"
}

export const HTML_LANG_MAP: Record<AppLocale, string> = {
  zh: "zh-CN",
  en: "en",
  jp: "ja"
}

export const APP_LOCALES: AppLocale[] = ["zh", "en", "jp"]

/** 中文为默认（x-default） */
export const DEFAULT_LOCALE: AppLocale = "zh"

export const isAppLocale = (value: unknown): value is AppLocale =>
  value === "zh" || value === "en" || value === "jp"

/** 解析 ?lang= 或 localStorage */
export function resolveInitialLocale(): AppLocale {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("lang")
    if (isAppLocale(fromQuery)) return fromQuery
  } catch {
    /* ignore */
  }
  try {
    const stored = localStorage.getItem("user-locale")
    if (isAppLocale(stored)) return stored
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE
}

/** 拼接带语言参数的绝对 URL（供 hreflang / canonical） */
export function buildLocaleHref(path: string, lang: AppLocale): string {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : String(import.meta.env.VITE_SITE_ORIGIN || "https://www.yuhetangtcm.com")
  const base = import.meta.env.BASE_URL || "/"
  const baseNorm = base.endsWith("/") ? base : `${base}/`
  const rel = path === "/" ? "" : path.replace(/^\//, "")
  const pathname = rel ? `${baseNorm}${rel}` : baseNorm
  const url = new URL(pathname, origin)
  url.searchParams.set("lang", lang)
  return url.href
}
