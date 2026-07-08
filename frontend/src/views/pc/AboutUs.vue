<template>
  <div class="about-us">
    <div class="about-banner">
      <swiper
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
          <video class="video" :src="item" autoplay muted loop preload="auto" poster="@/assets/img/home-banner.jpg"></video>
        </swiper-slide>
      </swiper>
      <!-- <video class="video" :src="videoSrc" autoplay muted loop preload="auto" poster="@/assets/img/home-banner.jpg"></video> -->
    </div>
    <div class="about-box" style="max-width: 60%; margin: 0 auto">
      <div class="about-title">{{ t("about.item1") }}</div>
      <div class="about-subtit">{{ t("about.item13") }}</div>
      <div class="about-subtext">{{ t("about.item14") }}</div>
      <div class="about-subtext">{{ t("about.item15") }}</div>
      <div class="about-subtext" style="margin-bottom: 50px">{{ t("about.item16") }}</div>

      <!-- <div class="about-info">
        <div class="info-item" v-for="(item, index) in aboutList" :key="index">
          <div class="info-item-year">{{ item.year }}</div>
          <div class="info-item-box">
            <div class="box-info">
              <div class="box-info-title">{{ item.title }}</div>
              <div class="box-info-text">{{ item.text }}</div>
            </div>
            <div class="box-img">
              <img :src="item.src" alt="" />
            </div>
          </div>
        </div>
      </div> -->
      <div class="about-subtit">{{ t("about.item8") }}</div>
      <div class="about-subtext">{{ t("about.item9") }}</div>
      <div class="about-subtext">{{ t("about.item10") }}</div>
      <div class="about-subtext">{{ t("about.item11") }}</div>
      <div class="about-people">
        <img src="@/assets/img/signature-icon.png" alt="" />
        <div class="about-date">{{ t("about.item12") }}</div>
      </div>
    </div>
    <img class="left-icon" src="@/assets/img/left-icon.png" alt="" />
    <img class="right-icon" src="@/assets/img/right-icon.png" alt="" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import { useI18n } from "vue-i18n"
// 导入 Swiper Vue.js 组件
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules"

import { getHomeBanner } from "@/api"
import aboutPic1 from "@/assets/img/about-pic1.png"
import aboutPic2 from "@/assets/img/about-pic2.png"
import aboutPic3 from "@/assets/img/about-pic3.png"

const { t, locale } = useI18n()
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

const aboutList = computed(() => [
  {
    year: "2009",
    title: t("about.item2"),
    text: t("about.item3"),
    src: aboutPic1
  },
  {
    year: "2017",
    title: t("about.item4"),
    text: t("about.item5"),
    src: aboutPic2
  },
  {
    year: "2022",
    title: t("about.item6"),
    text: t("about.item7"),
    src: aboutPic3
  }
])
const videoList = ref([""])

// 监听 locale 变化
watch(locale, (newLocale, oldLocale) => {
  console.log(`语言从 ${oldLocale} 切换到 ${newLocale}`)
  getBanner()
})

const getBanner = () => {
  // 可以在这里调用获取首页banner的接口
  getHomeBanner().then((res: any) => {
    console.log("关于我们banner数据：", res)
    if (res.code == 1) {
      let array = res.data.data
      array.map((item, index) => {
        let videoUrl = ""
        console.log(locale.value)
        switch (locale.value) {
          case "zh":
            videoUrl = item.image
            break
          case "en":
            videoUrl = item.image_en
            break
          case "jp":
            videoUrl = item.image_jp
            break
        }
        videoList.value[index] = videoUrl
      })
      // videoList.value[1] = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      console.log("videoList.value:", videoList.value)
    }
  })
}

onMounted(() => {
  getBanner()
})
</script>
<style lang="scss" scoped>
.about-us {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 100px;
  .about-banner {
    width: 100%;
    max-height: 100vh;
    overflow: hidden;
    .video {
      width: 100%;
      height: calc(100vh - 100px);
      max-width: 100%;
      min-height: 80%;
      object-fit: cover; /* 保持视频比例 */
      display: block;
    }
  }
  .about-box {
    margin: 0 auto;
  }
  .about-title {
    padding: 70px 0;
    color: rgba(60, 50, 28, 1);
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: center;
  }
  .about-info {
    position: relative;
    z-index: 5;
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 70px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 1px;
        height: 90%;
        background: rgba(194, 153, 116, 1);
        top: 130px;
        left: 71px;
      }
      &::after {
        content: "";
        position: absolute;
        width: 23px;
        height: 23px;
        background: url("@/assets/img/time-icon.svg") no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        top: calc(100% / 2 + 100px);
        left: 60px;
      }
      &:last-child {
        &::before,
        &::after {
          display: none;
        }
      }
      &-year {
        width: 141px;
        height: 51px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(194, 153, 116, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 36px;
        font-weight: 400;
        line-height: 42px;
        letter-spacing: 0px;
        text-align: center;
        margin-top: 46px;
      }
      &-box {
        width: 87%;
        padding: 40px 0;
        margin-left: 40px;
        border: 1px solid rgba(194, 153, 116, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .box-info {
          padding: 0 40px;
          width: 57%;
          &-title {
            color: rgba(140, 65, 20, 1);
            font-size: 32px;
            font-weight: 500;
            line-height: 38px;
            letter-spacing: 0px;
            text-align: left;
          }
          &-text {
            margin-top: 30px;
            color: rgba(60, 50, 28, 1);
            font-size: 20px;
            font-weight: 400;
            line-height: 40px;
            letter-spacing: -1px;
            text-align: justify;
          }
        }
        .box-img {
          width: 34%;
          margin-right: 40px;
          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
  }
  .about-subtit {
    width: 100%;
    // margin-top: -20px;
    margin-bottom: 40px;
    color: rgba(60, 50, 28, 1);
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: left;
  }
  .about-subtext {
    margin-bottom: 20px;
    width: 100%;
    color: rgba(60, 50, 28, 1);
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: -1px;
    text-align: left;
  }
  .about-people {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 60px auto;
    img,
    .about-date {
      width: 118px;
      display: block;
      margin: 0 70px 0 0;
      text-align: center;
    }
    .about-date {
      font-size: 16px;
      line-height: 24px;
      margin-top: 8px;
    }
  }
}
.left-icon {
  position: absolute;
  top: 842px;
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
  right: -186px;
  top: 1518px;
  z-index: 1;
}
</style>
