<template>
  <div class="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script setup lang="ts">
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
</script>
<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: rgba(255, 252, 250, 1);
}
</style>
