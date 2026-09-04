export type ServiceInfo = {
  slug: string
  nameKey: string
  summaryKey: string
  bodyKey: string
  image: string
}

/** 需求2：四大项目 + 传统调理 */
export const services: ServiceInfo[] = [
  {
    slug: "moxibustion",
    nameKey: "services.moxibustion.name",
    summaryKey: "services.moxibustion.summary",
    bodyKey: "services.moxibustion.body",
    image: "home-pic5.jpg"
  },
  {
    slug: "tuina",
    nameKey: "services.tuina.name",
    summaryKey: "services.tuina.summary",
    bodyKey: "services.tuina.body",
    image: "home-pic2.jpg"
  },
  {
    slug: "spa",
    nameKey: "services.spa.name",
    summaryKey: "services.spa.summary",
    bodyKey: "services.spa.body",
    image: "home-pic3.jpg"
  },
  {
    slug: "foot",
    nameKey: "services.foot.name",
    summaryKey: "services.foot.summary",
    bodyKey: "services.foot.body",
    image: "home-pic4.jpg"
  },
  {
    slug: "traditional",
    nameKey: "services.traditional.name",
    summaryKey: "services.traditional.summary",
    bodyKey: "services.traditional.body",
    image: "home-pic9.jpg"
  }
]

export const getServiceBySlug = (slug: string) => services.find((s) => s.slug === slug)
