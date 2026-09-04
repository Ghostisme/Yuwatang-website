<template>
  <div class="guide page">
    <div class="page-banner">
      <img src="@/assets/img/contact-banner.jpg" :alt="t('guide.h1')" />
      <h1 class="banner-tit">{{ t("guide.h1") }}</h1>
    </div>
    <div class="guide-body">
      <p class="lead">{{ t("guide.lead") }}</p>
      <nav class="guide-grid" aria-label="网站导览">
        <router-link
          v-for="item in catalogItems"
          :key="item.path"
          class="guide-card"
          :to="item.path"
        >
          <span class="name">{{ t(item.labelKey) }}</span>
          <span class="desc">{{ t(`guide.desc.${item.path.replace(/^\//, "") || "home"}`) }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { catalogItems } from "@/config/navigation"
import { usePageSeo } from "@/composables/usePageSeo"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.guide.title", descriptionKey: "seo.guide.description", h1Key: "guide.h1" })
</script>

<style lang="scss" scoped>
.page {
  padding-top: 88px;
  min-height: 50vh;
  background: #fcf8f4;
}
.page-banner {
  position: relative;
  img {
    width: 100%;
    height: 220px;
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
    font-family: "LinHai";
    font-size: 32px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
.guide-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}
.lead {
  margin: 0 0 28px;
  color: #5a5048;
  line-height: 1.7;
  font-size: 16px;
}
.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.guide-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 20px;
  background: #fff;
  border: 1px solid rgba(90, 80, 72, 0.12);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
  &:hover {
    border-color: rgba(139, 105, 70, 0.45);
    transform: translateY(-1px);
  }
  .name {
    font-family: "LinHai";
    font-size: 20px;
    color: #2f2a26;
  }
  .desc {
    font-size: 14px;
    line-height: 1.6;
    color: #6d635a;
  }
}
@media (max-width: 720px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }
}
</style>
