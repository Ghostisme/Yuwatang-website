import { createI18n } from "vue-i18n"

// 导入语言文件
import en from "@/locales/en"
import zh from "@/locales/zh"
import jp from "@/locales/jp"

// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof zh

const i18n = createI18n<[MessageSchema], "en" | "zh" | "jp">({
  locale: "zh", // 默认语言
  fallbackLocale: "zh", // 回退语言
  messages: {
    en,
    zh,
    jp
  }
})

export default i18n
