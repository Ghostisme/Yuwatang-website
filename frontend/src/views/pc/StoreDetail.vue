<template>
  <div class="page store-detail">
    <div class="page-body" v-if="store">
      <StoreDetailBody :store="store" />
    </div>
    <div class="page-body" v-else-if="loading">
      <p>{{ t("reviews.loading") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import StoreDetailBody from "@/components/StoreDetailBody.vue"
import { useStoreDetail } from "@/composables/useStores"
import { articleSeoDescription, useDynamicPageSeo } from "@/composables/usePageSeo"
import { useBreadcrumbJsonLd, useLocalBusinessJsonLd } from "@/composables/useStructuredData"

const route = useRoute()
const { t } = useI18n()
const slug = computed(() => String(route.params.slug || ""))
const { store, loading } = useStoreDetail(slug)

const pageMeta = computed(() => {
  if (!store.value) return { title: "", description: "" }
  const name = store.value.name
  return {
    title: `${name} | 门店 | 裕和堂 Yu Health`,
    description: articleSeoDescription(`${store.value.tagline} ${store.value.address} ${store.value.metro}`, 120)
  }
})
useDynamicPageSeo(pageMeta)
useLocalBusinessJsonLd(store)
useBreadcrumbJsonLd(
  computed(() =>
    store.value
      ? [
          { name: t("nav.home"), path: "/" },
          { name: t("nav.store"), path: "/stores" },
          { name: store.value.name, path: `/stores/${store.value.slug}` }
        ]
      : []
  )
)
</script>

<style lang="scss" scoped>
.page {
  padding-top: 88px;
  background: #fcf8f4;
  min-height: 60vh;
}
.page-body {
  padding: 32px 24px 64px;
}
</style>
