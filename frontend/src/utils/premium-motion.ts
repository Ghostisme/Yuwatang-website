/**
 * 滚动显现：为元素添加 .pm-reveal，进入视口后加 .is-in
 */
export const revealDirective = {
  mounted(el: HTMLElement, binding: { value?: { delay?: number; once?: boolean } }) {
    const delay = binding.value?.delay ?? 0
    const once = binding.value?.once !== false
    el.classList.add("pm-reveal")
    if (delay) el.style.setProperty("--pm-delay", `${delay}ms`)

    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    )
    io.observe(el)
    ;(el as any).__pmRevealIo = io
  },
  unmounted(el: HTMLElement) {
    const io = (el as any).__pmRevealIo as IntersectionObserver | undefined
    io?.disconnect()
  }
}

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
  ".about-box",
  ".about-info",
  ".about-title",
  ".about-subtit",
  ".about-subtext",
  ".about-people",
  ".shop-item",
  ".shop-list",
  ".shop-box",
  ".shop-content",
  ".shop-title",
  ".shop-banner",
  ".section",
  ".sidebar",
  ".feature-left",
  ".feature-right-box",
  ".feature-right-box-title",
  ".feature-right-box-text",
  ".info-btn",
  ".trace-body .panel > *",
  ".company-card",
  ".footer-pc-box-left",
  ".footer-pc-box-right",
  ".footer-h5-box"
].join(",")

let pageIo: IntersectionObserver | null = null
let mo: MutationObserver | null = null
let moTimer: ReturnType<typeof setTimeout> | null = null

export function refreshPageMotion(root: ParentNode = document) {
  if (typeof window === "undefined") return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.querySelectorAll(".pm-reveal").forEach((el) => el.classList.add("is-in"))
    return
  }

  if (!pageIo) {
    pageIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in")
            pageIo?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
    )
  }

  const nodes = root.querySelectorAll(AUTO_SELECTORS)
  nodes.forEach((node, index) => {
    const el = node as HTMLElement
    if (el.dataset.pmBound === "1") return
    el.dataset.pmBound = "1"
    el.classList.add("pm-reveal")
    el.style.setProperty("--pm-delay", `${Math.min(index % 8, 7) * 45}ms`)
    pageIo?.observe(el)
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
