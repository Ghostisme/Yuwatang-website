/** 基地产品与溯源页数据（自鹤佗年 product/18 迁移） */

export const traceAsset = (rel: string) => {
  const base = import.meta.env.BASE_URL || "/"
  // 使用 /trace-assets，避免与 Vue 路由 /trace 的 public 目录冲突（刷新会丢路由）
  return `${base}trace-assets/${rel}`.replace(/([^:]\/)\/+/g, "$1")
}

export const verifyInfo = {
  code: "9383342624358434",
  scanCount: 1030,
  firstQueryTime: "2025-07-11 14:42:10",
  phone: "0716-4701147",
  shieldIcon: traceAsset("images/ico0.png")
}

export type InfoRow = { label: string; value: string }

export const materialRows: InfoRow[] = [
  { label: "品种名称", value: "裕和堂专供3年陈艾条" },
  { label: "产地", value: "湖北蕲春" },
  { label: "收货时间", value: "2023年6月" },
  { label: "储存方式", value: "密闭、阴凉干燥处" },
  { label: "储存地址", value: "湖北省黄冈市竹瓦镇裕和堂艾草基地" }
]

export const productionRows: InfoRow[] = [
  { label: "打绒日期", value: "2026年6月" },
  { label: "加工工艺", value: "三遍打绒" }
]

export const storageRows: InfoRow[] = [{ label: "储存方法", value: "密闭、阴凉干燥处" }]

export const productRows: InfoRow[] = [
  { label: "产品名称", value: "裕和堂专供3年陈艾条" },
  { label: "等级", value: "三年陈" },
  { label: "产地", value: "湖北蕲春" },
  { label: "执行标准", value: "Q/DAKJ002-2024" },
  { label: "生产日期", value: "见包装外盒处" },
  { label: "储存方法", value: "密闭、阴凉干燥处" },
  { label: "生产许可证编号", value: "SC10142102450041" }
]

/** QA2026030151，2026-04-01：封面、说明、检验结果第 1 页、第 2 页。 */
const reportPages = [
  traceAsset("upload/image/20260714/1783998286726932.jpg"),
  traceAsset("upload/image/20260714/1783998286178786.jpg"),
  traceAsset("upload/image/20260714/1783998287128319.jpg"),
  traceAsset("upload/image/20260714/1783998287166646.jpg")
]

/** 四页原图无损合并，基地与溯源共用同一张完整报告。 */
export const reportImages = [traceAsset("upload/image/20261013/inspection-report-qa2026030151.webp")]

export const productImages = [traceAsset("upload/image/20250724/1753348714774743.png")]

export const qualifyImages = [
  ...reportImages,
  traceAsset("upload/image/20250718/1752829546207910.jpg"),
  traceAsset("upload/image/20261012/picc-insurance.png"),
  traceAsset("upload/image/20250718/1752829756809601.jpg"),
  ...reportPages
]
