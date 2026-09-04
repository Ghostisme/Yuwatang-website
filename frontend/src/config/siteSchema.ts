import type { StoreInfo } from "@/config/stores"
import type { ServiceInfo } from "@/config/services"
import { DEFAULT_LOCALE, buildLocaleHref } from "@/utils/localeUrl"

export const ORG_NAME = "裕和堂 Yu Health"
export const ORG_LEGAL_NAME = "上海御和堂健康科技有限公司"
export const ORG_EMAIL = "tty12138@foxmail.com"

export type StoreGeo = { lat: number; lng: number }

/** 9 店近似坐标（上海，供 LocalBusiness geo；可后续用测绘精确值替换） */
export const storeGeo: Record<string, StoreGeo> = {
  yuyao: { lat: 31.2436, lng: 121.4408 },
  bailemen: { lat: 31.2238, lng: 121.4456 },
  huashan: { lat: 31.2132, lng: 121.4392 },
  taiguhui: { lat: 31.2268, lng: 121.4552 },
  wujianglu: { lat: 31.2286, lng: 121.4574 },
  "shanghai-center": { lat: 31.2337, lng: 121.5055 },
  meihua: { lat: 31.2042, lng: 121.5571 },
  sichuanbei: { lat: 31.2551, lng: 121.4832 },
  changde: { lat: 31.2398, lng: 121.4402 }
}

const siteOrigin = () =>
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : String(import.meta.env.VITE_SITE_ORIGIN || "https://www.yuhetangtcm.com")

/** 页面绝对 URL（默认中文 lang，与 hreflang 一致） */
export function pageUrl(path: string) {
  return buildLocaleHref(path, DEFAULT_LOCALE)
}

export function toE164Phone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("86")) return `+${digits}`
  if (digits.startsWith("021")) return `+86-${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+86${digits}`
  if (digits.length === 8) return `+86-21-${digits}`
  return `+86-${digits}`
}

export function parseHours(hours: string): { opens: string; closes: string } {
  const m = hours.match(/(\d{1,2}):(\d{2})\s*[–\-~]\s*(\d{1,2}):(\d{2})/)
  if (!m) return { opens: "09:30", closes: "23:00" }
  const pad = (n: string) => n.padStart(2, "0")
  return { opens: `${pad(m[1])}:${m[2]}`, closes: `${pad(m[3])}:${m[4]}` }
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function buildOrganization() {
  const url = pageUrl("/")
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteOrigin()}/#organization`,
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    url,
    email: ORG_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "上海",
      addressRegion: "上海市",
      addressCountry: "CN"
    },
    areaServed: {
      "@type": "City",
      name: "上海"
    }
  }
}

export function buildLocalBusiness(store: StoreInfo, name: string, description: string) {
  const { opens, closes } = parseHours(store.hours)
  const geo = storeGeo[store.slug]
  const url = pageUrl(`/stores/${store.slug}`)
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteOrigin()}/#store-${store.slug}`,
    name,
    description,
    url,
    telephone: toE164Phone(store.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: "上海",
      addressRegion: "上海市",
      addressCountry: "CN"
    },
    geo: geo
      ? {
          "@type": "GeoCoordinates",
          latitude: geo.lat,
          longitude: geo.lng
        }
      : undefined,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: weekDays,
      opens,
      closes
    },
    parentOrganization: {
      "@id": `${siteOrigin()}/#organization`,
      "@type": "Organization",
      name: ORG_NAME,
      url: pageUrl("/")
    }
  }
}

export function buildAllLocalBusinesses(
  stores: StoreInfo[],
  resolve: (store: StoreInfo) => { name: string; description: string }
) {
  return {
    "@context": "https://schema.org",
    "@graph": stores.map((store) => {
      const { name, description } = resolve(store)
      const node = buildLocalBusiness(store, name, description)
      const { "@context": _c, ...rest } = node
      return rest
    })
  }
}

export function buildService(service: ServiceInfo, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: pageUrl(`/services/${service.slug}`),
    provider: {
      "@type": "Organization",
      name: ORG_NAME,
      url: pageUrl("/")
    },
    areaServed: {
      "@type": "City",
      name: "上海"
    },
    serviceType: name
  }
}

export type Crumb = { name: string; path: string }

export function buildBreadcrumb(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: pageUrl(item.path)
    }))
  }
}
