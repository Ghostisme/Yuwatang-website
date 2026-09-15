/**
 * 滚动显现：为元素添加 .pm-reveal，进入视口后加 .is-in
 *
 * 注意：不要对超高容器（如整页 .about-box）使用 threshold>0，
 * 否则首屏可见面积不足阈值时会一直 opacity:0，必须滚动才出现。
 */

const IO_OPTIONS: IntersectionObserverInit = {
  // 任意像素进入视口即触发；底部不要留负 margin，否则页脚/贴底内容更难触发
  rootMargin: "0px 0px 0px 0px",
  threshold: 0
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** 绑定时已在视口内则立刻显现（避免等 IO 异步回调 / 路由过渡错位） */
function isAlreadyInView(el: Element) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  const vw = window.innerWidth || document.documentElement.clientWidth
  return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw
}

export const revealDirective = {
  mounted(el: HTMLElement, binding: { value?: { delay?: number; once?: boolean } }) {
    const delay = binding.value?.delay ?? 0
    const once = binding.value?.once !== false
    el.classList.add("pm-reveal")
    if (delay) el.style.setProperty("--pm-delay", `${delay}ms`)

    if (typeof window === "undefined" || prefersReducedMotion()) {
      el.classList.add("is-in")
      return
    }

    if (isAlreadyInView(el)) {
      el.classList.add("is-in")
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-in")
            if (once) io.unobserve(el)
          } else if (!once) {
            el.classList.remove("is-in")
          }
        })
      },
      IO_OPTIONS
    )
    io.observe(el)
    ;(el as any).__pmRevealIo = io
  },
  unmounted(el: HTMLElement) {
    const io = (el as any).__pmRevealIo as IntersectionObserver | undefined
    io?.disconnect()
  }
}

/**
 * 只对「卡片级 / 块级」节点自动绑定。
 * 禁止绑定整页外壳（about-box 等）和站点 Footer——前者超高导致 threshold 失效，后者是常驻壳层。
 */
const AUTO_SELECTORS = [
  ".ppjs-title",
  ".ppjs-content",
  ".ppjs-list-item",
  ".zdfw-title",
  ".zdfw-content",
  ".zdfw-content-img",
  ".zdfw-content-info",
  ".base-title",
  ".base-box",
  ".base-text",
  ".base-info-list",
  ".banner-tit",
  ".news-card",
  ".news-empty",
  ".news-content",
  ".news-detail",
  ".news-detail-body",
  ".contact-form",
  ".feedback-form",
  ".form-title",
  ".contact-info",
  ".contact-banner",
  ".store-list",
  ".store-item",
  ".store-box",
  ".feature-list",
  ".feature-item",
  ".feature-box",
  ".serve-list",
  ".serve-item",
  ".serve-box",
  ".about-content",
  ".about-info",
  ".about-title",
  ".about-subtit",
  ".about-subtext",
  ".about-people",
  ".story-card",
  ".section-title",
  ".page-h1",
  ".lead",
  ".block-text",
  ".about-product .media-panel",
  ".about-product .qualify-item",
  ".shop-item",
  ".shop-list",
  ".shop-content",
  ".shop-title",
  ".shop-banner",
  ".sidebar",
  ".feature-left",
  ".feature-right-box",
  ".feature-right-box-title",
  ".feature-right-box-text",
  ".info-btn",
  ".trace-body .panel > *"
].join(",")

let pageIo: IntersectionObserver | null = null
let mo: MutationObserver | null = null
let moTimer: ReturnType<typeof setTimeout> | null = null

function ensurePageIo() {
  if (pageIo) return pageIo
  pageIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in")
          pageIo?.unobserve(entry.target)
        }
      })
    },
    IO_OPTIONS
  )
  return pageIo
}

/** 历史上误绑的超高外壳 / 页脚：强制可见，避免首屏一直透明 */
const NEVER_REVEAL_SHELL = [
  ".about-box",
  ".section",
  ".shop-box",
  ".footer-pc-box-left",
  ".footer-pc-box-right",
  ".footer-h5-box"
].join(",")

function unlockShellNodes(root: ParentNode) {
  root.querySelectorAll(NEVER_REVEAL_SHELL).forEach((node) => {
    const el = node as HTMLElement
    el.classList.remove("pm-reveal", "pm-reveal-left", "pm-reveal-scale")
    el.classList.add("is-in")
    delete el.dataset.pmBound
  })
}

export function refreshPageMotion(root: ParentNode = document) {
  if (typeof window === "undefined") return

  unlockShellNodes(root)

  if (prefersReducedMotion()) {
    root.querySelectorAll(".pm-reveal").forEach((el) => el.classList.add("is-in"))
    return
  }

  const io = ensurePageIo()
  const nodes = root.querySelectorAll(AUTO_SELECTORS)
  nodes.forEach((node, index) => {
    const el = node as HTMLElement
    if (el.dataset.pmBound === "1") return
    el.dataset.pmBound = "1"
    el.classList.add("pm-reveal")
    el.style.setProperty("--pm-delay", `${Math.min(index % 8, 7) * 45}ms`)

    if (isAlreadyInView(el)) {
      // 双 rAF：等路由页过渡/布局稳定后再判定，避免误判为不可见
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isAlreadyInView(el)) {
            el.classList.add("is-in")
          } else {
            io.observe(el)
          }
        })
      })
      return
    }
    io.observe(el)
  })
}

/** 监听异步渲染（资讯列表等）自动补绑定 */
export function startPremiumMotionWatch() {
  if (typeof window === "undefined" || mo) return
  const app = document.querySelector(".app")
  if (!app) return
  mo = new MutationObserver(() => {
    if (moTimer) clearTimeout(moTimer)
    moTimer = setTimeout(() => refreshPageMotion(app), 80)
  })
  mo.observe(app, { childList: true, subtree: true })
}
