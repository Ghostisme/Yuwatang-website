/**
 * 图片懒加载指令：使用 data-src，进入视口后再赋值 src
 */
export const lazyLoadDirective = {
  mounted(el: HTMLImageElement) {
    const dataSrc = el.dataset.src
    if (!dataSrc) return

    if (!("IntersectionObserver" in window)) {
      el.src = dataSrc
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = dataSrc
          el.removeAttribute("data-src")
          observer.unobserve(el)
        }
      },
      { rootMargin: "120px" }
    )
    observer.observe(el)
  }
}

export default lazyLoadDirective
