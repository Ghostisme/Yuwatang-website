<template>
  <div class="store-detail-body" v-if="store">
    <div class="hero" v-if="store.image">
      <img :src="store.image" :alt="store.name" />
    </div>

    <h1 class="page-h1">{{ store.name }}</h1>
    <p class="tagline">{{ store.tagline }}</p>

    <div class="info-card">
      <p><strong>{{ t("stores.address") }}</strong>{{ store.address }}</p>
      <p><strong>{{ t("stores.metro") }}</strong>{{ store.metro }}</p>
      <p><strong>{{ t("stores.phone") }}</strong><a :href="getTelUrl(store.phone)">{{ store.phone }}</a></p>
      <p><strong>{{ t("stores.hours") }}</strong>{{ store.hours }}</p>
    </div>

    <section class="block">
      <h2>{{ t("stores.servicesTitle") }}</h2>
      <div class="chip-row">
        <router-link
          v-for="slug in store.serviceSlugs"
          :key="slug"
          class="chip"
          :to="`/services/${slug}`"
        >
          {{ t(`services.${slug}.name`) }}
        </router-link>
      </div>
      <p class="hint">{{ t("stores.servicesHint") }}</p>
    </section>

    <section class="block">
      <h2>{{ t("stores.facilitiesTitle") }}</h2>
      <ul class="facility-list">
        <li v-for="key in store.facilityKeys" :key="key">{{ t(`stores.facilities.${key}`) }}</li>
      </ul>
    </section>

    <section class="block">
      <h2>{{ t("stores.directionsTitle") }}</h2>
      <p class="directions">{{ store.directions }}</p>
      <a class="map-link" :href="mapUrl" target="_blank" rel="noopener noreferrer">
        {{ t("stores.mapCta") }}
      </a>
    </section>

    <div class="intro">{{ store.intro }}</div>

    <div class="actions">
      <a class="cta" :href="mapUrl" target="_blank" rel="noopener noreferrer">{{ t("stores.mapCta") }}</a>
      <a class="cta outline" :href="getTelUrl(store.phone)">{{ t("stores.callCta") }}</a>
      <a class="cta" :href="mailtoHref">{{ t("stores.emailCta") }}</a>
      <button class="back" type="button" @click="router.push('/stores')">{{ t("stores.back") }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import type { StoreInfo } from "@/config/stores"
import { getAmapSearchUrl, getTelUrl } from "@/utils/storeLinks"

const props = defineProps<{ store: StoreInfo }>()

const router = useRouter()
const { t } = useI18n()

const mapUrl = computed(() => getAmapSearchUrl(props.store.name, props.store.address))

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`${t("contactV2.emailSubject")} - ${props.store.name}`)
  return `mailto:tty12138@foxmail.com?subject=${subject}`
})
</script>

<style lang="scss" scoped>
.store-detail-body {
  max-width: 800px;
  margin: 0 auto;
}
.hero {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.08);
  img {
    width: 100%;
    display: block;
    max-height: 320px;
    object-fit: cover;
  }
}
.page-h1 {
  text-align: center;
  font-family: "LinHai";
  font-size: 30px;
  margin: 0 0 12px;
  color: #3c321c;
}
.tagline {
  text-align: center;
  color: rgba(60, 50, 28, 0.72);
  margin: 0 0 28px;
  line-height: 1.6;
}
.info-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 28px;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
  p {
    margin: 0 0 10px;
    line-height: 1.6;
    color: rgba(60, 50, 28, 0.82);
    &:last-child {
      margin-bottom: 0;
    }
  }
  strong {
    margin-right: 6px;
    color: #3c321c;
  }
  a {
    color: #6a5638;
  }
}
.block {
  margin-bottom: 28px;
  h2 {
    font-family: "LinHai";
    font-size: 22px;
    margin: 0 0 14px;
    color: #3c321c;
  }
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}
.chip {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: #f3ebe1;
  color: #3c321c;
  text-decoration: none;
  font-size: 13px;
}
.hint {
  margin: 0;
  color: rgba(60, 50, 28, 0.55);
  font-size: 13px;
  line-height: 1.6;
}
.facility-list {
  margin: 0;
  padding-left: 1.2em;
  color: rgba(60, 50, 28, 0.8);
  line-height: 1.8;
}
.directions {
  line-height: 1.75;
  color: rgba(60, 50, 28, 0.78);
  margin: 0 0 12px;
}
.map-link {
  color: #6a5638;
}
.intro {
  line-height: 1.85;
  color: rgba(60, 50, 28, 0.8);
  margin: 8px 0 28px;
  white-space: pre-wrap;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
}
.cta,
.back {
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}
.cta {
  background: linear-gradient(135deg, #6a5638, #3c321c);
  color: #fff8ee;
}
.cta.outline {
  background: transparent;
  border: 1px solid rgba(60, 50, 28, 0.25);
  color: #3c321c;
}
.back {
  background: #efe6da;
  color: #3c321c;
}
</style>
