<template>
  <div :class="['header-pc', { 'header-show': headerVisible, 'header-scrolled': !headerVisible }]" v-if="!isMobile">
    <img class="header-pc-icon" @click="goTo('/')" src="@/assets/img/header-icon.png" alt="裕和堂" />
    <nav class="header-pc-nav">
      <span
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="goTo(item.path)"
      >
        {{ t(item.labelKey) }}
      </span>
    </nav>
    <div class="header-pc-lang">
      <div
        class="header-pc-lang-item"
        @click="switchLanguage(item.key)"
        :class="{ active: menuIndex == item.key }"
        v-for="item in langList"
        :key="item.key"
      >
        {{ item.value }}
      </div>
    </div>
  </div>

  <div :class="['header-h5', { 'header-show': headerVisible, 'header-scrolled': !headerVisible }]" v-else>
    <img class="header-h5-icon" @click="goTo('/')" src="@/assets/img/header-icon.png" alt="裕和堂" />
    <div class="header-h5-right">
      <div class="header-h5-lang">
        <div
          class="header-h5-lang-item"
          @click="switchLanguage(item.key)"
          :class="{ active: menuIndex == item.key }"
          v-for="item in langList"
          :key="item.key"
        >
          {{ item.value }}
        </div>
      </div>
      <button class="header-h5-toggle" type="button" aria-label="menu" @click="mobileOpen = !mobileOpen">
        <span :class="{ open: mobileOpen }"></span>
      </button>
    </div>
    <div class="header-h5-drawer" v-if="mobileOpen">
      <span
        v-for="item in navItems"
        :key="item.path"
        class="drawer-item"
        :class="{ active: isActive(item.path) }"
        @click="goTo(item.path, true)"
      >
        {{ t(item.labelKey) }}
      </span>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "Header"
}
</script>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { deviceDetector } from "@/utils/device-detector"
import { useI18n } from "vue-i18n"

const { locale, t } = useI18n()
const router = useRouter()
const route = useRoute()
const menuIndex = ref(localStorage.getItem("user-locale") || "zh")
const isMobile = ref(deviceDetector.getDeviceType() === "mobile")
const mobileOpen = ref(false)
const headerVisible = ref(true)
const lastScrollY = ref(0)

const langList = [
  { key: "zh", value: "中文" },
  { key: "en", value: "English" },
  { key: "jp", value: "日本语" }
]

const navItems = [
  { path: "/", labelKey: "nav.home" },
  { path: "/feature", labelKey: "nav.feature" },
  { path: "/base", labelKey: "nav.base" },
  { path: "/store", labelKey: "nav.store" },
  { path: "/news", labelKey: "nav.news" },
  { path: "/trace", labelKey: "nav.trace" },
  { path: "/about-us", labelKey: "nav.about" },
  { path: "/contact-us", labelKey: "nav.contact" }
]

const isActive = (path: string) => {
  if (path === "/") return route.path === "/"
  return route.path === path || route.path.startsWith(path + "/")
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const height = route.name === "Feature" ? 10 : window.innerHeight * 0.8
  headerVisible.value = !(currentScrollY > height)
  lastScrollY.value = currentScrollY
  if (!headerVisible.value) mobileOpen.value = false
}

const debouncedResize = () => {
  isMobile.value = deviceDetector.getDeviceType() === "mobile"
  if (!isMobile.value) mobileOpen.value = false
}

const goTo = (path: string, closeDrawer = false) => {
  router.push(path)
  if (closeDrawer) mobileOpen.value = false
}

const switchLanguage = (key: string) => {
  menuIndex.value = key
  locale.value = key
  localStorage.setItem("user-locale", locale.value)
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
  }
)

