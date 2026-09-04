import { onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import {
  APP_LOCALES,
  DEFAULT_LOCALE,
  HREFLANG_MAP,
  HTML_LANG_MAP,
  buildLocaleHref,
  isAppLocale,
  type AppLocale
} from "@/utils/localeUrl"

const LINK_ATTR = "data-hreflang-managed"
const CANONICAL_ATTR = "data-hreflang-canonical"

const clearManagedLinks = () => {
  document.querySelectorAll(`link[${LINK_ATTR}]`).forEach((el) => el.remove())
  document.querySelector(`link[${CANONICAL_ATTR}]`)?.remove()
}

const upsertAlternate = (hreflang: string, href: string) => {
  const el = document.createElement("link")
  el.setAttribute("rel", "alternate")
  el.setAttribute("hreflang", hreflang)
  el.setAttribute("href", href)
  el.setAttribute(LINK_ATTR, "1")
  document.head.appendChild(el)
}

const upsertCanonical = (href: string) => {
  let el = document.querySelector(`link[${CANONICAL_ATTR}]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", "canonical")
    el.setAttribute(CANONICAL_ATTR, "1")
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

/** 需求2-9：每页输出 zh-CN / en / ja + x-default 的 hreflang，并同步 html[lang] / ?lang= */
export function useHreflang() {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()
  let syncingQuery = false

  const applyTags = () => {
    const current = isAppLocale(locale.value) ? locale.value : DEFAULT_LOCALE
    const path = route.path || "/"

    document.documentElement.setAttribute("lang", HTML_LANG_MAP[current])

    clearManagedLinks()
    for (const code of APP_LOCALES) {
      upsertAlternate(HREFLANG_MAP[code], buildLocaleHref(path, code))
    }
    upsertAlternate("x-default", buildLocaleHref(path, DEFAULT_LOCALE))
    upsertCanonical(buildLocaleHref(path, current as AppLocale))
  }

  const syncLocaleFromQuery = () => {
    const q = route.query.lang
    if (isAppLocale(q) && q !== locale.value) {
      locale.value = q
      localStorage.setItem("user-locale", q)
    }
  }

  /** 只补 ?lang=，不改写 path，避免误伤深链 */
  const ensureLangQuery = () => {
    const current = isAppLocale(locale.value) ? locale.value : DEFAULT_LOCALE
    if (route.query.lang === current) return
    syncingQuery = true
    router
      .replace({ query: { ...route.query, lang: current } })
      .catch(() => undefined)
      .finally(() => {
        syncingQuery = false
      })
  }

  onMounted(() => {
    // mount 前已 isReady；此处再等一次，防止 HMR / 热更新竞态
    router.isReady().then(() => {
      syncLocaleFromQuery()
      ensureLangQuery()
      applyTags()
    })
  })

  watch(
    () => route.fullPath,
    () => {
      if (syncingQuery) return
      syncLocaleFromQuery()
      ensureLangQuery()
      applyTags()
    }
  )

  watch(locale, () => {
    if (syncingQuery) return
    ensureLangQuery()
    applyTags()
  })
}
