<template>
  <section class="site-page-banner" :aria-label="t(banner.titleKey)">
    <picture class="site-page-banner__media">
      <source media="(max-width: 768px)" :srcset="banner.mobileImage" />
      <img :src="banner.image" alt="" width="2560" height="466" fetchpriority="high" decoding="async" />
    </picture>
    <h1 class="site-page-banner__title">{{ t(banner.titleKey) }}</h1>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { pageBanners, type PageBannerKey } from "@/config/pageBanners"

const props = defineProps<{ page: PageBannerKey }>()
const { t } = useI18n()
const banner = computed(() => pageBanners[props.page])
</script>

<style scoped>
.site-page-banner {
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
  width: 100%;
  height: clamp(220px, 18.2vw, 420px);
  overflow: hidden;
  background: #3c3022;
}

.site-page-banner__media,
.site-page-banner::after {
  position: absolute;
  inset: 0;
}

.site-page-banner__media {
  z-index: -2;
}

.site-page-banner__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-page-banner::after {
  z-index: -1;
  content: "";
  background: rgba(21, 15, 10, 0.46);
  pointer-events: none;
}

.site-page-banner__title {
  margin: 0;
  padding: 0 24px;
  color: #fff;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: clamp(30px, 2.5vw, 40px);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.08em;
  text-align: center;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .site-page-banner {
    height: 180px;
  }

  .site-page-banner__title {
    padding: 0 20px;
    font-size: 24px;
    letter-spacing: 0.06em;
  }
}
</style>
