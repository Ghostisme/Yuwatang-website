<template>
  <div class="faq-body" :class="{ compact }">
    <p class="lead">{{ t("faq.intro") }}</p>

    <section class="faq-group" aria-labelledby="faq-general">
      <h2 id="faq-general" class="group-title">{{ t("faq.groupGeneral") }}</h2>
      <div class="faq-list">
        <details
          v-for="(item, index) in generalItems"
          :key="'g-' + index"
          class="faq-item"
          :open="openIndex === index"
          @toggle="onToggle(index, $event)"
        >
          <summary>
            <span class="q-num">Q{{ index + 1 }}</span>
            <span class="q-text">{{ item.q }}</span>
          </summary>
          <p class="answer">{{ item.a }}</p>
        </details>
      </div>
    </section>

    <section class="faq-group" aria-labelledby="faq-overseas">
      <h2 id="faq-overseas" class="group-title">{{ t("faq.groupOverseas") }}</h2>
      <div class="faq-list">
        <details
          v-for="(item, index) in overseasItems"
          :key="'o-' + index"
          class="faq-item"
          :open="openIndex === FAQ_GENERAL_COUNT + index"
          @toggle="onToggle(FAQ_GENERAL_COUNT + index, $event)"
        >
          <summary>
            <span class="q-num">Q{{ FAQ_GENERAL_COUNT + index + 1 }}</span>
            <span class="q-text">{{ item.q }}</span>
          </summary>
          <p class="answer">{{ item.a }}</p>
        </details>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { FAQ_GENERAL_COUNT } from "@/config/faq"
import faqZh from "@/locales/faq-zh"
import faqEn from "@/locales/faq-en"
import faqJp from "@/locales/faq-jp"
import { resolveI18nLeaf } from "@/utils/i18nSafe"
import { useFaqPageJsonLd, usePageSeo } from "@/composables/usePageSeo"
import { useBreadcrumbJsonLd } from "@/composables/useStructuredData"

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const { t, locale } = useI18n()
usePageSeo({ titleKey: "seo.faq.title", descriptionKey: "seo.faq.description", h1Key: "faq.h1" })
useBreadcrumbJsonLd(
  computed(() => [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.faq"), path: "/faq" }
  ])
)

/** 直接读 locale 源模块；若曾被 i18n 污染则用 resolveI18nLeaf 解包 */
const faqPacks = { zh: faqZh, en: faqEn, jp: faqJp } as const
const allItems = computed(() => {
  const pack = faqPacks[(locale.value as keyof typeof faqPacks) || "zh"] || faqZh
  return (pack.items || []).map((item) => ({
    q: resolveI18nLeaf(item.q),
    a: resolveI18nLeaf(item.a)
  }))
})

const generalItems = computed(() => allItems.value.slice(0, FAQ_GENERAL_COUNT))
const overseasItems = computed(() => allItems.value.slice(FAQ_GENERAL_COUNT))

useFaqPageJsonLd(() => allItems.value)

const openIndex = ref<number | null>(0)

const onToggle = (index: number, event: Event) => {
  const el = event.currentTarget as HTMLDetailsElement
  if (el.open) openIndex.value = index
  else if (openIndex.value === index) openIndex.value = null
}
</script>

<style lang="scss" scoped>
.faq-body {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  &.compact {
    padding: 28px 16px 56px;
    .lead {
      font-size: 13px;
      margin-bottom: 28px;
    }
    .group-title {
      font-size: 20px;
    }
    .faq-item summary {
      padding: 14px;
      font-size: 14px;
    }
    .answer {
      padding: 0 14px 16px 52px;
      font-size: 13px;
    }
  }
}
.lead {
  text-align: center;
  line-height: 1.8;
  color: rgba(60, 50, 28, 0.75);
  margin: 0 0 36px;
  font-size: 15px;
}
.faq-group + .faq-group {
  margin-top: 40px;
}
.group-title {
  margin: 0 0 16px;
  font-family: "LinHai";
  font-size: 24px;
  color: rgba(60, 50, 28, 1);
  text-align: center;
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.faq-item {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(60, 50, 28, 0.06);
  overflow: hidden;
  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 18px 20px;
    font-family: "LinHai";
    font-size: 16px;
    color: rgba(60, 50, 28, 1);
    line-height: 1.5;
    &::-webkit-details-marker {
      display: none;
    }
    &::after {
      content: "+";
      margin-left: auto;
      flex-shrink: 0;
      color: rgba(122, 86, 54, 0.7);
      font-size: 18px;
      line-height: 1;
    }
  }
  &[open] summary::after {
    content: "–";
  }
}
.q-num {
  flex-shrink: 0;
  color: rgba(122, 86, 54, 1);
  min-width: 2.2em;
}
.q-text {
  flex: 1;
}
.answer {
  margin: 0;
  padding: 0 20px 18px 72px;
  line-height: 1.8;
  color: rgba(60, 50, 28, 0.78);
  font-size: 14px;
}
</style>
