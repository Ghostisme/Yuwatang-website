<template>
  <div
    :class="[
      'header-pc',
      { 'header-show': headerVisible, 'header-scrolled': !headerVisible, 'pm-glass': headerGlass }
    ]"
    v-if="!isMobile"
  >
    <div class="header-pc-left">
      <img class="header-pc-icon" @click="goTo('/')" src="@/assets/img/header-icon.png" alt="裕和堂" />
      <div class="nav-catalog" @mouseenter="catalogOpen = true" @mouseleave="catalogOpen = false">
        <span class="nav-catalog-trigger" :class="{ active: catalogOpen || isCatalogActive() }">
          <span class="catalog-icon" aria-hidden="true"></span>
          {{ t("nav.catalog") }}
        </span>
        <Transition name="catalog">
          <div v-if="catalogOpen" class="nav-catalog-panel">
            <div class="nav-catalog-panel-inner">
              <span
                v-for="(item, index) in catalogItems"
                :key="item.path"
                class="catalog-item"
                :class="{ active: isActive(item.path) }"
                :style="{ '--i': index }"
                @click="goTo(item.path)"
              >{{ t(item.labelKey) }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
    <nav class="header-pc-nav">
      <span
        v-for="item in mainNavItems"
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

  <div
    :class="[
      'header-h5',
      { 'header-show': headerVisible, 'header-scrolled': !headerVisible, 'pm-glass': headerGlass }
    ]"
    v-else
  >
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
    <Transition name="drawer">
      <div class="header-h5-drawer" v-if="mobileOpen">
        <div class="drawer-section-label">{{ t("nav.catalog") }}</div>
        <span
          v-for="(item, index) in catalogItems"
          :key="item.path"
          class="drawer-item"
          :class="{ active: isActive(item.path) }"
          :style="{ '--i': index }"
          @click="goTo(item.path, true)"
        >
          {{ t(item.labelKey) }}
        </span>
        <div class="drawer-divider"></div>
        <span
          v-for="(item, index) in mainNavItems"
          :key="item.path"
          class="drawer-item"
          :class="{ active: isActive(item.path) }"
          :style="{ '--i': catalogItems.length + index + 1 }"
          @click="goTo(item.path, true)"
        >
          {{ t(item.labelKey) }}
        </span>
      </div>
    </Transition>
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

import { catalogItems, mainNavItems } from "@/config/navigation"

const { locale, t } = useI18n()
const router = useRouter()
const route = useRoute()
const menuIndex = ref(localStorage.getItem("user-locale") || "zh")
const isMobile = ref(deviceDetector.getDeviceType() === "mobile")
const mobileOpen = ref(false)
const catalogOpen = ref(false)
const headerVisible = ref(true)
const headerGlass = ref(false)
const lastScrollY = ref(0)

const langList = [
  { key: "zh", value: "中文" },
  { key: "en", value: "English" },
  { key: "jp", value: "日本语" }
]

const isActive = (path: string) => {
  if (path === "/") return route.path === "/"
  return route.path === path || route.path.startsWith(path + "/")
}

const isCatalogActive = () => catalogItems.some((item) => isActive(item.path))

const handleScroll = () => {
  const currentScrollY = Math.max(0, window.scrollY)
  const delta = currentScrollY - lastScrollY.value
  const nearTop = currentScrollY < 24

  // 顶部始终显示；向下滚隐藏；向上滚显示（忽略细微抖动）
  if (nearTop) {
    headerVisible.value = true
  } else if (delta > 6) {
    headerVisible.value = false
    mobileOpen.value = false
    catalogOpen.value = false
  } else if (delta < -6) {
    headerVisible.value = true
  }

  headerGlass.value = currentScrollY > 16 && headerVisible.value
  lastScrollY.value = currentScrollY
}

const debouncedResize = () => {
  isMobile.value = deviceDetector.getDeviceType() === "mobile"
  if (!isMobile.value) mobileOpen.value = false
}

const goTo = (path: string, closeDrawer = false) => {
  router.push(path)
  catalogOpen.value = false
  if (closeDrawer) mobileOpen.value = false
}

const switchLanguage = (key: string) => {
  menuIndex.value = key
  locale.value = key
  localStorage.setItem("user-locale", locale.value)
  // 只更新 query，保留当前 path（深链安全）
  const nextQuery = { ...route.query, lang: key }
  router.replace({ query: nextQuery }).catch(() => undefined)
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
    catalogOpen.value = false
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
  grid-template-columns: minmax(200px, 1fr) auto minmax(140px, 1fr);
  align-items: center;
  column-gap: 24px;
  box-sizing: border-box;

  &-left {
    justify-self: start;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &-icon {
    width: 110px;
    height: auto;
    display: block;
    cursor: pointer;
    object-fit: contain;
    flex-shrink: 0;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    &:hover {
      transform: scale(1.03);
      opacity: 0.92;
    }
  }

  .nav-catalog {
    position: relative;
  }
  .nav-catalog-trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 15px;
    font-family: "LinHai";
    color: rgba(60, 50, 28, 0.65);
    border: 1px solid rgba(60, 50, 28, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.45);
    &.active {
      color: rgba(60, 50, 28, 1);
    }
    .catalog-icon {
      width: 14px;
      height: 10px;
      background: linear-gradient(currentColor, currentColor) center / 14px 1.5px no-repeat;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        width: 14px;
        height: 1.5px;
        background: currentColor;
      }
    }
  }
  .nav-catalog-panel {
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 10px;
    z-index: 120;
  }
  .nav-catalog-panel-inner {
    min-width: 220px;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
    background: rgba(252, 248, 244, 0.96);
    border: 1px solid rgba(60, 50, 28, 0.08);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(60, 50, 28, 0.12);
    .catalog-item {
      padding: 12px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-family: "LinHai";
      color: rgba(60, 50, 28, 0.72);
      &:hover,
      &.active {
        background: rgba(60, 50, 28, 0.06);
        color: rgba(60, 50, 28, 1);
      }
    }
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
      transition: color 0.35s cubic-bezier(0.22, 1, 0.36, 1);
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
        transform-origin: center;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
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
    background: rgba(252, 248, 244, 0.94);
    backdrop-filter: blur(16px) saturate(1.1);
    -webkit-backdrop-filter: blur(16px) saturate(1.1);
    box-shadow: 0 12px 28px rgba(60, 50, 28, 0.08);
    padding: 8px 0 12px;
    display: flex;
    flex-direction: column;
    transform-origin: top center;
    .drawer-section-label {
      padding: 8px 20px 4px;
      font-size: 11px;
      color: rgba(60, 50, 28, 0.38);
      font-family: "LinHai";
    }
    .drawer-divider {
      height: 1px;
      margin: 6px 20px;
      background: rgba(60, 50, 28, 0.08);
    }
    .drawer-item {
      padding: 12px 20px;
      font-size: 14px;
      color: rgba(60, 50, 28, 0.75);
      font-family: "LinHai";
      opacity: 0;
      transform: translateY(8px);
      animation: drawerItemIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: calc(var(--i, 0) * 35ms + 40ms);
      transition: background 0.25s ease, color 0.25s ease, padding-left 0.25s ease;
      &.active,
      &:active {
        color: rgba(19, 19, 19, 1);
        background: rgba(60, 50, 28, 0.04);
        padding-left: 26px;
      }
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes drawerItemIn {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-item {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
