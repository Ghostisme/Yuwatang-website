import { computed, ref, watch, type Ref } from "vue"
import { useI18n } from "vue-i18n"
import {
  loadStoreBySlug,
  loadStoreRows,
  localizeStore,
  type StoreApiRow,
  type StoreInfo
} from "@/config/stores"

/** 门店列表（按当前语言本地化） */
export function useStoreList() {
  const { locale } = useI18n()
  const rows = ref<StoreApiRow[]>([])
  const loading = ref(true)
  const error = ref("")

  const reload = async (force = false) => {
    loading.value = true
    error.value = ""
    try {
      rows.value = await loadStoreRows(force)
    } catch (e: any) {
      error.value = e?.message || "load failed"
      rows.value = []
    } finally {
      loading.value = false
    }
  }

  void reload()

  const stores = computed<StoreInfo[]>(() =>
    rows.value.map((row) => localizeStore(row, String(locale.value)))
  )

  watch(locale, () => {
    /* 语言切换时 computed 自动重算 */
  })

  return { stores, loading, error, reload }
}

/** 单店详情 */
export function useStoreDetail(slugRef: Ref<string> | (() => string)) {
  const { locale } = useI18n()
  const row = ref<StoreApiRow | null>(null)
  const loading = ref(true)
  const error = ref("")

  const getSlug = () => (typeof slugRef === "function" ? slugRef() : slugRef.value)

  const reload = async () => {
    loading.value = true
    error.value = ""
    try {
      row.value = await loadStoreBySlug(getSlug())
      if (!row.value) error.value = "not found"
    } catch (e: any) {
      error.value = e?.message || "load failed"
      row.value = null
    } finally {
      loading.value = false
    }
  }

  void reload()

  const store = computed<StoreInfo | null>(() =>
    row.value ? localizeStore(row.value, String(locale.value)) : null
  )

  watch(
    () => getSlug(),
    () => {
      void reload()
    }
  )

  return { store, loading, error, reload }
}
