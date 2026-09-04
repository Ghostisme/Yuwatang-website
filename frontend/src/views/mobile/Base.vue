<template>
  <div class="base">
    <div class="base-banner">
      <img src="@/assets/img/base-banner.jpg" :alt="t('baseV2.h1')" />
      <h1 class="banner-tit">{{ t("baseV2.h1") }}</h1>
    </div>
    <div class="base-body">
      <section>
        <h2>{{ t("baseV2.moxibustionTitle") }}</h2>
        <p>{{ t("baseV2.moxibustionIntro") }}</p>
      </section>
      <section>
        <h2>{{ t("baseV2.whyTitle") }}</h2>
        <p>{{ t("baseV2.whyLead") }}</p>
        <p>{{ t("baseV2.whyQiai") }}</p>
        <p>{{ t("baseV2.whyThree") }}</p>
      </section>
      <section>
        <h2>{{ t("baseV2.processTitle") }}</h2>
        <p>{{ t("baseV2.processLead") }}</p>
        <ol>
          <li>{{ t("baseV2.process1") }}</li>
          <li>{{ t("baseV2.process2") }}</li>
          <li>{{ t("baseV2.process3") }}</li>
          <li>{{ t("baseV2.process4") }}</li>
        </ol>
      </section>
      <section>
        <h2>{{ t("baseV2.qualityTitle") }}</h2>
        <p>{{ t("baseV2.qualityText") }}</p>
      </section>
      <section class="film">
        <h2>{{ t("baseV2.filmTitle") }}</h2>
        <p>{{ t("baseV2.filmLead") }}</p>
        <div class="film-frame">
          <video v-if="isDirectVideo" :src="documentaryUrl" controls playsinline preload="metadata" :title="t('baseV2.filmWatch')" />
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
import { usePageSeo } from "@/composables/usePageSeo"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.base.title", descriptionKey: "seo.base.description", h1Key: "baseV2.h1" })

const documentaryUrl = computed(() => String(import.meta.env.VITE_DOCUMENTARY_URL || "").trim())
const isDirectVideo = computed(() => /\.(mp4|webm|ogg)(\?|$)/i.test(documentaryUrl.value))
</script>

<style lang="scss" scoped>
.base {
  margin-top: 52px;
  background: #fcf8f4;
  min-height: 60vh;
}
.base-banner {
  position: relative;
  img {
    width: 100%;
    display: block;
    object-fit: cover;
    max-height: 200px;
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
.base-body {
  padding: 24px 15px 48px;
  section {
    margin-bottom: 24px;
    h2 {
      font-family: "LinHai";
      font-size: 18px;
      margin: 0 0 12px;
    }
    p,
    li {
      font-size: 13px;
      line-height: 1.7;
      color: rgba(60, 50, 28, 0.78);
      margin-bottom: 8px;
    }
  }
  ol {
    padding-left: 18px;
  }
}
.film-frame {
  margin-top: 12px;
  background: rgba(60, 50, 28, 0.06);
  border-radius: 8px;
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
    padding: 16px;
    text-align: center;
    font-size: 13px;
    color: rgba(60, 50, 28, 0.55);
  }
}
.base-gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  img {
    width: 100%;
    border-radius: 8px;
    display: block;
    aspect-ratio: 4/3;
    object-fit: cover;
  }
}
</style>
