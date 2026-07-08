<template>
  <div class="contact">
    <div class="contact-banner">
      <img src="@/assets/img/contact-banner.jpg" alt="" />
    </div>
    <div class="banner-tit">{{ t("contact.item6") }}</div>
    <div class="contact-box" style="padding: 0 15px">
      <div class="contact-title">{{ t("contact.item1") }}</div>
      <!-- 联系卡片 -->
      <div class="contact-cards">
        <!-- 电话联系 -->
        <div class="contact-card">
          <div class="card-icon phone-icon">📞</div>
          <h3>{{ t("contact.item2") }}</h3>
          <!-- <p>{{ t("contact.item3") }}</p> -->
          <div class="contact-link" @click="makePhoneCall">+86-18895366320</div>
        </div>

        <!-- 邮箱联系 -->
        <div class="contact-card">
          <div class="card-icon email-icon">✉️</div>
          <h3>{{ t("contact.item4") }}</h3>
          <!-- <p>{{ t("contact.item5") }}</p> -->
          <div class="contact-link">tty12138@foxmail.com</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const makePhoneCall = (tel) => {
  const link = document.createElement("a")
  link.href = `tel:${tel}`
  link.click()
}
</script>
<style lang="scss" scoped>
.contact {
  min-height: calc(100vh - 240px);
  margin-top: 50px;
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 252, 250, 1);
  &-banner {
    width: 100%;
    position: relative;
    img {
      width: 100%;
      display: block;
    }
  }
  .banner-tit {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 24px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0px;
    text-align: center;
    margin-top: 10px;
  }
  &-box {
    margin: 0 auto;
  }
  &-title {
    padding: 25px 15px;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0px;
  }
  /* 联系方式卡片 */
  .contact-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    margin-bottom: 60px;
  }

  .contact-card {
    width: 50%;
    background: white;
    border-radius: 12px;
    padding: 20px 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .phone-icon {
    background-color: #e8f4f8;
    color: #3498db;
  }

  .email-icon {
    background-color: #fef7fb;
    color: #e91e63;
  }

  .contact-card h3 {
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 500;
  }

  .contact-card p {
    color: #7f8c8d;
    margin-bottom: 10px;
    font-size: 12px;
  }

  .contact-link {
    display: inline-block;
    padding: 6px 8px;
    border-radius: 8px;
    color: rgba(60, 50, 28, 1);
    text-decoration: none;
    font-size: 12px;
    background: rgb(252, 248, 244);
    transition: background-color 0.3s ease;
    cursor: pointer;
  }
}
</style>
