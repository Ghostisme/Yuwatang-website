/** 需求2 信息架构：页眉目录 8 板块 */
export type NavItem = { path: string; labelKey: string }

export const catalogItems: NavItem[] = [
  { path: "/about", labelKey: "nav.brand" },
  { path: "/services", labelKey: "nav.feature" },
  { path: "/base", labelKey: "nav.base" },
  { path: "/stores", labelKey: "nav.store" },
  { path: "/faq", labelKey: "nav.faq" },
  { path: "/news", labelKey: "nav.news" },
  { path: "/reviews", labelKey: "nav.feedback" },
  { path: "/contact", labelKey: "nav.contact" }
]

export const mainNavItems: NavItem[] = [
  { path: "/", labelKey: "nav.home" },
  { path: "/trace", labelKey: "nav.trace" }
]

/** 旧路径 → 需求2 新路径（History 模式 + 服务端 301） */
export const legacyRedirects: Record<string, string> = {
  "/about-us": "/about",
  "/about_us": "/about",
  "/feature": "/services",
  "/store": "/stores",
  "/contact-us": "/contact",
  "/contact_us": "/contact",
  "/shop": "/stores",
  "/home": "/"
}
