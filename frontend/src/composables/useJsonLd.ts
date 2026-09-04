import { onMounted, onUnmounted, watch, type WatchSource, unref } from "vue"
import { removeJsonLd, upsertJsonLd } from "@/utils/jsonLd"

/** 监听动态 payload，写入 / 清空 JSON-LD */
export function useJsonLd(id: string, source: WatchSource<Record<string, unknown> | null | undefined>) {
  const apply = () => upsertJsonLd(id, unref(source) || null)
  onMounted(apply)
  watch(source, apply, { deep: true })
  onUnmounted(() => removeJsonLd(id))
}
