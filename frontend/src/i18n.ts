import { createI18n } from "vue-i18n"

import enBase from "@/locales/en"
import zhBase from "@/locales/zh"
import jpBase from "@/locales/jp"
import req2En from "@/locales/req2-en"
import req2Jp from "@/locales/req2-jp"
import faqZh from "@/locales/faq-zh"
import faqEn from "@/locales/faq-en"
import faqJp from "@/locales/faq-jp"
import { resolveInitialLocale } from "@/utils/localeUrl"
import { cloneMessages, faqUiOnly } from "@/utils/i18nSafe"

type MessageSchema = typeof zh

const mergeReq2 = <T extends Record<string, unknown>>(base: T, req2: Record<string, unknown>): T => ({
  ...base,
  ...req2,
  nav: { ...(base.nav as object), ...(req2.nav as object) }
})

/** 深拷贝 + FAQ items 不进 i18n，避免源模块/数组被编译成 message 函数 */
const zh = cloneMessages({ ...zhBase, faq: faqUiOnly(faqZh) })
const en = cloneMessages({ ...mergeReq2(enBase, req2En), faq: faqUiOnly(faqEn) })
const jp = cloneMessages({ ...mergeReq2(jpBase, req2Jp), faq: faqUiOnly(faqJp) })

const initialLocale = typeof window !== "undefined" ? resolveInitialLocale() : "zh"

const i18n = createI18n<[MessageSchema], "en" | "zh" | "jp">({
  locale: initialLocale,
  fallbackLocale: "zh",
  messages: {
    en,
    zh,
    jp
  }
})

export default i18n
