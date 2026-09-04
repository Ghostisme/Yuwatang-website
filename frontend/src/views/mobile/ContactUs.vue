<template>

  <div class="contact">

    <div class="contact-banner">

      <img src="@/assets/img/contact-banner.jpg" :alt="t('contactV2.h1')" />

      <h1 class="banner-tit">{{ t("contactV2.h1") }}</h1>

    </div>

    <div class="contact-box">

      <p class="lead">{{ t("contactV2.lead") }}</p>

      <div class="contact-card primary">

        <h3>{{ t("contactV2.emailLabel") }}</h3>

        <a :href="mailtoHref">tty12138@foxmail.com</a>

      </div>

      <div class="contact-card">

        <h3>{{ t("contactV2.social") }}</h3>

        <p class="muted">{{ t("contactV2.walkin") }}</p>

      </div>

      <section class="phone-table">

        <h2>{{ t("contactV2.storePhones") }}</h2>

        <div v-for="s in stores" :key="s.slug" class="phone-row">

          <strong>{{ s.name }}</strong>

          <p class="addr">{{ s.address }}</p>

          <a :href="`tel:${s.phone}`">{{ s.phone }}</a>

          <span>{{ s.hours }}</span>

        </div>

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

.contact { margin-top: 52px; background: #fcf8f4; padding-bottom: 48px; }

.contact-banner { position: relative;

  img { width: 100%; height: 160px; object-fit: cover; }

  .banner-tit { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; margin: 0; color: #fff; font-size: 22px; font-family: "LinHai"; }

}

.contact-box { padding: 20px 16px; }

.lead { font-size: 14px; line-height: 1.75; margin-bottom: 20px; }

.contact-card { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; text-align: center;

  h3 { margin: 0 0 10px; font-size: 15px; font-family: "LinHai"; }

  a { color: rgba(60,50,28,1); font-size: 16px; text-decoration: none; }

  .muted { margin: 0; font-size: 13px; color: rgba(60,50,28,.55); line-height: 1.6; }

}

.phone-table { background: #fff; border-radius: 10px; padding: 16px;

  h2 { font-size: 16px; text-align: center; margin: 0 0 12px; font-family: "LinHai"; }

  .phone-row { padding: 10px 0; border-bottom: 1px solid rgba(60,50,28,.08); font-size: 13px;

    strong { display: block; margin-bottom: 4px; }

    .addr { margin: 0 0 4px; color: rgba(60,50,28,.65); line-height: 1.5; }

    a { color: rgba(60,50,28,.85); text-decoration: none; }

    span { display: block; margin-top: 4px; color: rgba(60,50,28,.5); font-size: 12px; }

  }

}

</style>