onMounted(() => {
  menuIndex.value = locale.value
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
  top: 0;
  left: 0;
  right: 0;
  height: 88px;
  padding: 0 48px;
  background: rgba(252, 248, 244, 1);
  z-index: 99;
  display: grid;
  grid-template-columns: minmax(140px, 1fr) auto minmax(140px, 1fr);
  align-items: center;
  column-gap: 24px;
  box-sizing: border-box;

  &-icon {
    width: 110px;
    height: auto;
    justify-self: start;
    display: block;
    cursor: pointer;
    object-fit: contain;
  }

  &-nav {
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    .nav-item {
      position: relative;
      padding: 8px 18px;
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
      letter-spacing: 0.06em;
      color: rgba(60, 50, 28, 0.55);
      font-family: "LinHai";
      transition: color 0.25s ease;
      white-space: nowrap;
      &::after {
        content: "";
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 2px;
        height: 1px;
        background: rgba(60, 50, 28, 1);
        transform: scaleX(0);
        transition: transform 0.25s ease;
      }
      &:hover {
        color: rgba(60, 50, 28, 0.9);
      }
      &.active {
        color: rgba(60, 50, 28, 1);
        &::after {
          transform: scaleX(1);
        }
      }
    }
  }

  &-lang {
    justify-self: end;
    display: flex;
    align-items: center;
    &-item {
      padding: 0 8px;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      position: relative;
      color: rgba(60, 50, 28, 0.4);
      font-family: "LinHai";
      transition: color 0.25s ease;
      &:hover {
        color: rgba(60, 50, 28, 0.75);
      }
      &.active {
        color: rgba(60, 50, 28, 1);
      }
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 10px;
        background: rgba(60, 50, 28, 0.25);
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &:last-child {
        padding-right: 0;
        &::after {
          display: none;
        }
      }
      &:first-child {
        padding-left: 0;
      }
    }
  }
}

@media (max-width: 1200px) {
  .header-pc {
    padding: 0 28px;
    &-nav .nav-item {
      padding: 8px 12px;
      font-size: 14px;
      &::after {
        left: 12px;
        right: 12px;
      }
    }
  }
}

.header-pc,
.header-h5 {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  &.header-show {
    transform: translateY(0);
    opacity: 1;
    z-index: 99;
    animation: headerSlideDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  &.header-scrolled {
    transform: translateY(-120px);
    z-index: 0;
    opacity: 0;
    animation: headerSlideUp 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }
}

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
  background: rgba(252, 248, 244, 1);
  z-index: 99;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;

  &-icon {
    width: 72px;
    height: auto;
    display: block;
    flex-shrink: 0;
    cursor: pointer;
    object-fit: contain;
  }

  &-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &-lang {
    display: flex;
    align-items: center;
    &-item {
      padding: 0 6px;
      cursor: pointer;
      font-size: 11px;
      line-height: 1;
      position: relative;
      color: rgba(60, 50, 28, 0.45);
      font-family: "LinHai";
      &.active {
        color: rgba(60, 50, 28, 1);
      }
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 9px;
        background: rgba(60, 50, 28, 0.25);
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &:last-child::after {
        display: none;
      }
    }
  }

  &-toggle {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    span {
      position: relative;
      width: 18px;
      height: 2px;
      background: rgba(60, 50, 28, 1);
      display: block;
      transition: background 0.2s ease;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        width: 18px;
        height: 2px;
        background: rgba(60, 50, 28, 1);
        transition: transform 0.2s ease;
      }
      &::before {
        top: -6px;
      }
      &::after {
        top: 6px;
      }
      &.open {
        background: transparent;
        &::before {
          transform: translateY(6px) rotate(45deg);
        }
        &::after {
          transform: translateY(-6px) rotate(-45deg);
        }
      }
    }
  }

  &-drawer {
    position: absolute;
    top: 52px;
    left: 0;
    right: 0;
    background: rgba(252, 248, 244, 0.98);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    padding: 8px 0 12px;
    display: flex;
    flex-direction: column;
    .drawer-item {
      padding: 12px 20px;
      font-size: 14px;
      color: rgba(60, 50, 28, 0.75);
      font-family: "LinHai";
      &.active,
      &:active {
        color: rgba(19, 19, 19, 1);
        background: rgba(60, 50, 28, 0.04);
      }
    }
  }
}
</style>
