/** 需求2-17：FAQ 分组（20 通用 + 5 海外向） */
export const FAQ_GENERAL_COUNT = 20
export const FAQ_TOTAL = 25

/** 各服务详情页共用的到店问答，按预约、地址、流程、消费、会员权益排列。 */
export const VISIT_FAQ_TOPICS = ["bookingTime", "address", "arrival", "spend", "membership"] as const
export type VisitFaqTopic = (typeof VISIT_FAQ_TOPICS)[number]

export type FaqItem = { q: string; a: string; topic?: VisitFaqTopic }
