export type ServiceInfo = {
  slug: string
  nameKey: string
  summaryKey: string
  bodyKey: string
  image: string
  parentSlug?: string
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

/** 更多传统调理项目：展示顺序与对应项目照片。 */
export const traditionalServices: ServiceInfo[] = [
  {
    slug: "cupping",
    nameKey: "services.cupping.name",
    summaryKey: "services.cupping.summary",
    bodyKey: "services.cupping.body",
    image: "traditional-cupping.jpg",
    parentSlug: "traditional"
  },
  {
    slug: "gua-sha",
    nameKey: "services.guaSha.name",
    summaryKey: "services.guaSha.summary",
    bodyKey: "services.guaSha.body",
    image: "traditional-gua-sha.jpg",
    parentSlug: "traditional"
  },
  {
    slug: "ear-care",
    nameKey: "services.earCare.name",
    summaryKey: "services.earCare.summary",
    bodyKey: "services.earCare.body",
    image: "traditional-ear-care.jpg",
    parentSlug: "traditional"
  },
  {
    slug: "pedicure",
    nameKey: "services.pedicure.name",
    summaryKey: "services.pedicure.summary",
    bodyKey: "services.pedicure.body",
    image: "traditional-pedicure.jpg",
    parentSlug: "traditional"
  },
  {
    slug: "pediatric-tuina",
    nameKey: "services.pediatricTuina.name",
    summaryKey: "services.pediatricTuina.summary",
    bodyKey: "services.pediatricTuina.body",
    image: "traditional-pediatric-tuina.jpg",
    parentSlug: "traditional"
  }
]

export const getServiceBySlug = (slug: string) =>
  [...services, ...traditionalServices].find((s) => s.slug === slug)
