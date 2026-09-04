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
        :space-between="0"
        :loop="true"
        :pagination="paginationOptions"
        :navigation="navigation"
        :autoplay="autoplayOptions"
        :effect="'fade'"
      >
        <swiper-slide v-for="(item, index) in videoList" :key="index">
          <video
            class="video"
            :src="item"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
          ></video>
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

    <div class="ppjs" style="max-width: 1407px; padding: 0 25px">
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

    <section class="pillars" style="max-width: 1407px; padding: 0 25px">
      <h2 class="section-h2">{{ t("homeV2.pillarsTitle") }}</h2>
      <div class="pillars-grid">
        <article v-for="n in 3" :key="n" class="pillar-card">
          <h3>{{ t(`homeV2.pillar${n}Title`) }}</h3>
          <p>{{ t(`homeV2.pillar${n}Text`) }}</p>
        </article>
      </div>
    </section>

    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
      <div class="zdfw-content">
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic8.jpg" :alt="t('homeV2.baseTeaser')" />
        </div>
        <div class="zdfw-content-info">
          <div class="info-title">{{ t("nav.base") }}</div>
          <div class="info-text">{{ t("homeV2.baseTeaser") }}</div>
          <div class="info-btn" @click="goBase">{{ t("homeV2.ctaBase") }}</div>
        </div>
      </div>
    </div>

    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
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
      <div class="stores-cta">
        <button type="button" class="info-btn" @click="goStore">{{ t("homeV2.ctaStores") }}</button>
      </div>
    </div>

    <div class="honor-bar">{{ t("homeV2.honor") }}</div>

    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
      <div class="zdfw-title">
        <img src="@/assets/img/htn-logo.svg" alt="Hetuonian" />
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

    <section class="feed-section" style="max-width: 1407px; padding: 0 25px">
      <div class="feed-col">
        <div class="feed-head">
          <h2>{{ t("homeV2.latestNews") }}</h2>
          <router-link to="/news">{{ t("homeV2.viewMore") }}</router-link>
        </div>
        <article v-for="item in newsPreview" :key="item.id" class="feed-item" @click="goNews(item.id)">
          <h3>{{ item.article_title }}</h3>
          <time>{{ formatDate(item.datetime || item.createtime) }}</time>
        </article>
        <p v-if="!newsPreview.length" class="feed-empty">—</p>
      </div>
      <div class="feed-col">
        <div class="feed-head">
          <h2>{{ t("homeV2.latestReviews") }}</h2>
          <router-link to="/reviews">{{ t("homeV2.viewMore") }}</router-link>
        </div>
        <article v-for="item in reviewPreview" :key="item.id" class="feed-item">
          <h3>{{ item.name || t("reviews.anonymous") }}</h3>
          <p>{{ item.content }}</p>
        </article>
        <p v-if="!reviewPreview.length" class="feed-empty">—</p>
      </div>
    </section>
    <img class="left-icon" src="@/assets/img/left-icon.png" alt="" role="presentation" />
    <img class="right-icon" src="@/assets/img/right-icon.png" alt="" role="presentation" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
// 导入 Swiper Vue.js 组件
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules"

import { getHomeBanner, getArticleList, getFeedbackList } from "@/api"
import { services as serviceList } from "@/config/services"
import { useStoreList } from "@/composables/useStores"
import { rewriteMediaList } from "@/utils/mediaCdn"
import homePic2 from "@/assets/img/home-pic2.jpg"
import homePic3 from "@/assets/img/home-pic3.jpg"
import homePic4 from "@/assets/img/home-pic4.jpg"
import homePic5 from "@/assets/img/home-pic5.jpg"

import { usePageSeo } from "@/composables/usePageSeo"

const { t, locale } = useI18n()
usePageSeo({ titleKey: "seo.home.title", descriptionKey: "seo.home.description", h1Key: "homeV2.heroTitle" })
const router = useRouter()
// Swiper 模块
const modules = [Autoplay, Pagination, Navigation, EffectFade]

// 直接使用对象字面量，让 TypeScript 自动推断类型
const paginationOptions = {
  clickable: true
} as any

const autoplayOptions = {
  delay: 4000,
  disableOnInteraction: false
} as any

const navigation = false as any

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

const shopOneList = ref(t("home.item16").split(","))
const shopTwoList = ref(t("home.item17").split(","))
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

const loadFeed = () => {
  getArticleList({ project_id: -1, page: 1, limit: 3 }).then((res: any) => {
    if (res.code == 1) newsPreview.value = res.data?.data || []
  })
  getFeedbackList({ page: 1, limit: 3 }).then((res: any) => {
    reviewPreview.value = res?.data?.list || []
  })
}

const goNews = (id: number) => router.push(`/news/${id}`)

// 监听 locale 变化
watch(locale, (newLocale, oldLocale) => {
  console.log(`语言从 ${oldLocale} 切换到 ${newLocale}`)
  getBanner()
})

const goServe = () => {
  router.push({
    path: "/serve"
  })
}

const goBase = () => {
  router.push({
    path: "/base"
  })
}

