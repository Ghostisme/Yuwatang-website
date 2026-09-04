<template>
  <div class="page services">
    <div class="page-banner">
      <img src="@/assets/img/serve-banner.jpg" :alt="t('services.h1')" />
      <h1 class="banner-tit">{{ t("services.h1") }}</h1>
    </div>
    <div class="page-body">
      <p class="lead">{{ t("services.intro") }}</p>
      <div class="service-grid">
        <article
          v-for="item in coreServices"
          :key="item.slug"
          class="service-card"
          @click="goService(item.slug)"
        >
          <img :src="getImg(item.image)" :alt="t(item.nameKey)" />
          <h2>{{ t(item.nameKey) }}</h2>
          <p>{{ t(item.summaryKey) }}</p>
        </article>
      </div>
      <button class="more-link" type="button" @click="goService('traditional')">
        {{ t("services.moreProjects") }} →
      </button>
      <p class="more-note">{{ t("services.moreTraditional") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { services } from "@/config/services"
import { usePageSeo } from "@/composables/usePageSeo"
import { useBreadcrumbJsonLd } from "@/composables/useStructuredData"

const router = useRouter()
const { t } = useI18n()
usePageSeo({ titleKey: "seo.services.title", descriptionKey: "seo.services.description", h1Key: "services.h1" })
useBreadcrumbJsonLd(
  computed(() => [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.feature"), path: "/services" }
  ])
)

const coreServices = computed(() => services.filter((s) => s.slug !== "traditional"))
const getImg = (name: string) => new URL(`../../assets/img/${name}`, import.meta.url).href
const goService = (slug: string) => router.push(`/services/${slug}`)
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
    height: 260px;
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
    font-size: 34px;
    font-family: "LinHai";
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
.page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
.lead {
  text-align: center;
  line-height: 1.8;
  color: rgba(60, 50, 28, 0.75);
  margin-bottom: 40px;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.service-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
  transition: transform 0.25s ease;
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  h2 {
    margin: 16px 20px 8px;
    font-size: 20px;
    font-family: "LinHai";
    color: rgba(60, 50, 28, 1);
  }
  p {
    margin: 0 20px 20px;
    font-size: 14px;
    line-height: 1.7;
    color: rgba(60, 50, 28, 0.7);
  }
  &:hover {
    transform: translateY(-4px);
  }
}
.more-link {
  display: block;
  margin: 28px auto 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(60, 50, 28, 0.85);
  font-size: 16px;
  font-family: "LinHai";
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.more-note {
  margin-top: 16px;
  text-align: center;
  color: rgba(60, 50, 28, 0.55);
  font-size: 14px;
}
</style>
