<template>
  <div class="page stores">
    <div class="page-banner">
      <img src="@/assets/img/store-banner.png" :alt="t('stores.h1')" />
      <h1 class="banner-tit">{{ t("stores.h1") }}</h1>
    </div>
    <div class="page-body">
      <p class="lead">{{ t("stores.intro") }}</p>
      <p class="sub">{{ t("stores.sub") }}</p>
      <div class="store-list">
        <article
          v-for="store in stores"
          :key="store.slug"
          class="store-card"
          @click="goStore(store.slug)"
        >
          <img :src="store.image" :alt="store.name" class="card-img" />
          <div class="card-body">
            <h2>{{ store.name }}</h2>
            <p class="tagline">{{ store.tagline }}</p>
            <p class="meta">{{ store.address }}</p>
            <p class="meta metro">{{ t("stores.metro") }}{{ store.metro }}</p>
            <p class="meta">{{ store.phone }} · {{ store.hours }}</p>
          </div>
        </article>
      </div>
      <div class="cta-row">
        <button class="cta" type="button" @click="router.push('/contact')">{{ t("stores.emailCta") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useStoreList } from "@/composables/useStores"
import { usePageSeo } from "@/composables/usePageSeo"
import { useBreadcrumbJsonLd, useStoresGraphJsonLd } from "@/composables/useStructuredData"

const router = useRouter()
const { t } = useI18n()
const { stores } = useStoreList()
usePageSeo({ titleKey: "seo.stores.title", descriptionKey: "seo.stores.description", h1Key: "stores.h1" })
useStoresGraphJsonLd(stores)
useBreadcrumbJsonLd(
  computed(() => [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.store"), path: "/stores" }
  ])
)

const goStore = (slug: string) => router.push(`/stores/${slug}`)
</script>

<style lang="scss" scoped>
.page {
  padding-top: 52px;
  background: #fcf8f4;
  min-height: 60vh;
  padding-bottom: 48px;
}
.page-banner {
  position: relative;
  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  .banner-tit {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    color: #fff;
    font-size: 22px;
    font-family: "LinHai";
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  }
}
.page-body {
  padding: 20px 16px;
}
.lead {
  text-align: center;
  font-size: 16px;
  font-family: "LinHai";
  margin-bottom: 6px;
}
.sub {
  text-align: center;
  color: rgba(60, 50, 28, 0.6);
  margin-bottom: 20px;
  font-size: 12px;
}
.store-list {
  display: grid;
  gap: 14px;
}
.store-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(60, 50, 28, 0.06);
  .card-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }
  .card-body {
    padding: 14px;
  }
  h2 {
    margin: 0 0 6px;
    font-size: 16px;
    font-family: "LinHai";
  }
  .tagline {
    color: rgba(122, 86, 54, 1);
    font-size: 12px;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  .meta {
    margin: 0 0 4px;
    font-size: 12px;
    color: rgba(60, 50, 28, 0.65);
    line-height: 1.5;
    &.metro {
      color: rgba(122, 86, 54, 0.85);
    }
  }
}
.cta-row {
  text-align: center;
  margin-top: 24px;
}
.cta {
  padding: 12px 28px;
  border: none;
  border-radius: 999px;
  background: rgba(60, 50, 28, 1);
  color: #fff;
  font-family: "LinHai";
  font-size: 14px;
}
</style>
