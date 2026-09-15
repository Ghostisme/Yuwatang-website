import { hasMedicalClaim } from "@/utils/reviewCompliance"

/** 反馈表单字段限制（与库表/接口对齐） */
export const REVIEW_LIMITS = {
  nameMin: 2,
  nameMax: 20,
  phoneLen: 11,
  emailMax: 100,
  storeMax: 100,
  contentMin: 10,
  contentMax: 500
} as const

export type ReviewFormValues = {
  name: string
  phone: string
  email: string
  store_name: string
  content: string
}

export type ReviewField = keyof ReviewFormValues

/** 中国大陆手机号：1 开头第二位 3–9，共 11 位 */
export const CN_MOBILE_RE = /^1[3-9]\d{9}$/

/** 简易邮箱格式 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizePhone(phone: string): string {
  return String(phone || "").replace(/\D/g, "")
}

export function normalizeEmail(email: string): string {
  return String(email || "").trim()
}

export type ReviewValidateOptions = {
  t: (key: string, values?: Record<string, unknown>) => string
}

export type FieldErrors = Partial<Record<ReviewField, string>>

export function validateReviewField(
  field: ReviewField,
  values: ReviewFormValues,
  t: ReviewValidateOptions["t"]
): string {
  const name = values.name.trim()
  const phone = normalizePhone(values.phone)
  const email = normalizeEmail(values.email)
  const store = values.store_name.trim()
  const content = values.content.trim()

  switch (field) {
    case "name":
      if (!name) return t("reviews.errors.nameRequired")
      if (name.length < REVIEW_LIMITS.nameMin) {
        return t("reviews.errors.nameMin", { min: REVIEW_LIMITS.nameMin })
      }
      if (name.length > REVIEW_LIMITS.nameMax) {
        return t("reviews.errors.nameMax", { max: REVIEW_LIMITS.nameMax })
      }
      if (hasMedicalClaim(name)) return t("reviews.compliance")
      return ""
    case "phone": {
      // 手机号 / 邮箱二选一：都空时提示；填了则校验格式
      if (!phone && !email) return t("reviews.errors.contactRequired")
      if (phone && (phone.length !== REVIEW_LIMITS.phoneLen || !CN_MOBILE_RE.test(phone))) {
        return t("reviews.errors.phoneInvalid")
      }
      return ""
    }
    case "email": {
      if (!phone && !email) return t("reviews.errors.contactRequired")
      if (email) {
        if (email.length > REVIEW_LIMITS.emailMax) {
          return t("reviews.errors.emailMax", { max: REVIEW_LIMITS.emailMax })
        }
        if (!EMAIL_RE.test(email)) return t("reviews.errors.emailInvalid")
      }
      return ""
    }
    case "store_name":
      if (!store) return t("reviews.errors.storeRequired")
      if (store.length > REVIEW_LIMITS.storeMax) {
        return t("reviews.errors.storeMax", { max: REVIEW_LIMITS.storeMax })
      }
      return ""
    case "content":
      if (!content) return t("reviews.errors.contentRequired")
      if (content.length < REVIEW_LIMITS.contentMin) {
        return t("reviews.errors.contentMin", { min: REVIEW_LIMITS.contentMin })
      }
      if (content.length > REVIEW_LIMITS.contentMax) {
        return t("reviews.errors.contentMax", { max: REVIEW_LIMITS.contentMax })
      }
      if (hasMedicalClaim(content)) return t("reviews.compliance")
      return ""
    default:
      return ""
  }
}

export function validateReviewForm(
  values: ReviewFormValues,
  t: ReviewValidateOptions["t"]
): { ok: boolean; errors: FieldErrors; firstMessage: string } {
  const fields: ReviewField[] = ["name", "phone", "email", "store_name", "content"]
  const errors: FieldErrors = {}
  for (const field of fields) {
    const msg = validateReviewField(field, values, t)
    if (msg) errors[field] = msg
  }
  const firstMessage =
    errors.name || errors.phone || errors.email || errors.store_name || errors.content || ""
  return { ok: !firstMessage, errors, firstMessage }
}
