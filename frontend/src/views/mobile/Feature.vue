<template>
  <div class="feature" :key="featKey">
    <div class="feature-left">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        :loop="true"
        :pagination="paginationOptions"
        :navigation="navigationOptions"
        :autoplay="autoplayOptions"
        :effect="'fade'"
      >
        <swiper-slide v-for="(item, index) in featureObj.img" :key="index">
          <div class="feature-left-img">
            <img :src="item" alt="" />
          </div>
        </swiper-slide>
        <!-- 添加导航按钮 -->
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </swiper>
    </div>
    <div class="feature-right">
      <div class="feature-right-box">
        <h2 class="feature-right-box-title">{{ featureObj.title }}</h2>
        <p class="feature-right-box-text">{{ featureObj.text1 }}</p>
        <p class="feature-right-box-text">{{ featureObj.text2 }}</p>
        <p class="feature-right-box-text" v-if="featureObj.text3">{{ featureObj.text3 }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
// 导入 Swiper Vue.js 组件
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules"
import featureImg1 from "@/assets/img/feature-img1.jpg"
import featureImg2 from "@/assets/img/feature-img2.jpg"
import featureImg3 from "@/assets/img/feature-img3.jpg"
import featureImg4 from "@/assets/img/feature-img4.jpg"
import featureImg5 from "@/assets/img/feature-img5.jpg"
import featureImg6 from "@/assets/img/feature-img6.jpg"
import featureImg7 from "@/assets/img/feature-img7.jpg"
import featureImg8 from "@/assets/img/feature-img8.jpg"
import featureImg9 from "@/assets/img/feature-img9.jpg"
import featureImg10 from "@/assets/img/feature-img10.jpg"
import featureImg11 from "@/assets/img/feature-img11.jpg"

const { t, locale } = useI18n()
const route = useRoute()
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

// 导航配置
const navigationOptions = {
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev"
} as any

const activeIndex = ref(0)
const featureList = computed(() => [
  {
    title: t("feature.item1"),
    text1: t("feature.item2"),
    text2: t("feature.item3"),
    img: [featureImg1, featureImg2, featureImg3]
  },
  {
    title: t("feature.item4"),
    text1: t("feature.item5"),
    text2: t("feature.item6"),
    text3: t("feature.item13"),
    img: [featureImg4, featureImg5]
  },
  {
    title: t("feature.item7"),
    text1: t("feature.item8"),
    text2: t("feature.item9"),
    img: [featureImg6, featureImg7, featureImg8]
  },
  {
    title: t("feature.item10"),
    text1: t("feature.item11"),
    text2: t("feature.item12"),
    img: [featureImg9, featureImg10, featureImg11]
  }
])
const featureObj = computed(() => {
  return featureList.value[activeIndex.value]
})
const featKey = ref(Date.now())

// 监听 locale 变化
watch(locale, async () => {
  // 更新 key 强制重新渲染组件
  featKey.value = Date.now()

  // 如果需要，这里可以重新获取路由参数
  const type = route.query.type || "0"
  activeIndex.value = Number(type)

  // 等待 DOM 更新
  await nextTick()
})

onMounted(() => {
  const type = route.query.type || "0"
  activeIndex.value = Number(type)
})
</script>
<style lang="scss" scoped>
.feature {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 240px);
  overflow: hidden;
  padding-top: 50px;
  &-left {
    width: 100%;
    &-img {
      width: 100%;
      img {
        width: 100%;
        display: block;
      }
    }
  }
  &-right {
    width: 100%;
    &-box {
      padding: 40px 37px;
      &-title {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 25px;
        text-align: center;
      }
      &-text {
        font-size: 14px;
        margin-bottom: 16px;
        text-align: justify;
        line-height: 1.5;
        &.text1 {
          font-weight: 500;
        }
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
::v-deep .swiper {
  .swiper-pagination {
    display: none !important;
  }
  .swiper-navigation-icon {
    display: none !important;
  }
}
.swiper-button-next {
  width: 42px;
  height: 42px;
  background: url("@/assets/img/right-icon.svg") no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}
.swiper-button-prev {
  width: 42px;
  height: 42px;
  background: url("@/assets/img/left-icon.svg") no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}
</style>
