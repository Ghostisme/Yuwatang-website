<template>
  <div class="base-product-sections">
    <section class="base-product-intro">
      <h2 class="base-product-title">{{ t("baseV2.productTitle") }}</h2>
      <p class="base-product-lead">{{ t("baseV2.productLead") }}</p>

      <div class="base-product-images">
        <figure v-for="src in productImages" :key="src" class="base-product-image">
          <img :src="src" :alt="t('baseV2.productImages')" loading="lazy" />
        </figure>
      </div>

      <article class="base-product-info">
        <h3>{{ t("baseV2.productInfo") }}</h3>
        <dl class="base-product-details">
          <div v-for="row in productRows" :key="row.label" class="base-product-detail">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </article>
    </section>

    <section class="base-product-qualifications">
      <h2 class="base-product-title">{{ t("baseV2.productQualify") }}</h2>
      <div ref="qualifyGalleryRef" class="base-qualification-grid">
        <a
          v-for="(src, i) in qualifyImages"
          :key="src"
          class="base-qualification-image"
          :href="src"
          data-fancybox="base-qualifications"
          :data-caption="`${t('baseV2.productQualify')} ${i + 1}`"
        >
          <img :src="src" :alt="`${t('baseV2.productQualify')} ${i + 1}`" loading="lazy" />
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js"
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import { productImages, productRows, qualifyImages } from "@/data/traceProduct"

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
.base-product-intro,
.base-product-qualifications {
  margin-top: 44px;
  padding-top: 44px;
  border-top: 1px solid rgba(60, 50, 28, 0.1);
}

.base-product-title {
  margin: 0 0 16px;
  color: #3c321c;
  font-family: "LinHai", "Microsoft YaHei", var(--font-zh);
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
}

.base-product-lead {
  margin: 0 0 24px;
  color: rgba(60, 50, 28, 0.74);
  font-size: 16px;
  line-height: 1.95;
}

.base-product-images {
  display: grid;
  gap: 20px;
  width: 100%;
  margin-bottom: 24px;
}

.base-product-image {
  width: 100%;
  margin: 0;
  overflow: hidden;
  border-radius: 10px;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.base-product-info {
  padding: 28px;
  border: 1px solid rgba(60, 50, 28, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);

  h3 {
    margin: 0 0 12px;
    color: #6e5435;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.6;
  }
}

.base-product-details {
  margin: 0;
}

.base-product-detail {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 24px;
  padding: 14px 0;
  border-top: 1px solid rgba(60, 50, 28, 0.08);
  font-size: 15px;
  line-height: 1.7;

  dt {
    color: rgba(60, 50, 28, 0.55);
  }

  dd {
    margin: 0;
    color: rgba(60, 50, 28, 0.82);
    overflow-wrap: anywhere;
  }

  &:last-child {
    padding-bottom: 0;
  }
}

.base-qualification-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.base-qualification-image {
  display: block;
  min-width: 0;
  padding: 12px;
  overflow: hidden;
  border: 1px solid rgba(60, 50, 28, 0.08);
  border-radius: 8px;
  background: #fff;
  aspect-ratio: 3 / 4;
  cursor: zoom-in;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

@media (max-width: 768px) {
  .base-product-intro,
  .base-product-qualifications {
    margin-top: 32px;
    padding-top: 32px;
  }

  .base-product-title {
    margin-bottom: 12px;
    font-size: 23px;
  }

  .base-product-lead {
    margin-bottom: 20px;
    font-size: 15px;
    line-height: 1.85;
  }

  .base-product-images {
    gap: 16px;
    margin-bottom: 20px;
  }

  .base-product-image {
    border-radius: 8px;
  }

  .base-product-info {
    padding: 20px 16px;

    h3 {
      font-size: 17px;
    }
  }

  .base-product-detail {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
    padding: 12px 0;
    font-size: 14px;
  }

  .base-qualification-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 20px;
  }

  .base-qualification-image {
    padding: 8px;
  }
}
</style>
