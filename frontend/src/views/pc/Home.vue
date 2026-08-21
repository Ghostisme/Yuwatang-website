<template>
  <div class="home">
    <div class="banner">
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
            preload="metadata"
            poster="@/assets/img/home-banner.jpg"
          ></video>
        </swiper-slide>
      </swiper>
      <!-- <img src="@/assets/img/home-banner.jpg" alt="" /> -->
    </div>
    <!-- 品牌介绍 -->
    <div class="ppjs" style="max-width: 1407px; padding: 0 25px">
      <div class="ppjs-title">
        <div class="ppjs-title-h1">{{ t("home.item1") }}</div>
        <div class="ppjs-title-p" v-html="t('home.item2')"></div>
      </div>
      <div class="ppjs-content">
        <div class="ppjs-content-img">
          <img src="@/assets/img/home-pic1.jpg" alt="" />
        </div>
        <div class="ppjs-content-info">
          <div class="info-title">{{ t("home.item3") }}</div>
          <div class="info-text">{{ t("home.item4") }}</div>
          <!-- <div class="info-btn">{{ t("home.item5") }}</div> -->
        </div>
      </div>
      <div class="ppjs-list">
        <div class="ppjs-list-item" @click="goFeature(index)" v-for="(item, index) in prodList" :key="index">
          <div class="item-img"><img :src="item.img" alt="" /></div>
          <div class="item-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
    <!-- 定制服务 -->
    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
      <!-- <div class="zdfw-title">{{ t("home.item10") }}</div> -->
      <div class="zdfw-content">
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic9.jpg" alt="" />
        </div>
        <div class="zdfw-content-info">
          <div class="info-title">{{ t("home.item10") }}</div>
          <div class="info-text">{{ t("home.item12") }}</div>
          <!-- <div class="info-btn" @click="goServe">{{ t("home.item13") }}</div> -->
        </div>
      </div>
    </div>
    <!-- 种植基地 -->
    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
      <div class="zdfw-title">{{ t("home.item19") }}</div>
      <div class="zdfw-content">
        <div class="zdfw-content-info">
          <div class="info-text">{{ t("home.item20") }}</div>
          <div class="info-btn" @click="goBase">{{ t("home.item13") }}</div>
        </div>
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic8.jpg" alt="" />
        </div>
      </div>
    </div>
    <!-- 鹤佗年 -->
    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
      <div class="zdfw-title">
        <img src="@/assets/img/htn-logo.svg" alt="" />
      </div>
      <div class="zdfw-content">
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic10.jpg" alt="" />
        </div>
        <div class="zdfw-content-info">
          <div class="info-text" v-html="t('home.item22')"></div>
        </div>
      </div>
    </div>
    <!-- 店铺资讯 -->
    <div class="zdfw" style="max-width: 1407px; padding: 0 25px">
      <div class="zdfw-title">{{ t("home.item14") }}</div>
      <div class="zdfw-content">
        <div class="zdfw-content-info">
          <div class="info-text">{{ t("home.item15") }}</div>
          <div class="info-btn" @click="goStore">{{ t("home.item13") }}</div>
        </div>
        <div class="zdfw-content-img">
          <img src="@/assets/img/home-pic7.jpg" alt="" />
        </div>
      </div>
    </div>
    <!-- <div class="dpzx" style="max-width: 1407px; padding: 0 25px">
      <div class="dpzx-title">{{ t("home.item14") }}</div>
      <div class="dpzx-content">
        <div class="dpzx-content-info">
          <div class="info-title">{{ t("home.item15") }}</div>
          <div class="info-ul">
            <div class="info-ul-left">
              <div class="info-ul-item" v-for="(item, index) in shopOneList" :key="index">
                {{ item }}
              </div>
            </div>
            <div class="info-ul-right">
              <div class="info-ul-item" v-for="(item, index) in shopTwoList" :key="index">
                {{ item }}
              </div>
              <div class="info-ul-btn" @click="goShop">{{ t("home.item18") }}</div>
            </div>
          </div>
        </div>
        <div class="dpzx-content-img">
          <img src="@/assets/img/home-pic7.jpg" alt="" />
        </div>
      </div>
    </div> -->
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
import homePic2 from "@/assets/img/home-pic2.jpg"
import homePic3 from "@/assets/img/home-pic3.jpg"
import homePic4 from "@/assets/img/home-pic4.jpg"
import homePic5 from "@/assets/img/home-pic5.jpg"

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

const prodList = computed(() => [
  {
    img: homePic2,
    text: t("home.item6")
  },
  {
    img: homePic3,
    text: t("home.item7")
  },
  {
    img: homePic4,
    text: t("home.item8")
  },
  {
    img: homePic5,
    text: t("home.item9")
  }
])

const shopOneList = ref(t("home.item16").split(","))
const shopTwoList = ref(t("home.item17").split(","))
const videoList = ref([""])

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

const goStore = () => {
  router.push({
    path: "/store"
  })
}

const goShop = () => {
  router.push({
    path: "/shop"
  })
}

const goFeature = (index: number) => {
  let type = index
  router.push({
    path: "/feature",
    query: {
      type
    }
  })
}

const getBanner = () => {
  // 可以在这里调用获取首页banner的接口
  getHomeBanner().then((res: any) => {
    console.log("首页banner数据：", res)
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
  max-height: 100vh;
  overflow: hidden;
  .video {
    width: 100%;
    height: calc(100vh - 88px);
    max-width: 100%;
    min-height: 80%;
    object-fit: cover; /* 保持视频比例 */
    display: block;
  }
  img {
    display: block;
    width: 100%;
  }
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
      .item-text {
        color: rgba(60, 50, 28, 1);
        font-size: 20px;
        font-weight: 400;
        line-height: 23px;
        letter-spacing: 0px;
        text-align: center;
        margin-top: 23px;
      }
    }
  }
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
