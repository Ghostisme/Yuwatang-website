/** 需求2 信息架构 */
export type NavItem = { path: string; labelKey: string }

/**
 * 顶部主导航（顺序：认知 → 业务 → 内容互动 → 转化 → 溯源）
 * 首页 → 品牌 → 服务 → 基地 → 门店 → FAQ → 新闻 → 反馈 → 联系 → 溯源
 */
export const topNavItems: NavItem[] = [
  { path: "/", labelKey: "nav.home" },
  { path: "/about", labelKey: "nav.brand" },
  { path: "/services", labelKey: "nav.feature" },
  { path: "/base", labelKey: "nav.base" },
  { path: "/stores", labelKey: "nav.store" },
  { path: "/faq", labelKey: "nav.faq" },
  { path: "/news", labelKey: "nav.news" },
  { path: "/reviews", labelKey: "nav.feedback" },
  { path: "/contact", labelKey: "nav.contact" },
  { path: "/trace", labelKey: "nav.trace" }
]

/** 页脚 / 导览：8 板块（不含首页、溯源） */
export const catalogItems: NavItem[] = topNavItems.filter(
  (item) => item.path !== "/" && item.path !== "/trace"
)

/** 兼容旧引用 */
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
