import { onMounted, onUnmounted, unref, watch, type WatchSource } from "vue"
import { useI18n } from "vue-i18n"
import { upsertJsonLd, removeJsonLd } from "@/utils/jsonLd"

export type PageSeoOptions = {
  titleKey: string
  descriptionKey: string
  h1Key?: string
}

const setMeta = (name: string, content: string) => {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute("name", name)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

/** 直接设置页面 TDK（用于新闻详情等动态页） */
export function setPageMeta(title: string, description: string) {
  if (title) document.title = title
  setMeta("description", description)
}

/** 需求2-5：每页唯一 TDK；需求2-7：配合页面唯一 H1 */
export function usePageSeo(options: PageSeoOptions) {
  const { t } = useI18n()

  const apply = () => {
    setPageMeta(t(options.titleKey), t(options.descriptionKey))
  }

  onMounted(apply)
  watch(() => t(options.titleKey), apply)
  watch(() => t(options.descriptionKey), apply)

  return { h1Key: options.h1Key || options.titleKey }
}

/** 监听动态 TDK（新闻详情等） */
export function useDynamicPageSeo(source: WatchSource<{ title: string; description: string }>) {
  const apply = () => {
    const val = unref(source)
    if (val?.title) setPageMeta(val.title, val.description || "")
  }
  onMounted(apply)
  watch(source, apply, { deep: true })
}

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()

export const articleSeoTitle = (title: string) => (title ? `${title} | 裕和堂 Yu Health` : "新闻资讯 | 裕和堂 Yu Health")

export const serviceSeoTitle = (name: string) =>
  name ? `${name} | 服务项目 | 裕和堂 Yu Health` : "服务项目 | 裕和堂 Yu Health"

export const articleSeoDescription = (content: string, max = 120) => {
  const text = stripHtml(content)
  return text.length > max ? `${text.slice(0, max)}...` : text
}

/** 需求2-18 / 需求2-6：新闻详情 Article JSON-LD */
export function useArticleJsonLd(getArticle: () => Record<string, any> | null | undefined) {
  const apply = () => {
    const article = getArticle()
    if (!article?.article_title) {
      removeJsonLd("article")
      return
    }
    const published = article.datetime || article.createtime
    let datePublished = ""
    if (published) {
      if (typeof published === "number" || /^\d+$/.test(String(published))) {
        const d = new Date(Number(published) * (String(published).length === 10 ? 1000 : 1))
        datePublished = d.toISOString().slice(0, 10)
      } else {
        datePublished = String(published).slice(0, 10)
      }
    }
    upsertJsonLd("article", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.article_title,
      image: article.image ? [article.image] : undefined,
      datePublished: datePublished || undefined,
      author: article.author
        ? { "@type": "Organization", name: article.author }
        : { "@type": "Organization", name: "裕和堂 Yu Health" },
      publisher: {
        "@type": "Organization",
        name: "上海御和堂健康科技有限公司"
      },
      description: articleSeoDescription(article.content || "", 160)
    })
  }

  onMounted(apply)
  watch(() => getArticle(), apply, { deep: true })
  onUnmounted(() => removeJsonLd("article"))
}

/** 需求2-17 / 需求2-6：FAQ 页 FAQPage JSON-LD */
export function useFaqPageJsonLd(getItems: () => Array<{ q: string; a: string }>) {
  const apply = () => {
    const items = getItems() || []
    if (!items.length) {
      removeJsonLd("faqpage")
      return
    }
    upsertJsonLd("faqpage", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a
        }
      }))
    })
  }

  onMounted(apply)
  watch(() => getItems(), apply, { deep: true })
  onUnmounted(() => removeJsonLd("faqpage"))
}
