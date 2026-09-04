import { legacyRedirects } from "@/config/navigation"

function isAtAppBase(pathname: string, base: string): boolean {
  const basePath = base.replace(/\/$/, "") || ""
  const pathNorm = pathname.replace(/\/$/, "") || ""
  // base `/` → 仅 pathname 为 `/`；base `/h5/` → `/h5` 或 `/h5/`
  if (!basePath) return pathNorm === "" || pathname === "/"
  return pathNorm === basePath
}

/**
 * 需求2-23：旧 hash 链接 (example.com/#/about) → 真实路径 (/about)
 * 仅在「仍停在站点 base、靠 hash 表示路由」时迁移。
 * 已在 /trace、/faq 等 History 路径时，只清残留 #，绝不跳回首页。
 */
export function migrateLegacyHashUrl(base = "/") {
  const { hash, search, pathname } = window.location
  if (!hash.startsWith("#/")) return

  if (!isAtAppBase(pathname, base)) {
    const clean = `${pathname}${search}`
    if (`${pathname}${search}${hash}` !== clean) {
      window.history.replaceState(window.history.state, "", clean)
    }
    return
  }

  const raw = hash.slice(1) // /about?foo=bar
  const qMark = raw.indexOf("?")
  const pathPart = qMark >= 0 ? raw.slice(0, qMark) : raw
  const hashQuery = qMark >= 0 ? raw.slice(qMark + 1) : ""

  let nextPath = legacyRedirects[pathPart] || pathPart
  if (!nextPath.startsWith("/")) nextPath = `/${nextPath}`
  // #/ → 首页；有具体 path 才迁移
  if (nextPath === "/") {
    window.history.replaceState(window.history.state, "", `${pathname}${search}`)
    return
  }

  const basePath = base.replace(/\/$/, "")
  const mergedQuery = [hashQuery, search.replace(/^\?/, "")].filter(Boolean).join("&")
  const target = `${basePath}${nextPath}${mergedQuery ? `?${mergedQuery}` : ""}`
  const current = `${pathname}${search}`

  if (target !== current) {
    window.location.replace(target)
  }
}
