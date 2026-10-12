<template>
  <div class="about-us">
    <PageBanner page="brand" />
    <div class="about-box">
      <p class="lead">{{ t("aboutV2.lead") }}</p>

      <h2 class="section-title">{{ t("aboutV2.storyTitle") }}</h2>
      <div class="story-grid">
        <article v-for="n in 4" :key="n" class="story-card">
          <h3>{{ t(`aboutV2.story${n}Title`) }}</h3>
          <p>{{ t(`aboutV2.story${n}Text`) }}</p>
        </article>
      </div>

      <h2 class="section-title">{{ t("aboutV2.timelineTitle") }}</h2>
      <BrandTimeline :items="timeline" />

      <h2 class="section-title">{{ t("aboutV2.mvvTitle") }}</h2>
      <p class="block-text">{{ t("aboutV2.mission") }}</p>
      <p class="block-text">{{ t("aboutV2.vision") }}</p>
      <p class="block-text">{{ t("aboutV2.values") }}</p>

      <h2 class="section-title">{{ t("aboutV2.honorsTitle") }}</h2>
      <p class="block-text">{{ t("aboutV2.honors") }}</p>

      <AboutProductSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageBanner from "@/components/PageBanner.vue"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { usePageSeo } from "@/composables/usePageSeo"
import { resolveI18nLeaf } from "@/utils/i18nSafe"
import BrandTimeline from "@/components/BrandTimeline.vue"
import AboutProductSection from "@/components/AboutProductSection.vue"

const { t, locale, tm, rt } = useI18n()
usePageSeo({ titleKey: "seo.about.title", descriptionKey: "seo.about.description", h1Key: "pageBanners.brand" })

const timeline = computed(() => {
  void locale.value
  const raw = tm("aboutV2.timeline") as Array<{ year: unknown; text: unknown }>
  if (!Array.isArray(raw)) return []
  return raw.map((item) => ({
    year: resolveI18nLeaf(item?.year, rt),
    text: resolveI18nLeaf(item?.text, rt)
  }))
})

</script>

<style lang="scss" scoped>
.about-us {
  margin-top: 88px;
  background: #fcf8f4;
}
.about-box {
  max-width: 960px;
  margin: 0 auto;
  padding: 56px 24px 80px;
}
.lead {
  text-align: center;
  line-height: 1.85;
  color: rgba(60, 50, 28, 0.78);
  margin-bottom: 48px;
}
.section-title {
  font-family: "LinHai";
  font-size: 22px;
  margin: 40px 0 20px;
  color: rgba(60, 50, 28, 1);
}
.story-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.story-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  h3 {
    margin: 0 0 12px;
    font-size: 18px;
    color: rgba(122, 86, 54, 1);
  }
  p {
    margin: 0;
    line-height: 1.75;
    font-size: 15px;
    color: rgba(60, 50, 28, 0.75);
  }
}
.block-text {
  line-height: 1.8;
  margin-bottom: 12px;
  color: rgba(60, 50, 28, 0.78);
}
</style>
