<template>
  <div class="feature" :key="featKey">
    <div class="feature-left">
      <div class="feature-left-img" v-for="item in featureObj.img" :key="item">
        <img :src="item" alt="" />
      </div>
    </div>
    <div class="feature-right" :class="!headerVisible ? 'fixed' : ''">
      <div class="feature-right-box">
        <h2 class="feature-right-box-title">{{ featureObj.title }}</h2>
        <p class="feature-right-box-text text1">{{ featureObj.text1 }}</p>
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

const activeIndex = ref(0)
const headerVisible = ref(true)
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

const handleScroll = () => {
  const currentScrollY = window.scrollY
  // 向下滚动隐藏，向上滚动显示
  // if (currentScrollY > lastScrollY.value && currentScrollY > 200) {
  if (currentScrollY > 100) {
    // 向下滚动且超过100px时隐藏header
    headerVisible.value = false
  } else {
    // 向上滚动或回到顶部时显示header
    headerVisible.value = true
  }
}

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
  window.addEventListener("scroll", handleScroll)
})
</script>
<style lang="scss" scoped>
.feature {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  overflow-y: scroll;
  padding-top: 88px;
  &-left {
    width: 50%;
    &-img {
      width: 100%;
      margin-bottom: 20px;
      img {
        width: 100%;
        display: block;
      }
    }
  }
  &-right {
    width: 50%;
    &.fixed {
      position: fixed;
      top: -40px;
      left: 50%;
    }
    &-box {
      padding: 80px 80px 0 60px;
      &-title {
        font-size: 28px;
        font-weight: 500;
        margin-bottom: 20px;
      }
      &-text {
        font-size: 16px;
        margin-bottom: 16px;
        text-align: justify;
        line-height: 24px;
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
</style>
