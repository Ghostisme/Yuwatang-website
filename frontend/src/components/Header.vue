<template>
  <div :class="['header-pc', { 'header-show': headerVisible, 'header-scrolled': !headerVisible }]" v-if="!isMobile">
    <img class="header-pc-icon" @click="goHome" src="@/assets/img/header-icon.png" alt="" />
    <div class="header-pc-menu">
      <div
        class="header-pc-menu-item"
        @click="switchLanguage(item.key)"
        :class="{ active: menuIndex == item.key }"
        v-for="item in menulist"
        :key="item.key"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
  <div :class="['header-h5', { 'header-show': headerVisible, 'header-scrolled': !headerVisible }]" v-else>
    <img class="header-h5-icon" @click="goHome" src="@/assets/img/header-icon.png" alt="" />
    <div class="header-h5-menu">
      <div
        class="header-h5-menu-item"
        @click="switchLanguage(item.key)"
        :class="{ active: menuIndex == item.key }"
        v-for="item in menulist"
        :key="item.key"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// 添加这个默认导出来解决 Vetur 错误
export default {
  name: "Header"
}
</script>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { deviceDetector } from "@/utils/device-detector"
import { useI18n } from "vue-i18n"

const { locale, availableLocales, t } = useI18n()
const router = useRouter()
const route = useRoute()
const menuIndex = ref("zh")
const isMobile = ref(deviceDetector.getDeviceType() === "mobile")
const menulist = ref([
  {
    key: "zh",
    value: "中文"
  },
  {
    key: "en",
    value: "English"
  },
  {
    key: "jp",
    value: "日本语"
  }
])

const headerVisible = ref(true)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY
  console.log("useRoute", route)
  const height = route.name === "Feature" ? 10 : window.innerHeight * 0.8

  // 向下滚动隐藏，向上滚动显示
  // if (currentScrollY > lastScrollY.value && currentScrollY > 200) {
  if (currentScrollY > height) {
    // 向下滚动且超过100px时隐藏header
    headerVisible.value = false
  } else {
    // 向上滚动或回到顶部时显示header
    headerVisible.value = true
  }

  lastScrollY.value = currentScrollY
}

const debouncedResize = () => {
  isMobile.value = deviceDetector.getDeviceType() === "mobile"
}

const goHome = () => {
  router.push("/")
}

const switchLanguage = (key: string) => {
  // return
  menuIndex.value = key
  locale.value = key
  localStorage.setItem("user-locale", locale.value)
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
  window.addEventListener("resize", debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
  window.removeEventListener("resize", debouncedResize)
})
</script>
<style lang="scss" scoped>
.header-pc {
  position: fixed;
  top: -10px;
  left: 0;
  right: 0;
  padding-top: 10px;
  height: 110px;
  // background: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0) 100%);
  background: rgba(252, 248, 244, 1);
  z-index: 99;
  /* 基础过渡 */

  &-icon {
    width: 123px;
    height: 50px;
    margin: 25px auto;
    display: block;
    cursor: pointer;
  }
  &-menu {
    position: absolute;
    top: 43px;
    // right: 100px;
    right: 6.25rem;
    display: flex;
    &-item {
      padding: 0 20px;
      cursor: pointer;
      font-size: 24px;
      font-weight: 400;
      line-height: 29px;
      position: relative;
      color: rgba(19, 19, 19, 0.5);
      font-family: "LinHai";
      &.active {
        color: rgba(19, 19, 19, 1);
      }
      &::after {
        content: "";
        position: absolute;
        width: 2px;
        height: 18px;
        background: rgba(19, 19, 19, 1);
        right: 0;
        top: 6px;
      }
      &:last-child::after {
        display: none;
      }
    }
  }
}

.header-pc,
.header-h5 {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* Header 展示 */
  &.header-show {
    transform: translateY(0);
    opacity: 1;
    z-index: 99;
    animation: headerSlideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Header 隐藏 */
  &.header-scrolled {
    transform: translateY(-120px);
    z-index: 0;
    opacity: 0;
    animation: headerSlideUp 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }
}

/* 滑入动画 */
@keyframes headerSlideDown {
  0% {
    transform: translateY(-120px);
    opacity: 0;
  }
  70% {
    transform: translateY(5%);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 滑出动画 */
@keyframes headerSlideUp {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-120px);
    opacity: 0;
  }
}
.header-h5 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  // background: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0) 100%);
  background: rgba(252, 248, 244, 1);
  z-index: 99;
  height: 50px;
  &-icon {
    width: 65px;
    margin: 13px auto;
    display: block;
  }
  &-menu {
    position: absolute;
    top: 18px;
    right: 15px;
    display: flex;
    &-item {
      padding: 0 6px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 400;
      line-height: 13px;
      position: relative;
      color: rgba(60, 50, 28, 0.5);
      font-family: "LinHai";
      &.active {
        color: rgba(19, 19, 19, 1);
      }
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 9px;
        background: rgba(60, 50, 28, 1);
        right: 0;
        top: 3px;
      }
      &:last-child::after {
        display: none;
      }
    }
  }
}
</style>
