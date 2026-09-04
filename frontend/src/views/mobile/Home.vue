<template>
  <div class="home">
    <div class="banner">
      <img
        class="banner-poster"
        :class="{ 'is-ready': videoReady }"
        src="@/assets/img/home-banner.jpg"
        :alt="t('homeV2.heroTitle')"
      />
      <swiper
        v-if="videoReady"
        class="banner-swiper"
        :modules="modules"
        :slides-per-view="1"
        :loop="true"
        :pagination="paginationOptions"
        :autoplay="autoplayOptions"
        :effect="'fade'"
      >
        <swiper-slide v-for="(item, index) in videoList" :key="index">
          <video class="video" :src="item" autoplay muted loop playsinline preload="metadata"></video>
        </swiper-slide>
      </swiper>
      <div class="hero-overlay">
        <h1 class="hero-title">{{ t("homeV2.heroTitle") }}</h1>
        <p class="hero-lead">{{ t("homeV2.heroLead") }}</p>
        <div class="hero-actions">
          <button type="button" class="hero-btn" @click="goStore">{{ t("homeV2.ctaStores") }}</button>
          <a class="hero-btn outline" href="mailto:tty12138@foxmail.com">{{ t("homeV2.ctaEmail") }}</a>
        </div>
      </div>
    </div>
    <div class="stats-bar">{{ t("homeV2.stats") }}</div>

    <div class="ppjs">
      <div class="ppjs-title">
        <div class="ppjs-title-h1">{{ t("homeV2.servicesTitle") }}</div>
      </div>
      <div class="ppjs-list">
        <div class="ppjs-list-item" @click="goFeature(index)" v-for="(item, index) in prodList" :key="index">
          <div class="item-img"><img :src="item.img" :alt="t(item.titleKey)" /></div>
          <div class="item-name">{{ item.name }}</div>
          <div class="item-text">{{ item.text }}</div>
        </div>
      </div>
      <p class="more-traditional">{{ t("homeV2.moreTraditional") }}</p>
    </div>

    <section class="pillars">
      <h2 class="section-h2">{{ t("homeV2.pillarsTitle") }}</h2>
      <article v-for="n in 3" :key="n" class="pillar-card">
        <h3>{{ t(`homeV2.pillar${n}Title`) }}</h3>
        <p>{{ t(`homeV2.pillar${n}Text`) }}</p>
      </article>
    </section>

    <div class="zdfw">
      <div class="zdfw-title">{{ t("nav.base") }}</div>
      <div class="zdfw-content">
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic8.jpg" :alt="t('homeV2.baseTeaser')" />
        </div>
        <div class="zdfw-content-info">
          <div class="info-text">{{ t("homeV2.baseTeaser") }}</div>
          <div class="info-btn" @click="goBase">{{ t("homeV2.ctaBase") }}</div>
        </div>
      </div>
    </div>

    <div class="zdfw">
      <div class="zdfw-title">{{ t("homeV2.storesTitle") }}</div>
      <p class="stores-sub">{{ t("homeV2.storesSub") }}</p>
      <div class="home-store-grid">
        <article
          v-for="store in storePreview"
          :key="store.slug"
          class="home-store-card"
          @click="goStoreDetail(store.slug)"
        >
          <img :src="store.image" :alt="store.name" />
          <div class="home-store-body">
            <h3>{{ store.name }}</h3>
            <p>{{ store.tagline }}</p>
          </div>
        </article>
      </div>
      <div class="info-btn" @click="goStore">{{ t("homeV2.ctaStores") }}</div>
    </div>

    <div class="honor-bar">{{ t("homeV2.honor") }}</div>

    <div class="zdfw">
      <div class="zdfw-title">
        <img src="@/assets/img/htn-text.png" alt="Hetuonian" />
      </div>
      <div class="zdfw-content">
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic10.jpg" alt="Hetuonian" />
        </div>
        <div class="zdfw-content-info">
          <div class="info-text">{{ t("homeV2.htn") }}</div>
        </div>
      </div>
    </div>

    <section class="feed-section">
      <div class="feed-head">
        <h2>{{ t("homeV2.latestNews") }}</h2>
        <router-link to="/news">{{ t("homeV2.viewMore") }}</router-link>
      </div>
      <article v-for="item in newsPreview" :key="item.id" class="feed-item" @click="goNews(item.id)">
        <h3>{{ item.article_title }}</h3>
        <time>{{ formatDate(item.datetime || item.createtime) }}</time>
      </article>

      <div class="feed-head mt">
        <h2>{{ t("homeV2.latestReviews") }}</h2>
        <router-link to="/reviews">{{ t("homeV2.viewMore") }}</router-link>
      </div>
      <article v-for="item in reviewPreview" :key="item.id" class="feed-item">
        <h3>{{ item.name || t("reviews.anonymous") }}</h3>
        <p>{{ item.content }}</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import { getHomeBanner, getArticleList, getFeedbackList } from "@/api"
