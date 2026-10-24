<template>
  <div class="base">
    <PageBanner page="base" />
    <div class="base-body">
      <BaseStory />
      <section class="film">
        <p>{{ t("baseV2.filmLead") }}</p>
        <div class="film-frame">
          <BufferedVideo
            v-if="isDirectVideo"
            :key="documentaryUrl"
            :src="documentaryUrl"
            :poster="documentaryPoster"
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
      <BaseProductSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import BaseStory from "@/components/BaseStory.vue"
import BaseProductSection from "@/components/BaseProductSection.vue"
import BufferedVideo from "@/components/BufferedVideo.vue"
import { usePageSeo } from "@/composables/usePageSeo"
import { getBaseDocumentaryAssets } from "@/config/baseDocumentary"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.base.title", descriptionKey: "seo.base.description", h1Key: "baseV2.h1" })

const documentary = getBaseDocumentaryAssets()
const documentaryUrl = computed(() => documentary.src)
const documentaryPoster = computed(() => documentary.poster)
const isDirectVideo = computed(() => /\.(mp4|webm|ogg)([?#]|$)/i.test(documentaryUrl.value))
</script>

<style lang="scss" scoped>
.base {
  margin-top: 52px;
  background: #fcf8f4;
  min-height: 60vh;
}
.base-body {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 20px 56px;
  font-family: "Microsoft YaHei", var(--font-zh);
}
.film {
  padding-top: 32px;
  margin-bottom: 24px;

  p {
    margin: 0;
    color: rgba(60, 50, 28, 0.74);
    font-size: 15px;
    line-height: 1.85;
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
