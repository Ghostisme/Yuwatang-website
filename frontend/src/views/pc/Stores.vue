<template>
  <div class="page stores">
    <div class="page-banner">
      <img src="@/assets/img/store-banner.png" :alt="t('stores.h1')" />
      <h1 class="banner-tit">{{ t("stores.h1") }}</h1>
    </div>
    <div class="page-body">
      <p class="lead">{{ t("stores.intro") }}</p>
      <p class="sub">{{ t("stores.sub") }}</p>
      <p v-if="loading" class="sub">{{ t("reviews.loading") }}</p>
      <div class="store-grid">
        <article
          v-for="store in stores"
          :key="store.slug"
          class="store-card"
          @click="goStore(store.slug)"
        >
          <div class="card-img">
            <img :src="store.image" :alt="store.name" />
          </div>
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
const { stores, loading } = useStoreList()

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
  padding-top: 88px;
  background: #fcf8f4;
  min-height: 60vh;
}
.page-banner {
  position: relative;
  img {
    width: 100%;
    max-height: 280px;
    object-fit: cover;
    display: block;
  }
  .banner-tit {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    color: #fff;
    font-size: 34px;
    font-family: "LinHai";
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
.page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}
.lead {
  text-align: center;
  font-size: 18px;
  color: #3c321c;
  margin: 0 0 8px;
}
.sub {
  text-align: center;
  color: rgba(60, 50, 28, 0.55);
  margin: 0 0 32px;
}
.store-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.store-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(60, 50, 28, 0.12);
  }
}
.card-img img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}
.card-body {
  padding: 16px 18px 20px;
  h2 {
    margin: 0 0 8px;
    font-family: "LinHai";
    font-size: 20px;
    color: #3c321c;
  }
}
.tagline {
  margin: 0 0 10px;
  color: rgba(60, 50, 28, 0.7);
  font-size: 13px;
  line-height: 1.5;
  min-height: 40px;
}
.meta {
  margin: 0 0 4px;
  font-size: 12px;
  color: rgba(60, 50, 28, 0.6);
  line-height: 1.5;
}
.cta-row {
  text-align: center;
  margin-top: 36px;
}
.cta {
  border: 0;
  border-radius: 999px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #6a5638, #3c321c);
  color: #fff8ee;
  cursor: pointer;
}
@media (max-width: 900px) {
  .store-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 600px) {
  .store-grid {
    grid-template-columns: 1fr;
  }
}
</style>
