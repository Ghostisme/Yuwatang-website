<template>
  <div class="serve">
    <div class="serve-banner">
      <img src="@/assets/img/serve-banner.jpg" alt="" />
    </div>
    <div class="serve-title">{{ t("serve.item1") }}</div>
    <div class="serve-info">
      <div class="serve-info-title">{{ t("serve.item2") }}</div>
      <div class="serve-info-text" v-html="t('serve.item3')"></div>
    </div>
    <div class="serve-info">
      <div class="serve-info-title">{{ t("serve.item4") }}</div>
      <div class="serve-info-text" v-html="t('serve.item5')"></div>
    </div>
    <div class="serve-info">
      <div class="serve-info-title">{{ t("serve.item6") }}</div>
      <div class="serve-info-text">{{ t("serve.item7") }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>
<style lang="scss" scoped>
.serve {
  min-height: calc(100vh - 240px);
  position: relative;
  z-index: 1;
  margin-top: 52px;
  &-banner {
    width: 100%;
    img {
      width: 100%;
      display: block;
    }
  }
  &-title {
    width: 280px;
    margin: 0 auto;
    padding: 15px 0 10px;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0px;
    text-align: center;
  }
  &-info {
    width: 280px;
    margin: 0 auto 15px;
    padding: 15px 22px;
    border: 1px solid rgba(205, 175, 148, 1);
    position: relative;
    z-index: 5;
    &:last-child {
      margin-bottom: 15px;
    }
    &-title {
      color: rgba(60, 50, 28, 1);
      font-size: 16px;
      font-weight: 400;
      line-height: 19px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-text {
      margin-top: 10px;
      color: rgba(60, 50, 28, 1);
      font-family: Source Han Sans CN;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: -1px;
      text-align: center;
    }
  }
}
</style>