import { services as serviceList } from "@/config/services"
import { useStoreList } from "@/composables/useStores"
import { rewriteMediaList } from "@/utils/mediaCdn"
import { usePageSeo } from "@/composables/usePageSeo"
import homePic2 from "@/assets/img/home-pic2.jpg"
import homePic3 from "@/assets/img/home-pic3.jpg"
import homePic4 from "@/assets/img/home-pic4.jpg"
import homePic5 from "@/assets/img/home-pic5.jpg"

const { t, locale } = useI18n()
usePageSeo({ titleKey: "seo.home.title", descriptionKey: "seo.home.description", h1Key: "homeV2.heroTitle" })
const router = useRouter()
const modules = [Autoplay, Pagination, EffectFade]
const paginationOptions = { clickable: true } as any
const autoplayOptions = { delay: 4000, disableOnInteraction: false } as any

const homeServiceCards = [
  { slug: "moxibustion", img: homePic5 },
  { slug: "tuina", img: homePic2 },
  { slug: "spa", img: homePic4 },
  { slug: "foot", img: homePic3 }
]

const { stores: storePreview } = useStoreList()

const prodList = computed(() =>
  homeServiceCards.map((card) => {
    const svc = serviceList.find((s) => s.slug === card.slug)!
    return {
      img: card.img,
      titleKey: svc.nameKey,
      name: t(svc.nameKey),
      text: t(svc.summaryKey)
    }
  })
)

const videoList = ref<string[]>([])
const videoReady = ref(false)
const newsPreview = ref<any[]>([])
const reviewPreview = ref<any[]>([])

