<template>
  <div class="contact">
    <div class="contact-banner">
      <img src="@/assets/img/contact-banner.jpg" alt="" />
      <div class="banner-tit">{{ t("contact.item6") }}</div>
    </div>
    <div class="contact-box" style="max-width: 1407px; padding: 0 25px">
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
  min-height: calc(100vh - 383px);
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 100px;
  background: rgba(255, 252, 250, 1);
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
      bottom: 60px;
      margin: 0 auto;
      font-size: 38px;
      line-height: 48px;
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
    padding: 70px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0px;
    text-align: center;
  }
  /* 联系方式卡片 */
  .contact-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    margin-bottom: 60px;
  }

  .contact-card {
    flex: 1;
    min-width: 280px;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    padding: 40px 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .card-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
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
    font-size: 18px;
    color: #2c3e50;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .contact-card p {
    color: #7f8c8d;
    margin-bottom: 24px;
    font-size: 16px;
  }

  .contact-link {
    display: inline-block;
    padding: 12px 32px;
    border-radius: 8px;
    color: rgba(60, 50, 28, 1);
    text-decoration: none;
    font-size: 16px;
    background: rgb(252, 248, 244);
    transition: background-color 0.3s ease;
    cursor: pointer;
  }
}
</style>
