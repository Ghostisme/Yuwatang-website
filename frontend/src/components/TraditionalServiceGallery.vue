<template>
  <div class="traditional-gallery">
    <article v-for="(item, index) in traditionalServices" :key="item.slug" class="traditional-item">
      <router-link
        class="traditional-media-link"
        :to="serviceLink(item.slug)"
        :aria-label="`${t('services.viewDetails')} · ${t(item.nameKey)}`"
      >
        <ServiceMedia :service="item" />
      </router-link>
      <div class="traditional-info">
        <span class="traditional-number" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
        <h2><router-link :to="serviceLink(item.slug)">{{ t(item.nameKey) }}</router-link></h2>
        <p class="traditional-summary">{{ t(item.summaryKey) }}</p>
        <div class="traditional-description" v-html="t(item.bodyKey)"></div>
        <router-link class="traditional-detail-link" :to="serviceLink(item.slug)">
          {{ t("services.viewDetails") }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { traditionalServices } from "@/config/services"
import ServiceMedia from "@/components/ServiceMedia.vue"

const { t, locale } = useI18n()
const serviceLink = (slug: string) => ({ path: `/services/${slug}`, query: { lang: locale.value } })
</script>

<style scoped lang="scss">
.traditional-gallery {
  margin-top: 48px;
}
.traditional-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 56px;
  padding: 36px 0;
  & + & {
    margin-top: 24px;
    border-top: 1px solid var(--pm-line);
  }
  &:nth-child(even) {
    .traditional-media-link {
      order: 2;
    }
    .traditional-info {
      order: 1;
    }
  }
}
.traditional-media-link {
  display: block;
  min-width: 0;
  border-radius: 12px;
  &:hover :deep(img) {
    transform: scale(1.045);
  }
}
.traditional-info {
  min-width: 0;
}
.traditional-number {
  display: block;
  margin-bottom: 12px;
  color: #ac8a5c;
  font-family: Georgia, serif;
  font-size: 28px;
}
h2 {
  margin: 0 0 16px;
  font-family: "LinHai", var(--font-zh);
  font-size: 28px;
  line-height: 1.4;
  a {
    color: var(--pm-ink);
  }
}
.traditional-summary {
  margin: 0 0 16px;
  color: #7a5636;
  font-size: 17px;
  line-height: 1.8;
}
.traditional-description {
  color: rgba(60, 50, 28, 0.76);
  font-size: 15px;
  line-height: 1.9;
  :deep(p) {
    margin: 0 0 12px;
  }
}
.traditional-detail-link {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  min-height: 44px;
  margin-top: 12px;
  border-bottom: 1px solid rgba(122, 86, 54, 0.4);
  color: var(--pm-ink);
  font-size: 15px;
  transition: color 0.2s ease, border-color 0.2s ease;
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    color: #7a5636;
    border-color: #7a5636;
  }
}
a:focus-visible {
  outline: 2px solid #947348;
  outline-offset: 6px;
}
@media (max-width: 1024px) {
  .traditional-item {
    gap: 32px;
  }
}
@media (max-width: 768px) {
  .traditional-gallery {
    margin-top: 28px;
  }
  .traditional-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    padding: 24px 0;
    & + & {
      margin-top: 12px;
    }
    &:nth-child(even) {
      .traditional-media-link,
      .traditional-info {
        order: initial;
      }
    }
  }
  .traditional-number {
    margin-bottom: 8px;
    font-size: 24px;
  }
  h2 {
    margin-bottom: 12px;
    font-size: 24px;
  }
  .traditional-summary {
    font-size: 16px;
  }
  .traditional-description {
    font-size: 14px;
    line-height: 1.8;
  }
}
</style>
