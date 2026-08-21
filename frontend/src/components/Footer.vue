<template>
  <div class="footer-pc" v-if="!isMobile">
    <div class="footer-pc-box">
      <div class="footer-pc-box-left">
        <div class="footer-pc-us" :class="locale == 'zh' ? 'fontzh' : ''">
          <span class="about-us" @click="goAboutUs">{{ t("footer.item1") }}</span>
          <span class="about-us" @click="goContactUs">{{ t("footer.item2") }}</span>
          <span class="about-us" @click="goNews">{{ t("footer.item10") }}</span>
        </div>
        <div class="footer-pc-info">
          <span class="info-li">{{ t("footer.item4") }}</span>
          <span class="info-li">{{ t("footer.item7") }}</span>
          <span class="info-li">{{ t("footer.item5") }}</span>
          <span class="info-li">
            <img src="@/assets/img/tel-icon.svg" alt="" />
            {{ t("footer.item6") }}
          </span>
        </div>
      </div>
      <div class="footer-pc-box-right">
        <div class="footer-pc-title" :class="locale == 'zh' ? 'fontzh' : ''" v-html="t('footer.item3')"></div>
        <div class="img-li">
          <div class="img-li-box">
            <img src="@/assets/img/wx-icon.png" alt="" />
            <span class="box-text">{{ t("footer.item11") }}</span>
          </div>
          <div class="img-li-box">
            <img src="@/assets/img/xhs-icon.png" alt="" />
            <span class="box-text">{{ t("footer.item12") }}</span>
          </div>
          <div class="img-li-box">
            <img src="@/assets/img/dy-icon.png" alt="" />
            <span class="box-text">{{ t("footer.item13") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-h5" v-else>
    <div class="footer-h5-box">
      <div class="box-top" :class="locale !== 'jp' ? 'fontzh' : ''">
        <div class="box-top-us">
          <span class="about-us" @click="goAboutUs">{{ t("footer.item1") }}</span>
          <span class="about-us" @click="goContactUs">{{ t("footer.item2") }}</span>
          <span class="about-us" @click="goNews">{{ t("footer.item10") }}</span>
          <div class="box-top-title" v-html="t('footer.item3')"></div>
        </div>
      </div>
      <div class="box-btm">
        <span class="info-li">{{ t("footer.item4") }}</span>
        <span class="info-li">{{ t("footer.item5") }}</span>
        <span class="info-li">{{ t("footer.item7") }}</span>
        <span class="info-li">
          <img src="@/assets/img/tel-icon.svg" alt="" />
          {{ t("footer.item6") }}
        </span>
      </div>
    </div>
    <div class="logo-icon">
      <div class="img-li-box">
        <img src="@/assets/img/wx-icon.png" alt="" />
        <span class="box-text">{{ t("footer.item11") }}</span>
      </div>
      <div class="img-li-box">
        <img src="@/assets/img/xhs-icon.png" alt="" />
        <span class="box-text">{{ t("footer.item12") }}</span>
      </div>
      <div class="img-li-box">
        <img src="@/assets/img/dy-icon.png" alt="" />
        <span class="box-text">{{ t("footer.item13") }}</span>
      </div>
    </div>
  </div>
  <div class="popup-bg" @click="isShow = false" :class="isMobile ? 'is-h5' : 'is-pc'" v-if="isShow"></div>
  <div class="popup-tel" v-if="isShow">
    <img class="popup-tel-head" src="@/assets/img/popup-head.svg" alt="" />
    <span class="popup-tel-text">{{ t("footer.item2") }}</span>
    <span class="popup-tel-num">+86-18895366320</span>
    <span class="popup-tel-num">{{ t("footer.item9") }} tty12138@foxmail.com</span>

    <div class="popup-tel-btn" @click="makePhoneCall('18895366320')">
      {{ t("footer.item8") }}
    </div>
    <div class="popup-tel-close" @click="isShow = false">
      <img v-if="isMobile" src="@/assets/img/popup-close-h5.svg" alt="" />
      <img v-else src="@/assets/img/popup-close-pc.svg" alt="" />
    </div>
  </div>
</template>
<script lang="ts">
// 添加这个默认导出来解决 Vetur 错误
export default {
  name: "Footer"
}
</script>
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { deviceDetector } from "@/utils/device-detector"

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const isShow = ref(false)
const isMobile = ref(deviceDetector.getDeviceType() === "mobile")

console.log("当前语言:", locale.value)
// 监听特定属性
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log("路径变化:", oldPath, "→", newPath)
    isShow.value = false
  }
)

