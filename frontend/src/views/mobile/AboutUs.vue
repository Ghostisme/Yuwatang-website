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
          <video
            class="video"
            :src="item"
            autoplay
            muted
            loop
            playsinline
            webkit-playsinline
            preload="auto"
            poster="@/assets/img/home-banner.jpg"
          ></video>
        </swiper-slide>
      </swiper>
    </div>
    <div class="about-title">{{ t("about.item1") }}</div>
    <div class="about-subtit">{{ t("about.item13") }}</div>
    <div class="about-subtext">{{ t("about.item14") }}</div>
    <div class="about-subtext">{{ t("about.item15") }}</div>
    <div class="about-subtext" style="margin-bottom: 15px">{{ t("about.item16") }}</div>
    <!-- <div class="about-info">
      <div class="info-item" v-for="(item, index) in aboutList" :key="index">
        <div class="info-item-year">{{ item.year }}</div>
        <div class="info-item-box">
          <div class="box-title">{{ item.title }}</div>
          <div class="box-info">
            <div class="box-info-text">{{ item.text }}</div>
            <div class="box-info-img">
              <img :src="item.src" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="about-subtit sub-center">{{ t("about.item8") }}</div>
    <div class="about-subtext">{{ t("about.item9") }}</div>
    <div class="about-subtext">{{ t("about.item10") }}</div>
    <div class="about-subtext">{{ t("about.item11") }}</div>
    <div class="about-people">
      <img src="@/assets/img/signature-icon.png" alt="" />
      <div class="about-date">{{ t("about.item12") }}</div>
    </div>
    <div class="store">
      <div class="store-title mt100">{{ t("store.item28") }}</div>
      <div class="store-subtit">{{ t("store.item29") }}</div>
      <div class="store-btn" @click="goContact">{{ t("store.item30") }}</div>
    </div>
    <img class="left-icon" src="@/assets/img/left-icon.png" alt="" />
    <img class="right-icon" src="@/assets/img/right-icon.png" alt="" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
// 导入 Swiper Vue.js 组件
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules"

import { getHomeBanner } from "@/api"
import aboutPic1 from "@/assets/img/about-pic1.png"
import aboutPic2 from "@/assets/img/about-pic2.png"
import aboutPic3 from "@/assets/img/about-pic3.png"

const { t, locale } = useI18n()
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

const goContact = () => {
  router.push({
    path: "/contact-us"
  })
}

onMounted(() => {
  getBanner()
})
</script>
<style lang="scss" scoped>
.about-us {
  width: 100%;
  min-height: calc(100vh - 240px);
  margin-top: 50px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  .about-banner {
    width: 100%;
    .video {
      width: 100%;
      height: calc(100vh - 50px);
      max-width: 100%;
      object-fit: cover; /* 保持视频比例 */
      display: block;
    }
  }
  .about-title {
    padding: 15px;
    color: rgba(60, 50, 28, 1);
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;
    letter-spacing: 0px;
    text-align: center;
  }
  .about-info {
    padding: 0 15px;
    position: relative;
    z-index: 5;
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 1px;
        height: calc(100% - 31px);
        background: rgba(194, 153, 116, 1);
        top: 31px;
        left: 31px;
      }
      &::after {
        content: "";
        position: absolute;
        width: 11px;
        height: 11px;
        background: url("@/assets/img/time-icon.svg") no-repeat;
        background-size: 100% 100%;
        background-position: center center;
        top: calc(100% / 2 + 20px);
        left: 26px;
      }
      &-year {
        width: 61px;
        height: 21px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(194, 153, 116, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0px;
        text-align: center;
        position: relative;
      }
      &-box {
        flex: 1;
        padding: 15px;
        border: 1px solid rgba(194, 153, 116, 1);
        margin-left: 12px;
        .box-title {
          color: rgba(140, 65, 20, 1);
          font-size: 16px;
          font-weight: 500;
          line-height: 19px;
          letter-spacing: 0px;
          text-align: left;
        }
        .box-info {
          margin-top: 10px;
          &-text {
            color: rgba(60, 50, 28, 1);
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: -1px;
            text-align: justify;
          }
          &-img {
            width: 100%;
            margin-top: 10px;
            img {
              width: 100%;
              display: block;
            }
          }
        }
      }
    }
  }
  .about-subtit {
    // width: 100%;
    // margin-top: -20px;
    margin-bottom: 10px;
    padding: 0 15px;
    color: rgba(60, 50, 28, 1);
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    &.sub-center {
      text-align: center;
    }
  }
  .about-subtext {
    margin-bottom: 10px;
    padding: 0 15px;
    color: rgba(60, 50, 28, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: -1px;
    text-align: left;
    text-indent: 2em;
  }
  .about-people {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 20px auto 30px;
    img,
    .about-date {
      width: 54px;
      display: block;
      margin: 0 35px 0 0;
      text-align: center;
    }
    .about-date {
      width: auto;
      font-size: 12px;
      line-height: 18px;
      margin-top: 4px;
      white-space: nowrap;
      text-align: center;
    }
  }
}
.store {
  width: 100%;
  display: flex;
  flex-direction: column;
  &-title {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 24px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0px;
    text-align: center;
    &.mt100 {
      margin-top: 100px;
    }
  }
  &-subtit {
    width: 100%;
    color: rgba(60, 50, 28, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0px;
    text-align: center;
    padding: 0 10px;
  }
  &-btn {
    padding: 15px 16px;
    border-bottom: 1px solid rgba(194, 153, 116, 1);
    background: rgba(255, 255, 255, 0);
    color: rgba(194, 153, 116, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 1px;
    text-align: center;
    margin: 15px auto 100px;
    cursor: pointer;
    display: inline-block;
  }
}
.left-icon {
  position: absolute;
  top: 233px;
  left: -31px;
  width: 91px;
  height: 91px;
  display: block;
  z-index: 1;
}
.right-icon {
  position: absolute;
  width: 133px;
  height: 76px;
  display: block;
  right: -83px;
  top: 726px;
  z-index: 1;
}
</style>
