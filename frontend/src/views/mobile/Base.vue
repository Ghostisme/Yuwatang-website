<template>
  <div class="base">
    <div class="base-banner">
      <img src="@/assets/img/base-banner.jpg" alt="" />
      <div class="banner-tit">{{ t("base.item8") }}</div>
    </div>
    <div class="base-box" style="padding: 0 15px">
      <div class="base-title">{{ t("base.item1") }}</div>
      <div class="base-text">{{ t("base.item2") }}</div>
      <div class="base-text">{{ t("base.item3") }}</div>
    </div>
    <div class="base-info" style="padding: 0 15px">
      <div class="base-info-img">
        <div class="img">
          <img src="@/assets/img/base-img1.jpg" alt="" />
        </div>
        <div class="img">
          <img src="@/assets/img/base-img2.jpg" alt="" />
        </div>
      </div>
      <div class="base-info-list">
        <div class="list-content">
          <div class="list-content-h1">{{ t("base.item4") }}</div>
          <div class="list-content-p">{{ t("base.item5") }}</div>
        </div>
        <div class="img">
          <img src="@/assets/img/base-img3.jpg" alt="" />
        </div>
      </div>
      <div class="base-info-list">
        <div class="list-content">
          <div class="list-content-h1">{{ t("base.item6") }}</div>
          <div class="list-content-p">{{ t("base.item7") }}</div>
        </div>
        <div class="img">
          <img src="@/assets/img/base-img4.jpg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>
<style lang="scss" scoped>
.base {
  min-height: calc(100vh - 240px);
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 50px;
  &-banner {
    width: 100%;
    position: relative;
    img {
      width: 100%;
      display: block;
    }
    .banner-tit {
      width: 100%;
      position: absolute;
      bottom: 20px;
      font-size: 24px;
      line-height: 1.5;
      text-align: center;
      color: #fff;
      font-weight: 400;
    }
  }
  &-box {
    margin: 0 auto;
  }
  &-title {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 24px;
    line-height: 1.5;
    letter-spacing: 0px;
    text-align: center;
  }
  &-text {
    width: 100%;
    color: rgba(102, 102, 102, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0px;
    text-align: left;
    margin-bottom: 10px;
  }
  &-info {
    margin: 15px auto 0;
    &-img {
      display: flex;
      align-items: center;
      gap: 15px;
      .img {
        width: 50%;
        margin-bottom: 15px;
        img {
          width: 100%;
          display: block;
        }
      }
    }
    &-list {
      width: 100%;
      margin-bottom: 15px;
      .img {
        width: 100%;
        margin-bottom: 25px;
        img {
          width: 100%;
          display: block;
        }
      }
      .list-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: rgba(60, 50, 28, 1);
        &-h1 {
          font-size: 24px;
          line-height: 1.5;
        }
        &-p {
          width: 100%;
          margin: 15px 0 25px;
          text-align: justify;
          font-size: 12px;
          line-height: 18px;
        }
      }
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
