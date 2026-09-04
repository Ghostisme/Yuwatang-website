<template>
  <div class="faq page">
    <div class="page-banner">
      <img src="@/assets/img/contact-banner.jpg" :alt="t('faq.h1')" />
      <h1 class="banner-tit">{{ t("faq.h1") }}</h1>
    </div>
    <FaqBody />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import FaqBody from "@/components/FaqBody.vue"

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.page {
  padding-top: 88px;
  min-height: 50vh;
  background: #fcf8f4;
}
.page-banner {
  position: relative;
  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }
  .banner-tit {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    color: #fff;
    font-family: "LinHai";
    font-size: 32px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
</style>
