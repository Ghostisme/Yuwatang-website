/**
 * vue-i18n 会对 messages 就地把字符串编译成函数。
 * 深拷贝时若用 JSON.stringify，函数字段会被丢弃，页面就会只显示 key。
 * 这里把字符串原样拷贝；若已是编译函数则解包回原文，再交给 createI18n。
 */

export function resolveI18nLeaf(value: unknown, rt?: (message: any) => string): string {
  if (typeof value === "string") return value
  if (typeof value === "function") {
    if (rt) {
      try {
        const viaRt = rt(value)
        if (typeof viaRt === "string" && viaRt && !viaRt.includes("normalize")) return viaRt
      } catch {
        /* fall through */
      }
    }
    try {
      const out = value({
        normalize: (parts: unknown) => (Array.isArray(parts) ? parts.map(String).join("") : String(parts ?? "")),
        interpolate: (v: unknown) => v,
        type: "text",
        values: {}
      })
      if (typeof out === "string") return out
      if (Array.isArray(out)) return out.map(String).join("")
    } catch {
      /* ignore */
    }
    return ""
  }
  if (value == null) return ""
  return String(value)
}

/** 深拷贝 locale 树：字符串保留，编译函数还原为字符串，供 createI18n 使用 */
export function cloneMessages<T>(messages: T): T {
  const walk = (input: unknown): unknown => {
    if (typeof input === "string") return input
    if (typeof input === "function") return resolveI18nLeaf(input)
    if (Array.isArray(input)) return input.map(walk)
    if (input && typeof input === "object") {
      const out: Record<string, unknown> = {}
      for (const key of Object.keys(input as object)) {
        out[key] = walk((input as Record<string, unknown>)[key])
      }
      return out
    }
    return input
  }
  return walk(messages) as T
}

/** FAQ 问答列表不进 i18n，避免被编译成 message 函数 */
export function faqUiOnly<T extends Record<string, unknown>>(pack: T): Omit<T, "items"> {
  const { items: _items, ...ui } = pack
  return ui
}
