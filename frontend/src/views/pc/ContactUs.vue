<template>
  <div class="contact">
    <div class="contact-banner">
      <img src="@/assets/img/contact-banner.jpg" :alt="t('contactV2.h1')" />
      <h1 class="banner-tit">{{ t("contactV2.h1") }}</h1>
    </div>
    <div class="contact-box">
      <p class="lead">{{ t("contactV2.lead") }}</p>
      <div class="contact-cards">
        <div class="contact-card primary">
          <h3>{{ t("contactV2.emailLabel") }}</h3>
          <div class="card-body">
            <a class="contact-link" :href="mailtoHref">tty12138@foxmail.com</a>
            <p class="card-hint">{{ t("contactV2.emailHint") }}</p>
          </div>
        </div>
        <div class="contact-card qr-card">
          <h3>{{ t("contactV2.social") }}</h3>
          <div class="card-body">
            <div class="qr-row">
              <div class="qr-item">
                <img src="@/assets/img/wx-icon.png" :alt="t('footer.item11')" />
                <span>{{ t("footer.item11") }}</span>
              </div>
              <div class="qr-item">
                <img src="@/assets/img/xhs-icon.png" :alt="t('footer.item12')" />
                <span>{{ t("footer.item12") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="phone-table">
        <h2>{{ t("contactV2.storePhones") }}</h2>
        <table>
          <thead>
            <tr>
              <th>门店</th>
              <th>地址</th>
              <th>电话</th>
              <th>营业</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in stores" :key="s.slug">
              <td>{{ s.name }}</td>
              <td>{{ s.address }}</td>
              <td>
                <a :href="`tel:${s.phone}`">{{ s.phone }}</a>
              </td>
              <td>{{ s.hours }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useStoreList } from "@/composables/useStores"
import { usePageSeo } from "@/composables/usePageSeo"

const { t } = useI18n()
const { stores } = useStoreList()
usePageSeo({ titleKey: "seo.contact.title", descriptionKey: "seo.contact.description", h1Key: "contactV2.h1" })

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(t("contactV2.emailSubject"))
  return `mailto:tty12138@foxmail.com?subject=${subject}`
})
</script>

<style lang="scss" scoped>
.contact {
  margin-top: 88px;
  background: #fcf8f4;
  min-height: 60vh;
}
.contact-banner {
  position: relative;
  img {
    width: 100%;
    display: block;
    max-height: 280px;
    object-fit: cover;
  }
  .banner-tit {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    color: #fff;
    font-size: 34px;
    font-family: "LinHai";
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
.contact-box {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
.lead {
  line-height: 1.85;
  color: rgba(60, 50, 28, 0.75);
  margin-bottom: 32px;
  text-align: center;
}
.contact-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
  align-items: stretch;
}
.contact-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
  min-height: 220px;
  h3 {
    margin: 0 0 20px;
    font-family: "LinHai";
    font-size: 18px;
    color: rgba(60, 50, 28, 1);
    flex-shrink: 0;
  }
  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
.contact-link {
  color: rgba(122, 86, 54, 1);
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  word-break: break-all;
  &:hover {
    text-decoration: underline;
  }
}
.card-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(60, 50, 28, 0.5);
  max-width: 260px;
}
.qr-row {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
}
.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  img {
    width: 108px;
    height: 108px;
    object-fit: contain;
    display: block;
    border-radius: 8px;
  }
  span {
    font-size: 13px;
    color: rgba(60, 50, 28, 0.7);
    line-height: 1.3;
  }
}
.phone-table {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
  h2 {
    margin: 0 0 16px;
    font-size: 18px;
    font-family: "LinHai";
    text-align: center;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid rgba(60, 50, 28, 0.08);
    text-align: left;
    vertical-align: top;
  }
  a {
    color: rgba(60, 50, 28, 0.85);
    text-decoration: none;
  }
}
@media (max-width: 720px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
  .contact-card {
    min-height: 0;
  }
}
</style>
