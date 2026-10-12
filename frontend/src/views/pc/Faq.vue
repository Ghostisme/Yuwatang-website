<template>
  <div class="faq page">
    <PageBanner page="faq" />
    <FaqBody />
  </div>
</template>

<script setup lang="ts">
import PageBanner from "@/components/PageBanner.vue"
import FaqBody from "@/components/FaqBody.vue"
</script>

<style lang="scss" scoped>
.page {
  padding-top: 88px;
  min-height: 50vh;
  background: #fcf8f4;
}
</style>
