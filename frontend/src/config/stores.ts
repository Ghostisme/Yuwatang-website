import { getStoreDetail, getStoreList } from "@/api"

/** 后台返回的原始门店行（含多语言字段） */
export type StoreApiRow = {
  id: number
  slug: string
  title: string
  title_en?: string
  title_jp?: string
  tagline?: string
  tagline_en?: string
  tagline_jp?: string
  intro?: string
  intro_en?: string
  intro_jp?: string
  directions?: string
  directions_en?: string
  directions_jp?: string
  address?: string
  address_en?: string
  address_jp?: string
  phone: string
  hours: string
  metro?: string
  metro_en?: string
  metro_jp?: string
  image?: string
  image_en?: string
  image_jp?: string
  services?: string[] | string
  facilities?: string[] | string
  status?: number
  weigh?: number
}

/** 前台渲染用（已按当前语言本地化） */
export type StoreInfo = {
  id: number
  slug: string
  name: string
  tagline: string
  intro: string
  directions: string
  address: string
  phone: string
  hours: string
  metro: string
  image: string
  serviceSlugs: string[]
  facilityKeys: string[]
}

const assetModules = import.meta.glob("../assets/img/*", { eager: true, import: "default" }) as Record<
  string,
  string
>

function pickLocaleField(row: StoreApiRow, base: string, locale: string): string {
  const map: Record<string, string | undefined> = {
    zh: (row as any)[base],
    en: (row as any)[`${base}_en`],
    jp: (row as any)[`${base}_jp`]
  }
  const primary = (map[locale] || "").trim()
  if (primary) return primary
  return ((row as any)[base] || "").trim()
}

function toList(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean)
  if (!value) return []
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 解析封面：上传绝对路径 / 相对 uploads / 前端静态文件名 */
export function resolveStoreImage(path: string | undefined | null, locale = "zh"): string {
  const raw = String(path || "").trim()
  if (!raw) {
    return resolveStoreImage("store-banner.png")
  }
  if (/^https?:\/\//i.test(raw)) return raw
  if (raw.startsWith("/uploads") || raw.startsWith("uploads/")) {
    const p = raw.startsWith("/") ? raw : `/${raw}`
    const api = String(import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api.php")
    try {
      const u = new URL(api)
      return `${u.origin}${p}`
    } catch {
      return p
    }
  }
  if (raw.startsWith("/")) return raw

  const key = `../assets/img/${raw}`
  if (assetModules[key]) return assetModules[key]
  // 兼容仅文件名
  const hit = Object.entries(assetModules).find(([k]) => k.endsWith(`/` + raw) || k.endsWith("\\" + raw))
  if (hit) return hit[1]
  void locale
  return assetModules["../assets/img/store-banner.png"] || raw
}

export function localizeStore(row: StoreApiRow, locale: string): StoreInfo {
  const lang = locale === "en" || locale === "jp" ? locale : "zh"
  const imageField =
    lang === "en" ? row.image_en || row.image : lang === "jp" ? row.image_jp || row.image : row.image
  return {
    id: Number(row.id) || 0,
    slug: row.slug,
    name: pickLocaleField(row, "title", lang),
    tagline: pickLocaleField(row, "tagline", lang),
    intro: pickLocaleField(row, "intro", lang),
    directions: pickLocaleField(row, "directions", lang),
    address: pickLocaleField(row, "address", lang),
    phone: row.phone || "",
    hours: row.hours || "",
    metro: pickLocaleField(row, "metro", lang),
    image: resolveStoreImage(imageField, lang),
    serviceSlugs: toList(row.services),
    facilityKeys: toList(row.facilities)
  }
}

let listCache: StoreApiRow[] | null = null
let listPromise: Promise<StoreApiRow[]> | null = null

export async function loadStoreRows(force = false): Promise<StoreApiRow[]> {
  if (!force && listCache) return listCache
  if (!force && listPromise) return listPromise
  listPromise = getStoreList({ page: 1, limit: 50 })
    .then((res: any) => {
      const rows = (res?.data?.data || res?.data || []) as StoreApiRow[]
      listCache = Array.isArray(rows) ? rows : []
      return listCache
    })
    .catch(() => {
      listCache = []
      return listCache
    })
    .finally(() => {
      listPromise = null
    })
  return listPromise
}

export async function loadStoreBySlug(slug: string): Promise<StoreApiRow | null> {
  if (!slug) return null
  try {
    const res: any = await getStoreDetail(slug)
    return (res?.data || null) as StoreApiRow | null
  } catch {
    const rows = await loadStoreRows()
    return rows.find((r) => r.slug === slug) || null
  }
}

/** @deprecated 兼容旧调用名 */
export const getStoreImageUrl = (filename: string) => resolveStoreImage(filename)
