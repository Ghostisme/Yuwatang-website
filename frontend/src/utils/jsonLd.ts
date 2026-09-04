/** 低层 JSON-LD 脚本注入（按 id 复用 / 清理） */
export function upsertJsonLd(id: string, data: Record<string, unknown> | null | undefined) {
  const attr = "data-jsonld-id"
  let el = document.querySelector(`script[${attr}="${id}"]`) as HTMLScriptElement | null
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement("script")
    el.type = "application/ld+json"
    el.setAttribute(attr, id)
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function removeJsonLd(id: string) {
  document.querySelector(`script[data-jsonld-id="${id}"]`)?.remove()
}
