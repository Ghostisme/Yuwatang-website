<template>
  <section class="about-product" :class="{ mobile }">
    <h2 class="section-title">{{ t("aboutV2.productTitle") }}</h2>
    <p class="section-lead">{{ t("aboutV2.productLead") }}</p>

    <!-- 主视觉：图 + 视频（手机端视频置顶可见） -->
    <div class="hero-media">
      <div class="media-panel video-panel">
        <div class="video-wrap">
          <video
            class="video"
            controls
            playsinline
            preload="metadata"
            :poster="productImages[0]"
            :src="productVideo.src"
          ></video>
        </div>
        <p class="media-cap">{{ productVideo.caption }}</p>
      </div>
      <div class="media-panel image-panel" v-for="(src, i) in productImages" :key="i">
        <div class="image-frame">
          <img :src="src" :alt="t('aboutV2.productImages')" />
        </div>
      </div>
    </div>

    <!-- 产品信息：与故事卡同级的白卡 -->
    <article class="story-card info-card">
      <h3>{{ t("aboutV2.productInfo") }}</h3>
      <dl class="info-list">
        <div v-for="(row, i) in productRows" :key="i" class="info-row">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>
    </article>

    <!-- 资质：Fancybox + Panzoom（成熟拖拽缩放旋转） -->
    <h3 class="sub-title">{{ t("aboutV2.productQualify") }}</h3>
    <div ref="qualifyGalleryRef" class="qualify-grid">
      <a
        v-for="(src, i) in qualifyImages"
        :key="i"
        class="qualify-item"
        :href="src"
        data-fancybox="qualify"
        :data-caption="`${t('aboutV2.productQualify')} ${i + 1}`"
      >
        <img :src="src" :alt="`${t('aboutV2.productQualify')} ${i + 1}`" loading="lazy" />
      </a>
    </div>

    <!-- 使用说明 -->
    <article class="story-card usage-card">
      <h3>{{ t("aboutV2.productUsage") }}</h3>
      <p class="usage-main">艾条产品使用说明</p>
      <div v-for="(sec, si) in usageSections" :key="si" class="usage-sec">
        <h4>{{ sec.title }}</h4>
        <div v-for="(blk, bi) in sec.blocks" :key="bi" class="usage-blk">
          <h5>{{ blk.subtitle }}</h5>
          <p v-for="(p, pi) in blk.paragraphs" :key="pi">{{ p }}</p>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js"
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import {
  productImages,
  productRows,
  productVideo,
  qualifyImages,
  usageSections
} from "@/data/traceProduct"

defineProps<{ mobile?: boolean }>()

const { t } = useI18n()
const qualifyGalleryRef = ref<HTMLElement | null>(null)

const fancyboxOptions = {
  Carousel: {
    Toolbar: {
      display: {
        left: ["counter"],
        middle: [
          "zoomIn",
          "zoomOut",
          "toggle1to1",
          "rotateCCW",
          "rotateCW",
          "flipX",
          "flipY",
          "reset"
        ],
        right: ["thumbs", "close"]
      }
    }
  }
} as const

const bindQualifyFancybox = async () => {
  await nextTick()
  const el = qualifyGalleryRef.value
  if (!el) return
  Fancybox.unbind(el)
  Fancybox.bind(el, "[data-fancybox]", fancyboxOptions)
}

onMounted(bindQualifyFancybox)
onBeforeUnmount(() => {
  const el = qualifyGalleryRef.value
  if (el) Fancybox.unbind(el)
  Fancybox.close(true)
})
</script>

<style lang="scss" scoped>
.about-product {
  margin-top: 8px;
}

/* 与 AboutUs .section-title / .story-card 对齐 */
.section-title {
  font-family: "LinHai";
  font-size: 22px;
  margin: 40px 0 12px;
  color: rgba(60, 50, 28, 1);
}
.section-lead {
  margin: 0 0 24px;
  line-height: 1.85;
  color: rgba(60, 50, 28, 0.78);
  font-size: 15px;
}
.sub-title {
  font-family: "LinHai";
  font-size: 18px;
  margin: 28px 0 14px;
  color: rgba(122, 86, 54, 1);
}
.story-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    color: rgba(122, 86, 54, 1);
  }
}

/* 主视觉：PC 左视频右图；手机视频在上 */
.hero-media {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  margin-bottom: 20px;
  align-items: stretch;
}
.media-panel {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  min-width: 0;
}
.video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1510;
  .video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background: #000;
  }
}
.image-frame {
  width: 100%;
  height: 100%;
  min-height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f0ea;
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
}
.media-cap {
  margin: 8px 0 0;
  font-size: 13px;
  text-align: center;
  color: rgba(60, 50, 28, 0.5);
}

.info-card {
  margin-bottom: 8px;
}
.info-list {
  margin: 0;
}
.info-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid rgba(60, 50, 28, 0.06);
  font-size: 14px;
  line-height: 1.55;
  &:first-child {
    border-top: 0;
    padding-top: 0;
  }
  dt {
    margin: 0;
    color: rgba(60, 50, 28, 0.48);
  }
  dd {
    margin: 0;
    color: rgba(60, 50, 28, 0.9);
    text-align: left;
  }
}

.qualify-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.qualify-item {
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 10px rgba(60, 50, 28, 0.05);
  cursor: zoom-in;
  aspect-ratio: 3 / 4;
  text-decoration: none;
  color: inherit;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
.usage-card {
  h3 {
    margin: 0 0 12px;
  }
}
.usage-main {
  margin: 0 0 14px;
  font-size: 15px;
  color: rgba(60, 50, 28, 0.85);
}
.usage-sec {
  margin-bottom: 16px;
  h4 {
    margin: 0 0 8px;
    font-size: 15px;
    color: rgba(122, 86, 54, 1);
  }
}
.usage-blk {
  margin-bottom: 12px;
  h5 {
    margin: 0 0 6px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(60, 50, 28, 0.85);
  }
  p {
    margin: 0 0 6px;
    font-size: 13px;
    line-height: 1.75;
    color: rgba(60, 50, 28, 0.72);
  }
}

/* 手机端：视频优先、单列节奏与 About 故事卡一致 */
.about-product.mobile {
  .section-title {
    font-size: 18px;
    margin: 28px 0 10px;
  }
  .section-lead {
    font-size: 13px;
    line-height: 1.75;
    margin-bottom: 16px;
  }
  .hero-media {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .media-panel {
    border-radius: 10px;
    padding: 10px;
  }
  .video-wrap {
    aspect-ratio: 16 / 9;
    border-radius: 6px;
  }
  .image-frame {
    min-height: 0;
    aspect-ratio: 1;
    border-radius: 6px;
  }
  .story-card {
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 12px;
    h3 {
      font-size: 15px;
      margin-bottom: 10px;
    }
  }
  .sub-title {
    font-size: 15px;
    margin: 20px 0 10px;
  }
  .info-row {
    grid-template-columns: 1fr;
    gap: 2px;
    font-size: 13px;
    padding: 10px 0;
  }
  .qualify-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }
  .usage-blk p {
    font-size: 12px;
  }
}

@media (max-width: 719px) {
  .about-product:not(.mobile) {
    .hero-media {
      grid-template-columns: 1fr;
    }
    .qualify-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