const formatDate = (value: string | number) => {
  if (!value) return ""
  if (typeof value === "number" || /^\d+$/.test(String(value))) {
    const d = new Date(Number(value) * (String(value).length === 10 ? 1000 : 1))
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  return String(value).slice(0, 10)
}

watch(locale, () => getBanner())

const goBase = () => router.push({ path: "/base" })
const goStore = () => router.push({ path: "/stores" })
const goStoreDetail = (slug: string) => router.push(`/stores/${slug}`)
const goFeature = (index: number) => {
  const slug = homeServiceCards[index]?.slug || "moxibustion"
  router.push({ path: `/services/${slug}` })
}
const goNews = (id: number) => router.push(`/news/${id}`)

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

const loadFeed = () => {
  getArticleList({ project_id: -1, page: 1, limit: 3 }).then((res: any) => {
    if (res.code == 1) newsPreview.value = res.data?.data || []
  })
  getFeedbackList({ page: 1, limit: 3 }).then((res: any) => {
    reviewPreview.value = res?.data?.list || []
  })
}

onMounted(() => {
  getBanner()
  loadFeed()
})
</script>

<style scoped lang="scss">
.home {
  background: rgba(255, 252, 250, 1);
  margin-top: 52px;
}
.banner {
  position: relative;
  height: calc(100vh - 52px);
  overflow: hidden;
  background: #1a1610;
  .banner-poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    z-index: 0;
    transition: opacity 0.6s ease;
    &.is-ready {
      opacity: 0;
      pointer-events: none;
    }
  }
  .banner-swiper {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  :deep(.swiper),
  :deep(.swiper-wrapper),
  :deep(.swiper-slide) {
    width: 100%;
    height: 100%;
  }
  .video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    text-align: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.1));
    pointer-events: none;
    .hero-actions {
      pointer-events: auto;
    }
  }
  .hero-title {
    margin: 0 0 10px;
    color: #fff;
    font-size: 22px;
    font-family: "LinHai";
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .hero-lead {
    margin: 0 0 16px;
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    line-height: 1.6;
  }
  .hero-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hero-btn {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid #fff;
    background: rgba(60, 50, 28, 0.85);
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    appearance: none;
    &.outline {
      background: rgba(255, 255, 255, 0.12);
    }
  }
}
.stats-bar {
  text-align: center;
  padding: 12px 10px;
  background: rgba(60, 50, 28, 0.92);
  color: #fff;
  font-size: 11px;
  line-height: 1.5;
}
.section-h2 {
  text-align: center;
  font-size: 20px;
  margin: 24px 0 12px;
  color: rgba(60, 50, 28, 1);
}
.pillars {
  padding: 0 15px;
}
.pillar-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  h3 {
    margin: 0 0 6px;
    font-size: 14px;
    color: rgba(122, 86, 54, 1);
  }
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: rgba(60, 50, 28, 0.75);
  }
}
.ppjs {
  padding: 15px;
  &-title-h1 {
    color: rgba(60, 50, 28, 1);
    font-size: 20px;
    text-align: center;
    margin-bottom: 12px;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
      width: 48%;
      margin-bottom: 12px;
      .item-img img {
        width: 100%;
        display: block;
      }
      .item-name {
        font-size: 12px;
        font-weight: 500;
        color: rgba(122, 86, 54, 1);
        text-align: center;
        padding: 6px 4px 2px;
      }
      .item-text {
        font-size: 11px;
        line-height: 1.5;
        text-align: center;
        padding: 0 4px 8px;
      }
    }
  }
}
.more-traditional {
  font-size: 11px;
  line-height: 1.6;
  text-align: center;
  padding: 0 15px 15px;
  color: rgba(60, 50, 28, 0.75);
}
.zdfw {
  padding: 0 15px 15px;
  &-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 10px;
    img {
      width: 95px;
      display: block;
      margin: 0 auto;
    }
  }
  &-content-img img {
    width: 100%;
    display: block;
  }
  .info-text {
    font-size: 12px;
    line-height: 1.6;
    text-align: center;
    padding: 12px;
  }
  .info-btn {
    padding: 10px 20px;
    border: 1px solid rgba(60, 50, 28, 0.3);
    border-radius: 6px;
    font-size: 13px;
    text-align: center;
    margin: 12px auto;
    display: block;
    width: fit-content;
  }
}
.stores-sub {
  text-align: center;
  line-height: 1.7;
  color: rgba(60, 50, 28, 0.78);
  margin: 8px 15px 16px;
  font-size: 12px;
}
.home-store-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0 15px;
  margin-bottom: 8px;
}
.home-store-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(60, 50, 28, 0.06);
  img {
    width: 100%;
    height: 88px;
    object-fit: cover;
    display: block;
  }
  h3 {
    margin: 0 0 4px;
    font-size: 13px;
    font-family: "LinHai";
    color: rgba(60, 50, 28, 1);
  }
  p {
    margin: 0;
    font-size: 11px;
    line-height: 1.4;
    color: rgba(122, 86, 54, 1);
  }
}
.home-store-body {
  padding: 8px 10px 10px;
}
.honor-bar {
  text-align: center;
  padding: 14px 12px;
  background: rgba(194, 153, 116, 0.15);
  font-size: 12px;
  line-height: 1.5;
  margin: 12px 0;
}
.feed-section {
  padding: 0 15px 40px;
}
.feed-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
  &.mt {
    margin-top: 24px;
  }
  h2 {
    margin: 0;
    font-size: 18px;
  }
  a {
    font-size: 12px;
    color: rgba(122, 86, 54, 1);
    text-decoration: none;
  }
}
.feed-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(60, 50, 28, 0.1);
  h3 {
    margin: 0 0 4px;
    font-size: 14px;
  }
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(60, 50, 28, 0.7);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  time {
    font-size: 11px;
    color: rgba(60, 50, 28, 0.45);
  }
}
</style>