const debouncedResize = () => {
  isMobile.value = deviceDetector.getDeviceType() === "mobile"
}

const goAboutUs = () => {
  router.push({
    path: "/about-us"
  })
}

const goContactUs = () => {
  router.push("/contact-us")
}

const goNews = () => {
  router.push("/news")
}

const goHome = () => {
  router.push("/")
}

const goShop = () => {
  router.push("/shop")
}

const makePhoneCall = (tel) => {
  if (!isMobile.value) return
  const link = document.createElement("a")
  link.href = `tel:${tel}`
  link.click()
}

onMounted(() => {
  window.addEventListener("resize", debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener("resize", debouncedResize)
})
</script>
<style lang="scss" scoped>
.footer-pc {
  width: 100%;
  // height: 283px;
  height: 17.6rem;
  background: url("@/assets/img/footer-bg.png");
  background-size: 100%;
  background-position: center center;
  &-box {
    // padding: 0 170px;
    padding: 0 10.6rem;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      .img-li {
        margin-top: 20px;
        display: flex;
        align-items: center;
        // gap: 90px;
        gap: 5.6rem;
        .img-li-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          .box-text {
            margin-top: 0.5rem;
            color: rgba(122, 86, 54, 1);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            letter-spacing: 0px;
            text-align: center;
          }
        }
        img {
          // width: 150px;
          width: 9.4rem;
          display: block;
        }
      }
    }
  }
  &-us {
    display: flex;
    align-items: center;
    // padding: 46px 0 43px;
    padding: 0 0 2rem;
    .about-us {
      // margin: 0 30px;
      margin: 0 1.9rem;
      color: rgba(122, 86, 54, 1);
      font-size: 20px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: justify;
      position: relative;
      cursor: pointer;
      white-space: nowrap;

      &::after {
        content: "";
        position: absolute;
        width: 2px;
        height: 18px;
        background: rgba(122, 86, 54, 1);
        left: -2rem;
        top: 4px;
      }
      &:first-child {
        margin-left: 0;
      }
      &:first-child::after {
        display: none;
      }
    }
  }
  &-title {
    margin-left: 10px;
    color: rgba(122, 86, 54, 1);
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: center;
    white-space: nowrap;
  }
  &-info {
    display: flex;
    flex-direction: column;
    .info-li {
      display: flex;
      align-items: center;
      font-family: "HarmonyOS Sans SC";
      color: rgba(122, 86, 54, 1);
      font-size: 15px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0px;
      text-align: left;
      // margin-bottom: 20px;
      margin-bottom: 1.2rem;
      white-space: nowrap;
      img {
        display: block;
        margin-right: 6px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.popup-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  &.is-h5 {
    background: rgba(0, 0, 0, 0.55);
  }
  &.is-pc {
    background: rgba(0, 0, 0, 0);
  }
}
@media (min-width: 767px) {
  .popup-tel {
    width: 616px;
    padding-bottom: 50px;
    // height: 462px;
    border-radius: 36px;
    box-shadow: 0px 4px 44px 0px rgba(0, 0, 0, 0.15);
    background: linear-gradient(180deg, rgba(255, 245, 237, 1), rgba(255, 255, 255, 1) 51%, rgba(255, 255, 255, 1) 100%);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 150;
    &-head {
      width: 172px;
      height: 172px;
      margin-top: -86px;
    }
    &-text {
      margin-top: 24px;
      color: rgba(194, 153, 116, 1);
      font-size: 36px;
      font-weight: 400;
      line-height: 42px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-num {
      margin-top: 30px;
      color: rgba(0, 0, 0, 1);
      font-size: 40px;
      font-weight: 500;
      line-height: 47px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-btn {
      margin-top: 30px;
      width: 430px;
      height: 76px;
      color: rgba(255, 255, 255, 1);
      font-size: 28px;
      font-weight: 400;
      line-height: 33px;
      letter-spacing: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 9999px;
      background: rgba(194, 153, 116, 1);
      cursor: pointer;
    }
    &-close {
      position: absolute;
      bottom: -108px;
      width: 88px;
      height: 88px;
      cursor: pointer;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
@media (max-width: 767px) {
  .popup-tel {
    width: 309px;
    // height: 231px;
    padding-bottom: 25px;
    border-radius: 36px;
    box-shadow: 0px 4px 44px 0px rgba(0, 0, 0, 0.15);
    background: linear-gradient(180deg, rgba(255, 245, 237, 1), rgba(255, 255, 255, 1) 51%, rgba(255, 255, 255, 1) 100%);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 150;
    &-head {
      width: 86px;
      height: 86px;
      margin-top: -43px;
    }
    &-text {
      margin-top: 12px;
      color: rgba(194, 153, 116, 1);
      font-size: 18px;
      font-weight: 400;
      line-height: 21px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-num {
      margin-top: 15px;
      color: rgba(0, 0, 0, 1);
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-btn {
      margin-top: 15px;
      width: 215px;
      height: 38px;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 9999px;
      background: rgba(194, 153, 116, 1);
      cursor: pointer;
    }
    &-close {
      position: absolute;
      bottom: -54px;
      width: 44px;
      height: 44px;
      cursor: pointer;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.footer-h5 {
  width: 100%;
  // height: 190px;
  min-height: 12rem;
  background: rgba(205, 175, 148, 0.06);
  background: url("@/assets/img/footer-bg.png");
  background-size: 100%;
  background-position: center center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .logo-icon {
    display: flex;
    align-items: flex-start;
    padding: 0 15px;
    flex: 1;
    height: 100%;
    .img-li-box {
      width: 100px;
      margin-right: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .box-text {
        margin-top: 5px;
        color: rgba(122, 86, 54, 1);
        font-size: 11px;
        font-weight: 400;
        line-height: 1.5;
        letter-spacing: 0px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    img {
      width: 75px;
      display: block;
    }
  }
  &-box {
    padding: 0 15px;
    .box-top {
      padding-top: 11px;
      display: flex;
      // align-items: center;
      flex-flow: column;
      &-us {
        display: flex;
        // align-items: center;
        flex-wrap: wrap;
        .about-us {
          color: rgba(122, 86, 54, 1);
          font-size: 11px;
          font-weight: 400;
          line-height: 13px;
          letter-spacing: 0px;
          position: relative;
          margin: 0 5px 5px;
          cursor: pointer;
          &::after {
            content: "";
            position: absolute;
            width: 1px;
            height: 9px;
            background: rgba(122, 86, 54, 1);
            left: -5px;
            top: 2px;
          }
          &:first-child {
            margin-left: 0;
          }
          &:first-child::after {
            display: none;
          }
          &:nth-child(3) {
            margin-right: 20px;
          }
        }
      }
      &-title {
        // margin-left: 10px;
        color: rgba(122, 86, 54, 1);
        font-size: 11px;
        font-weight: 400;
        line-height: 13px;
        letter-spacing: 0px;
        text-align: justify;
      }
    }
    .box-btm {
      margin-top: 13px;
      display: flex;
      flex-wrap: wrap;
      .info-li {
        width: 45%;
        display: flex;
        align-items: center;
        color: rgba(122, 86, 54, 1);
        font-size: 10px;
        font-weight: 400;
        line-height: 11px;
        letter-spacing: 0px;
        text-align: left;
        margin-bottom: 10px;
        white-space: nowrap;
        img {
          width: 10px;
          display: block;
          margin-right: 3px;
        }
      }
    }
  }
}
.fontzh {
  font-family: "LinHai";
}
</style>
