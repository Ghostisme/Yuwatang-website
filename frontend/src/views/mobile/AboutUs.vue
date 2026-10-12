<template>
  <div class="about-us">
    <PageBanner page="brand" />
    <div class="about-box">
      <p class="lead">{{ t("aboutV2.lead") }}</p>

      <h2 class="section-title">{{ t("aboutV2.storyTitle") }}</h2>
      <article v-for="n in 4" :key="n" class="story-card">
        <h3>{{ t(`aboutV2.story${n}Title`) }}</h3>
        <p>{{ t(`aboutV2.story${n}Text`) }}</p>
      </article>

      <h2 class="section-title">{{ t("aboutV2.timelineTitle") }}</h2>
      <BrandTimeline :items="timeline" mobile />

      <h2 class="section-title">{{ t("aboutV2.mvvTitle") }}</h2>
      <p class="block-text">{{ t("aboutV2.mission") }}</p>
      <p class="block-text">{{ t("aboutV2.vision") }}</p>
      <p class="block-text">{{ t("aboutV2.values") }}</p>

      <h2 class="section-title">{{ t("aboutV2.honorsTitle") }}</h2>
      <p class="block-text">{{ t("aboutV2.honors") }}</p>

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
  margin-top: 52px;
  background: #fcf8f4;
}
.about-box {
  padding: 24px 15px 48px;
}
.lead {
  line-height: 1.75;
  color: rgba(60, 50, 28, 0.78);
  margin-bottom: 24px;
}
.section-title {
  font-family: "LinHai";
  font-size: 18px;
  margin: 28px 0 12px;
  color: rgba(60, 50, 28, 1);
}
.story-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    color: rgba(60, 50, 28, 0.75);
  }
}
.block-text {
  line-height: 1.7;
  font-size: 13px;
  margin-bottom: 10px;
  color: rgba(60, 50, 28, 0.78);
}
</style>
