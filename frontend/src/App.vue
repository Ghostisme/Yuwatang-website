<template>
  <div class="app">
    <Header />
    <router-view v-slot="{ Component, route }">
      <Transition name="pm-page" mode="out-in" @after-enter="onPageReady">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </router-view>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import { useHreflang } from "@/composables/useHreflang"
import { useOrganizationJsonLd } from "@/composables/useStructuredData"
import { refreshPageMotion, startPremiumMotionWatch } from "@/utils/premium-motion"

const route = useRoute()
useHreflang()
useOrganizationJsonLd()

const onPageReady = () => {
  nextTick(() => refreshPageMotion())
}

onMounted(() => {
  nextTick(() => {
    refreshPageMotion()
    startPremiumMotionWatch()
  })
})

watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
      // 路由切换后稍延，等 DOM 挂载
      setTimeout(() => refreshPageMotion(), 60)
    })
  }
)
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: rgba(255, 252, 250, 1);
}
</style>
