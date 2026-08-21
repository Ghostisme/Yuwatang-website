<template>
  <div class="serve">
    <div class="serve-banner">
      <img src="@/assets/img/serve-banner.jpg" alt="" />
    </div>
    <div class="serve-box" style="max-width: 1407px; padding: 0 25px">
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

    <img class="left-icon" src="@/assets/img/left-icon.png" alt="" />
    <img class="right-icon" src="@/assets/img/right-icon.png" alt="" />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>
<style lang="scss" scoped>
.serve {
  min-height: calc(100vh - 383px);
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 88px;
  &-banner {
    width: 100%;
    img {
      width: 100%;
      display: block;
    }
  }
  &-box {
    margin: 0 auto;
  }
  &-title {
    width: 100%;
    padding: 70px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 32px;
    font-weight: 500;
    line-height: 38px;
    letter-spacing: 0px;
    text-align: center;
  }
  &-info {
    padding: 48px 0;
    border: 1px solid rgba(205, 175, 148, 1);
    position: relative;
    z-index: 5;
    margin-bottom: 70px;
    &:last-child {
      margin-bottom: 90px;
    }
    &-title {
      color: rgba(60, 50, 28, 1);
      font-size: 28px;
      font-weight: 400;
      line-height: 32px;
      letter-spacing: 0px;
      text-align: center;
    }
    &-text {
      margin-top: 40px;
      color: rgba(60, 50, 28, 1);
      font-family: Source Han Sans CN;
      font-size: 15px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: -1px;
      text-align: center;
    }
  }
}
.left-icon {
  position: absolute;
  top: 815px;
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
  right: -186px;
  top: 1177px;
  z-index: 1;
}
</style>
