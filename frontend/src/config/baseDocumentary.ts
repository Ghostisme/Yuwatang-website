import { rewriteMediaUrl } from "@/utils/mediaCdn"

type NetworkConnection = { effectiveType?: string; saveData?: boolean }

/** 复用同一成片：电脑正常网络用 1080p，手机/慢网使用已有 720p。 */
export function getBaseDocumentaryAssets() {
  const base = `${String(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")}media/`
  const connection = typeof navigator !== "undefined"
    ? (navigator as Navigator & { connection?: NetworkConnection }).connection
    : undefined
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  const use720p = isMobile || connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType || "")
  const customUrl = String(import.meta.env.VITE_DOCUMENTARY_URL || "").trim()
  const customPoster = String(import.meta.env.VITE_DOCUMENTARY_POSTER || "").trim()
  return {
    src: customUrl || rewriteMediaUrl(`${base}${use720p ? "base-documentary.mp4?v=silent-720p-20261013" : "base-documentary-1080p.mp4?v=20261024"}`),
    poster: customPoster || (customUrl ? undefined : rewriteMediaUrl(`${base}base-documentary-poster.jpg?v=20261024`))
  }
}
