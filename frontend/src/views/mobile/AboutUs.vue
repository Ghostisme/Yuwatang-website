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
      <article v-for="n in 4" :key="n" class="story-card">
        <h3>{{ t(`aboutV2.story${n}Title`) }}</h3>
        <p>{{ t(`aboutV2.story${n}Text`) }}</p>
      </article>

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
  margin-top: 52px;
  background: #fcf8f4;
}
.about-banner {
  position: relative;
  .banner-poster,
  .video {
    width: 100%;
    height: 40vh;
    min-height: 220px;
    object-fit: cover;
    display: block;
  }
  .video {
    position: absolute;
    inset: 0;
  }
}
.about-box {
  padding: 24px 15px 48px;
}
.page-h1 {
  font-family: "LinHai";
  font-size: 22px;
  margin: 0 0 12px;
  text-align: center;
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
.timeline {
  margin: 0;
  padding-left: 18px;
  li {
    margin-bottom: 10px;
    line-height: 1.55;
    font-size: 13px;
    color: rgba(60, 50, 28, 0.8);
    .year {
      display: inline-block;
      min-width: 48px;
      margin-right: 8px;
      color: rgba(60, 50, 28, 1);
    }
  }
}
.block-text {
  line-height: 1.7;
  font-size: 13px;
  margin-bottom: 10px;
  color: rgba(60, 50, 28, 0.78);
}
</style>
