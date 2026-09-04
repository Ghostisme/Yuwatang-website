<template>
  <div class="page service-detail" v-if="service">
    <div class="page-body">
      <h1 class="page-h1">{{ t(service.nameKey) }}</h1>
      <p class="lead">{{ t(service.summaryKey) }}</p>
      <img class="hero-img" :src="getImg(service.image)" :alt="t(service.nameKey)" />
      <div class="body-text" v-html="t(service.bodyKey)"></div>

      <section v-if="faqs.length" class="service-faq" aria-labelledby="service-faq-title">
        <h2 id="service-faq-title" class="faq-title">{{ t("services.faqTitle") }}</h2>
        <details v-for="(item, index) in faqs" :key="index" class="faq-item" :open="index === 0">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </section>

      <button class="back-btn" type="button" @click="router.push('/services')">{{ t("services.back") }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { getServiceBySlug } from "@/config/services"
import { getServiceFaqs } from "@/config/serviceFaqs"
import { articleSeoDescription, serviceSeoTitle, useDynamicPageSeo, useFaqPageJsonLd } from "@/composables/usePageSeo"
import { useBreadcrumbJsonLd, useServiceJsonLd } from "@/composables/useStructuredData"

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const service = computed(() => getServiceBySlug(String(route.params.slug || "")))
const faqs = computed(() => (service.value ? getServiceFaqs(service.value.slug, locale.value) : []))

const pageMeta = computed(() => {
  if (!service.value) return { title: "", description: "" }
  const name = t(service.value.nameKey)
  return {
    title: serviceSeoTitle(name),
    description: articleSeoDescription(t(service.value.summaryKey), 120)
  }
})
useDynamicPageSeo(pageMeta)
useServiceJsonLd(service)
useFaqPageJsonLd(() => faqs.value)
useBreadcrumbJsonLd(
  computed(() =>
    service.value
      ? [
          { name: t("nav.home"), path: "/" },
          { name: t("nav.feature"), path: "/services" },
          { name: t(service.value.nameKey), path: `/services/${service.value.slug}` }
        ]
      : []
  )
)

const getImg = (name: string) => new URL(`../../assets/img/${name}`, import.meta.url).href
</script>

<style lang="scss" scoped>
.page {
  padding-top: 88px;
  background: #fcf8f4;
  min-height: 60vh;
}
.page-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
.page-h1 {
  text-align: center;
  font-family: "LinHai";
  font-size: 32px;
  margin: 0 0 16px;
}
.lead {
  text-align: center;
  line-height: 1.8;
  color: rgba(60, 50, 28, 0.75);
  margin-bottom: 32px;
}
.hero-img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 32px;
}
.body-text {
  line-height: 1.85;
  color: rgba(60, 50, 28, 0.8);
  :deep(p) {
    margin: 0 0 1em;
  }
}
.service-faq {
  margin-top: 48px;
}
.faq-title {
  text-align: center;
  font-family: "LinHai";
  font-size: 24px;
  margin: 0 0 16px;
}
.faq-item {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  margin-bottom: 10px;
  overflow: hidden;
  summary {
    list-style: none;
    cursor: pointer;
    padding: 16px 18px;
    font-family: "LinHai";
    &::-webkit-details-marker {
      display: none;
    }
  }
  p {
    margin: 0;
    padding: 0 18px 16px;
    line-height: 1.75;
    color: rgba(60, 50, 28, 0.78);
    font-size: 14px;
  }
}
.back-btn {
  margin-top: 40px;
  padding: 12px 28px;
  border: 1px solid rgba(60, 50, 28, 0.25);
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
  font-family: "LinHai";
}
</style>
