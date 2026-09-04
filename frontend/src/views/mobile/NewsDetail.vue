<template>
  <div class="news-detail">
    <div class="news-detail-inner" v-if="detail">
      <h1 class="title">{{ detail.article_title }}</h1>
      <div class="meta">
        <span v-if="detail.datetime || detail.createtime">{{ formatDate(detail.datetime || detail.createtime) }}</span>
      </div>
      <div class="cover" v-if="detail.image">
        <img :src="detail.image" :alt="detail.article_title" />
      </div>
      <div class="content" v-html="detail.content"></div>
      <button class="back-btn" @click="goBack">{{ t("news.back") }}</button>
    </div>
    <div class="news-empty" v-else-if="!loading">{{ t("news.empty") }}</div>
    <div class="news-empty" v-else>{{ t("news.loading") }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { getArticleDetail } from "@/api/index"
import {
  articleSeoDescription,
  articleSeoTitle,
  useArticleJsonLd,
  useDynamicPageSeo
} from "@/composables/usePageSeo"
import { useBreadcrumbJsonLd } from "@/composables/useStructuredData"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const detail = ref<any>(null)
const loading = ref(false)

const pageMeta = computed(() => {
  if (!detail.value) return { title: "", description: "" }
  return {
    title: articleSeoTitle(detail.value.article_title),
    description: articleSeoDescription(detail.value.content)
  }
})
useDynamicPageSeo(pageMeta)
useArticleJsonLd(() => detail.value)
useBreadcrumbJsonLd(
  computed(() =>
    detail.value
      ? [
          { name: t("nav.home"), path: "/" },
          { name: t("nav.news"), path: "/news" },
          { name: detail.value.article_title, path: `/news/${route.params.id}` }
        ]
      : [
          { name: t("nav.home"), path: "/" },
          { name: t("nav.news"), path: "/news" }
        ]
  )
)

const formatDate = (value: string | number) => {
  if (!value) return ""
  if (typeof value === "number" || /^\d+$/.test(String(value))) {
    const d = new Date(Number(value) * (String(value).length === 10 ? 1000 : 1))
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  return String(value).slice(0, 16)
}

const fetchDetail = () => {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  getArticleDetail(id)
    .then((res: any) => {
      if (res.code == 1) {
        detail.value = res.data
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const goBack = () => router.push("/news")

onMounted(fetchDetail)
watch(() => route.params.id, fetchDetail)
</script>

<style lang="scss" scoped>
.news-detail {
  margin-top: 52px;
  min-height: calc(100vh - 240px);
  background: rgba(255, 252, 250, 1);
  &-inner {
    padding: 20px 15px 40px;
  }
  .title {
    margin: 0 0 10px;
    font-size: 20px;
    line-height: 1.4;
    color: rgba(60, 50, 28, 1);
    font-weight: 500;
  }
  .meta {
    margin-bottom: 16px;
    font-size: 12px;
    color: rgba(60, 50, 28, 0.5);
  }
  .cover {
    margin-bottom: 18px;
    img {
      width: 100%;
      display: block;
      border-radius: 8px;
    }
  }
  .content {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(60, 50, 28, 0.9);
    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }
  .back-btn {
    margin-top: 28px;
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid rgba(60, 50, 28, 0.3);
    background: transparent;
    color: rgba(60, 50, 28, 1);
    font-size: 14px;
    &:active {
      background: rgba(60, 50, 28, 0.08);
    }
  }
  .news-empty {
    text-align: center;
    padding: 80px 0;
    color: rgba(60, 50, 28, 0.6);
    font-size: 14px;
  }
}
</style>
