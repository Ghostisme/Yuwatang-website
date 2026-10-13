import { services, traditionalServices } from "../src/config/services"
import zh from "../src/locales/zh"

export type SitePage = {
  path: string
  label: string
  view: string
  dynamic?: boolean
}

const serviceNames = (key: string) => {
  let value: unknown = zh
  for (const part of key.split(".")) value = (value as Record<string, unknown>)[part]
  return String(value)
}

export const sitePages: SitePage[] = [
  { path: "/", label: "首页", view: "Home" },
  { path: "/about", label: "品牌介绍", view: "AboutUs" },
  { path: "/services", label: "服务项目", view: "Services" },
  ...[...services, ...traditionalServices].map((service) => ({
    path: `/services/${service.slug}`,
    label: serviceNames(service.nameKey),
    view: "ServiceDetail"
  })),
  { path: "/base", label: "蕲春艾草基地、产品与资质", view: "Base" },
  { path: "/stores", label: "上海直营门店", view: "Stores", dynamic: true },
  ...[
    ["yuyao", "余姚路店"],
    ["bailemen", "百乐门店"],
    ["huashan", "华山路店"],
    ["taiguhui", "太古汇店"],
    ["wujianglu", "吴江路店"],
    ["shanghai-center", "上海中心店"],
    ["meihua", "梅花路店"],
    ["sichuanbei", "四川北路店"],
    ["changde", "常德路店"]
  ].map(([slug, label]) => ({ path: `/stores/${slug}`, label, view: "StoreDetail", dynamic: true })),
  { path: "/faq", label: "预约、服务、到店与会员常见问题", view: "Faq" },
  { path: "/news", label: "新闻资讯", view: "News", dynamic: true },
  ...[1001, 1002, 1003].map((id) => ({
    path: `/news/${id}`,
    label: `品牌资讯 ${id}`,
    view: "NewsDetail",
    dynamic: true
  })),
  { path: "/reviews", label: "客户反馈", view: "Reviews", dynamic: true },
  { path: "/contact", label: "咨询与预约联系方式", view: "ContactUs" },
  { path: "/guide", label: "网站导览", view: "Guide" },
  { path: "/trace", label: "产品溯源与检验报告", view: "Trace" }
]
