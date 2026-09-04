<template>
  <div class="about-us">
    <div class="about-banner">
      <img class="banner-poster" src="@/assets/img/home-banner.jpg" :alt="t('aboutV2.h1')" />
      <swiper v-if="videoReady" :modules="modules" :slides-per-view="1" :loop="true" :autoplay="autoplayOptions" :effect="'fade'">
        <swiper-slide v-for="(item, index) in videoList" :key="index">
          <video class="video" :src="item" autoplay muted loop playsinline preload="none"></video>
        </swiper-slide>
      </swiper>
    </div>
    <div class="about-box">
      <h1 class="page-h1">{{ t("aboutV2.h1") }}</h1>
      <p class="lead">{{ t("aboutV2.lead") }}</p>

      <h2 class="section-title">{{ t("aboutV2.storyTitle") }}</h2>
      <div class="story-grid">
        <article v-for="n in 4" :key="n" class="story-card">
          <h3>{{ t(`aboutV2.story${n}Title`) }}</h3>
          <p>{{ t(`aboutV2.story${n}Text`) }}</p>
        </article>
      </div>

      <h2 class="section-title">{{ t("aboutV2.timelineTitle") }}</h2>
      <ul class="timeline">
        <li v-for="item in timeline" :key="item.year">
          <strong class="year">{{ item.year }}</strong>
          <span>{{ item.text }}</span>
        </li>
      </ul>

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
import { ref, computed, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, EffectFade } from "swiper/modules"
import { getHomeBanner } from "@/api"
import { usePageSeo } from "@/composables/usePageSeo"
import { rewriteMediaList } from "@/utils/mediaCdn"
import { resolveI18nLeaf } from "@/utils/i18nSafe"

const { t, locale, tm, rt } = useI18n()
usePageSeo({ titleKey: "seo.about.title", descriptionKey: "seo.about.description", h1Key: "aboutV2.h1" })

const modules = [Autoplay, EffectFade]
const autoplayOptions = { delay: 5000, disableOnInteraction: false } as const
const videoList = ref<string[]>([])
const videoReady = ref(false)

const timeline = computed(() => {
  void locale.value
  const raw = tm("aboutV2.timeline") as Array<{ year: unknown; text: unknown }>
  if (!Array.isArray(raw)) return []
  return raw.map((item) => ({
    year: resolveI18nLeaf(item?.year, rt),
    text: resolveI18nLeaf(item?.text, rt)
  }))
})

const getBanner = () => {
  getHomeBanner().then((res: any) => {
    if (res.code == 1) {
      videoList.value = rewriteMediaList(
        (res.data?.data || []).map((item: any) =>
          locale.value === "en" ? item.image_en : locale.value === "jp" ? item.image_jp : item.image
        )
      )
      videoReady.value = videoList.value.length > 0
    }
  })
}

watch(locale, getBanner)
onMounted(getBanner)
</script>

<style lang="scss" scoped>
.about-us {
  margin-top: 88px;
  background: #fcf8f4;
}
.about-banner {
  position: relative;
  .banner-poster,
  .video {
    width: 100%;
    height: 50vh;
    min-height: 320px;
    object-fit: cover;
    display: block;
  }
  .video {
    position: absolute;
    inset: 0;
  }
}
.about-box {
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 24px 80px;
}
.page-h1 {
  text-align: center;
  font-family: "LinHai";
  font-size: 34px;
  margin: 0 0 20px;
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
.timeline {
  margin: 0;
  padding-left: 20px;
  list-style: none;
  li {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    line-height: 1.6;
    color: rgba(60, 50, 28, 0.8);
    .year {
      flex: 0 0 56px;
      color: rgba(60, 50, 28, 1);
    }
  }
}
.block-text {
  line-height: 1.8;
  margin-bottom: 12px;
  color: rgba(60, 50, 28, 0.78);
}
</style>
