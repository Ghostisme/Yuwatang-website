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

          <a class="contact-link" :href="mailtoHref">tty12138@foxmail.com</a>

        </div>

        <div class="contact-card">

          <h3>{{ t("contactV2.social") }}</h3>

          <p class="muted">{{ t("contactV2.walkin") }}</p>

        </div>

      </div>

      <section class="phone-table">

        <h2>{{ t("contactV2.storePhones") }}</h2>

        <table>

          <thead>

            <tr><th>门店</th><th>地址</th><th>电话</th><th>营业</th></tr>

          </thead>

          <tbody>

            <tr v-for="s in stores" :key="s.slug">

              <td>{{ s.name }}</td>

              <td>{{ s.address }}</td>

              <td><a :href="`tel:${s.phone}`">{{ s.phone }}</a></td>

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

  img { width: 100%; display: block; max-height: 280px; object-fit: cover; }

  .banner-tit {

    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;

    margin: 0; color: #fff; font-size: 34px; font-family: "LinHai";

    text-shadow: 0 2px 12px rgba(0,0,0,.35);

  }

}

.contact-box { max-width: 900px; margin: 0 auto; padding: 48px 24px 80px; }

.lead { line-height: 1.85; color: rgba(60,50,28,.75); margin-bottom: 32px; text-align: center; }

.contact-cards { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-bottom: 40px; }

.contact-card {

  flex: 1; min-width: 260px; max-width: 400px; background: #fff; border-radius: 12px;

  padding: 32px; text-align: center; box-shadow: 0 4px 16px rgba(60,50,28,.06);

  h3 { margin: 0 0 16px; font-family: "LinHai"; }

  &.primary .contact-link { font-size: 18px; color: rgba(60,50,28,1); }

}

.contact-link { color: rgba(122,86,54,1); text-decoration: none; }

.muted { font-size: 14px; color: rgba(60,50,28,.55); line-height: 1.6; }

.phone-table {

  background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 16px rgba(60,50,28,.06);

  h2 { margin: 0 0 16px; font-size: 18px; font-family: "LinHai"; text-align: center; }

  table { width: 100%; border-collapse: collapse; font-size: 14px; }

  th, td { padding: 10px 8px; border-bottom: 1px solid rgba(60,50,28,.08); text-align: left; vertical-align: top; }

  a { color: rgba(60,50,28,.85); text-decoration: none; }

}

</style>

