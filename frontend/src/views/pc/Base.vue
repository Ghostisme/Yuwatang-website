<template>
  <div class="base">
    <div class="base-banner">
      <img src="@/assets/img/base-banner.jpg" :alt="t('baseV2.h1')" />
      <h1 class="banner-tit">{{ t("baseV2.h1") }}</h1>
    </div>
    <div class="base-body">
      <BaseStory />
      <section class="film">
        <h2>{{ t("baseV2.filmTitle") }}</h2>
        <p>{{ t("baseV2.filmLead") }}</p>
        <div class="film-frame">
          <video
            v-if="isDirectVideo"
            :src="documentaryUrl"
            :poster="documentaryPoster"
            controls
            playsinline
            preload="none"
            :title="t('baseV2.filmWatch')"
          />
          <iframe
            v-else-if="documentaryUrl"
            :src="documentaryUrl"
            :title="t('baseV2.filmWatch')"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <p v-else class="film-placeholder">{{ t("baseV2.filmPlaceholder") }}</p>
        </div>
      </section>
      <div class="base-gallery">
        <img src="@/assets/img/base-img1.jpg" alt="蕲春艾草基地" />
        <img src="@/assets/img/base-img2.jpg" alt="艾草采收" />
        <img src="@/assets/img/base-img3.jpg" alt="陈艾仓储" />
        <img src="@/assets/img/base-img4.jpg" alt="制条工艺" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import BaseStory from "@/components/BaseStory.vue"
import { usePageSeo } from "@/composables/usePageSeo"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.base.title", descriptionKey: "seo.base.description", h1Key: "baseV2.h1" })

const mediaBaseUrl = `${String(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")}media/`
const defaultDocumentaryUrl = `${mediaBaseUrl}base-documentary.mp4?v=720p-20261012`
const documentaryUrl = computed(() => String(import.meta.env.VITE_DOCUMENTARY_URL || "").trim() || defaultDocumentaryUrl)
const documentaryPoster = computed(() =>
  documentaryUrl.value === defaultDocumentaryUrl ? `${mediaBaseUrl}base-documentary.jpg?v=720p-20261012` : undefined
)
const isDirectVideo = computed(() => /\.(mp4|webm|ogg)([?#]|$)/i.test(documentaryUrl.value))
</script>

<style lang="scss" scoped>
.base {
  margin-top: 88px;
  background: #fcf8f4;
  min-height: 60vh;
}
.base-banner {
  position: relative;
  img {
    width: 100%;
    max-height: 360px;
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
    font-size: 36px;
    font-family: "LinHai";
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
.base-body {
  max-width: 1120px;
  margin: 0 auto;
  padding: 64px 32px 88px;
  font-family: "Microsoft YaHei", var(--font-zh);
}
.film {
  padding-top: 44px;
  margin-bottom: 32px;

  h2 {
    margin: 0 0 16px;
    color: #3c321c;
    font-family: "LinHai", "Microsoft YaHei", var(--font-zh);
    font-size: 28px;
    font-weight: 600;
    line-height: 1.5;
  }

  p {
    margin: 0;
    color: rgba(60, 50, 28, 0.74);
    font-size: 16px;
    line-height: 1.95;
  }
}
.film-frame {
  margin-top: 16px;
  background: rgba(60, 50, 28, 0.06);
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  video,
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    background: #1a1610;
  }
  .film-placeholder {
    margin: 0;
    padding: 24px;
    text-align: center;
    color: rgba(60, 50, 28, 0.55);
  }
}
.base-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
  img {
    width: 100%;
    border-radius: 10px;
    display: block;
    object-fit: cover;
    aspect-ratio: 4/3;
  }
}
</style>