const goStore = () => router.push({ path: "/stores" })
const goStoreDetail = (slug: string) => router.push(`/stores/${slug}`)

const goShop = () => router.push({ path: "/shop" })

const goFeature = (index: number) => {
  const slug = homeServiceCards[index]?.slug || "moxibustion"
  router.push({ path: `/services/${slug}` })
}

const getBanner = () => {
  // 可以在这里调用获取首页banner的接口
  getHomeBanner().then((res: any) => {
    console.log("首页banner数据：", res)
    if (res.code == 1) {
      let array = res.data.data
      videoList.value = rewriteMediaList(
        array.map((item: any) => {
          if (locale.value === "en") return item.image_en
          if (locale.value === "jp") return item.image_jp
          return item.image
        })
      )
      videoReady.value = videoList.value.length > 0
    }
  })
}

onMounted(() => {
  getBanner()
  loadFeed()
})
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  overflow: hidden;
  background: rgba(255, 252, 250, 1);
  position: relative;
  margin-top: 88px;
}
.banner {
  width: 100%;
  height: calc(100vh - 88px);
  max-height: 100vh;
  overflow: hidden;
  position: relative;
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
    padding: 0 24px;
    text-align: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.1));
    pointer-events: none;
    .hero-actions {
      pointer-events: auto;
    }
  }
  .hero-title {
    margin: 0 0 16px;
    color: #fff;
    font-size: 40px;
    font-family: "LinHai";
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }
  .hero-lead {
    max-width: 720px;
    margin: 0 0 24px;
    color: rgba(255, 255, 255, 0.92);
    line-height: 1.8;
  }
  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hero-btn {
    padding: 10px 24px;
    border-radius: 999px;
    border: 1px solid #fff;
    background: rgba(60, 50, 28, 0.85);
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    font-family: "LinHai";
    font-size: 16px;
    line-height: 1.4;
    appearance: none;
    &.outline {
      background: rgba(255, 255, 255, 0.12);
    }
  }
}
.stats-bar {
  text-align: center;
  padding: 18px 16px;
  background: rgba(60, 50, 28, 0.92);
  color: #fff;
  font-family: "LinHai";
  letter-spacing: 0.05em;
}
.section-h2 {
  text-align: center;
  font-family: "LinHai";
  font-size: 32px;
  color: rgba(60, 50, 28, 1);
  margin: 70px 0 40px;
}
.pillars {
  margin: 0 auto 40px;
  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
.pillar-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  h3 {
    margin: 0 0 12px;
    font-size: 20px;
    color: rgba(122, 86, 54, 1);
  }
  p {
    margin: 0;
    line-height: 1.75;
    font-size: 15px;
    color: rgba(60, 50, 28, 0.75);
  }
}
.stores-sub {
  text-align: center;
  line-height: 1.8;
  color: rgba(60, 50, 28, 0.78);
  margin: 12px auto 24px;
  max-width: 900px;
}
.home-store-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}
.home-store-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }
  h3 {
    margin: 0 0 6px;
    font-size: 16px;
    font-family: "LinHai";
    color: rgba(60, 50, 28, 1);
  }
  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(122, 86, 54, 1);
  }
}
.home-store-body {
  padding: 12px 14px 14px;
}
.stores-cta {
  text-align: center;
  margin: 24px 0 0;
  .info-btn {
    display: inline-block;
    min-width: 120px;
    padding: 12px 24px;
    border: 1px solid rgba(60, 50, 28, 0.3);
    border-radius: 6px;
    background: #fff;
    color: rgba(60, 50, 28, 1);
    font-size: 16px;
    font-family: inherit;
    line-height: 28px;
    letter-spacing: 0;
    cursor: pointer;
    appearance: none;
    transition: all 0.3s ease;
    &:hover {
      background: rgba(60, 50, 28, 0.05);
      border-color: rgba(60, 50, 28, 0.6);
    }
  }
}
.honor-bar {
  text-align: center;
  padding: 20px 16px;
  background: rgba(194, 153, 116, 0.15);
  color: rgba(60, 50, 28, 0.85);
  font-size: 15px;
  margin: 40px 0;
}
.feed-section {
  margin: 0 auto 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
.feed-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  h2 {
    margin: 0;
    font-family: "LinHai";
    font-size: 24px;
    color: rgba(60, 50, 28, 1);
  }
  a {
    color: rgba(122, 86, 54, 1);
    text-decoration: none;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.feed-item {
  padding: 16px 0;
  border-bottom: 1px solid rgba(60, 50, 28, 0.1);
  cursor: pointer;
  h3 {
    margin: 0 0 6px;
    font-size: 16px;
    color: rgba(60, 50, 28, 1);
  }
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(60, 50, 28, 0.7);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  time {
    font-size: 13px;
    color: rgba(60, 50, 28, 0.45);
  }
}
.feed-empty {
  color: rgba(60, 50, 28, 0.4);
  text-align: center;
  padding: 24px 0;
}
.ppjs {
  margin: 70px auto;
  position: relative;
  z-index: 5;
  &-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    &-h1 {
      color: rgba(60, 50, 28, 1);
      font-size: 32px;
      font-weight: 400;
      line-height: 38px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-p {
      color: rgba(60, 50, 28, 1);
      font-size: 15px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 1px;
      text-align: center;
      margin-top: 40px;
    }
  }
  &-content {
    margin-top: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-img {
      width: 50%;
      img {
        display: block;
        width: 100%;
      }
    }
    &-info {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      // border: 1px solid rgba(205, 175, 148, 1);
      .info-title {
        width: 75%;
        color: rgba(60, 50, 28, 1);
        font-size: 28px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0px;
        text-align: center;
      }
      .info-text {
        width: 75%;
        margin-top: 30px;
        color: rgba(60, 50, 28, 1);
        font-size: 15px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: -1px;
        text-align: center;
      }
      .info-btn {
        min-width: 120px;
        padding: 12px 24px;
        border: 1px solid rgba(60, 50, 28, 0.3);
        border-radius: 6px;
        background: rgba(255, 255, 255, 1);
        color: rgba(60, 50, 28, 1);
        font-size: 16px;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0px;
        text-align: center;
        margin: 30px auto 0;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          background: rgba(60, 50, 28, 0.05);
          border-color: rgba(60, 50, 28, 0.6);
        }
      }
    }
  }
  &-list {
    margin-top: 100px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    &-item {
      width: 23.45%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .item-img {
        width: 100%;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
        &:hover {
          overflow: hidden;
          img {
            transform: scale(1.2);
            transition: all 0.5s ease-in-out;
          }
        }
      }
      .item-name {
        color: rgba(122, 86, 54, 1);
        font-size: 18px;
        font-weight: 500;
        text-align: center;
        margin-top: 16px;
      }
      .item-text {
        color: rgba(60, 50, 28, 1);
        font-size: 14px;
        font-weight: 400;
        line-height: 1.6;
        letter-spacing: 0;
        text-align: center;
        margin-top: 10px;
        padding: 0 8px;
      }
    }
  }
}
.more-traditional {
  text-align: center;
  margin-top: 32px;
  line-height: 1.8;
  color: rgba(60, 50, 28, 0.75);
  font-size: 15px;
}
.zdfw {
  margin: 0 auto 70px;
  position: relative;
  z-index: 5;
  &-title {
    width: 100%;
    color: rgba(60, 50, 28, 1);
    font-size: 32px;
    font-weight: 400;
    line-height: 38px;
    letter-spacing: 0px;
    text-align: center;
    img {
      width: 191px;
      display: block;
      margin: 0 auto;
    }
  }
  &-content {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-img {
      width: 50%;
      img {
        display: block;
        width: 100%;
      }
    }
    &-info {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .info-title {
        width: 80%;
        color: rgba(60, 50, 28, 1);
        font-size: 28px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0px;
        text-align: center;
      }
      .info-text {
        width: 75%;
        margin-top: 50px;
        color: rgba(60, 50, 28, 1);
        font-size: 15px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0px;
        text-align: center;
      }
      .info-btn {
        padding: 12px 32px;
        border: 1px solid rgba(60, 50, 28, 0.3);
        border-radius: 6px;
        background: rgba(255, 255, 255, 1);
        color: rgba(60, 50, 28, 1);
        font-size: 15px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0px;
        text-align: center;
        margin: 50px auto 0;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          background: rgba(60, 50, 28, 0.05);
          border-color: rgba(60, 50, 28, 0.6);
        }
      }
    }
  }
}
.dpzx {
  margin: 0 auto 70px;
  &-title {
    color: rgba(60, 50, 28, 1);
    font-size: 32px;
    font-weight: 400;
    line-height: 38px;
    letter-spacing: 0px;
    text-align: center;
  }
  &-content {
    margin-top: 70px;
    display: flex;
    justify-content: space-between;
    &-info {
      margin-top: 2%;
      width: 53%;
      .info-title {
        color: rgba(60, 50, 28, 1);
        font-size: 28px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0px;
        text-align: left;
      }
      .info-ul {
        margin-top: 51px;
        display: flex;
        justify-content: flex-start;
        &-left {
          width: 50%;
        }
        &-item {
          margin-bottom: 30px;
          color: rgba(60, 50, 28, 1);
          font-size: 15px;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: 0px;
          text-align: left;
        }
        &-btn {
          display: inline-flex;
          margin-top: -10px;
          padding: 10px 12px;
          border: 1px solid rgba(194, 153, 116, 1);
          background: rgba(255, 255, 255, 1);
          color: rgba(194, 153, 116, 1);
          font-size: 15px;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: 0px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
    &-img {
      width: 47%;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.left-icon {
  position: absolute;
  top: 1253px;
  left: -132px;
  width: 363px;
  height: 363px;
  display: block;
  z-index: 1;
}
.right-icon {
  position: absolute;
  width: 550px;
  height: 304px;
  display: block;
  right: -49px;
  top: 2469px;
  z-index: 1;
}
</style>
