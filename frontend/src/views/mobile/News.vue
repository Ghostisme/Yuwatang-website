<template>
  <div class="news">
    <PageBanner page="news" />
    <div class="news-content">
      <div v-if="loading" class="news-empty">{{ t("news.loading") }}</div>
      <div v-else-if="!articleList.length" class="news-empty">{{ t("news.empty") }}</div>
      <div v-else class="news-list">
        <div class="news-item" v-for="item in articleList" :key="item.id" @click="goDetail(item.id)">
          <div class="item-media">
            <img v-if="item.image" :src="item.image" class="item-img" :alt="item.article_title" />
            <div v-else class="item-img placeholder"></div>
          </div>
          <div class="item-info">
            <h3>{{ item.article_title }}</h3>
            <p>{{ getSummary(item.content) }}</p>
            <span class="item-date">{{ formatDate(item.datetime || item.createtime) }}</span>
          </div>
        </div>
      </div>
      <div class="news-pagination" v-if="total > limit">
        <button class="page-btn" :disabled="page <= 1" @click="changePage(page - 1)">{{ t("news.prev") }}</button>
        <span class="page-info">{{ page }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="page >= totalPages" @click="changePage(page + 1)">{{ t("news.next") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageBanner from "@/components/PageBanner.vue"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { getArticleList } from "@/api/index"
import { usePageSeo } from "@/composables/usePageSeo"
import { localizeArticle, type ArticleApiRow } from "@/utils/localizeArticle"

const { t, locale } = useI18n()
usePageSeo({ titleKey: "seo.news.title", descriptionKey: "seo.news.description", h1Key: "pageBanners.news" })
const router = useRouter()
const rawList = ref<ArticleApiRow[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const articleList = computed(() =>
  rawList.value.map((row) => localizeArticle(row, String(locale.value)))
)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()

const getSummary = (content = "") => {
  const text = stripHtml(content)
  return text.length > 60 ? text.slice(0, 60) + "..." : text
}

const formatDate = (value: string | number) => {
  if (!value) return ""
  if (typeof value === "number" || /^\d+$/.test(String(value))) {
    const d = new Date(Number(value) * (String(value).length === 10 ? 1000 : 1))
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  return String(value).slice(0, 10)
}

const fetchList = () => {
  loading.value = true
  getArticleList({ project_id: -1, page: page.value, limit: limit.value })
    .then((res: any) => {
      if (res.code == 1) {
        rawList.value = res.data?.data || []
        total.value = res.data?.total || 0
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const changePage = (p: number) => {
  page.value = p
  fetchList()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

const goDetail = (id: number) => {
  router.push(`/news/${id}`)
}

onMounted(fetchList)
</script>

<style lang="scss" scoped>
.news {
  margin-top: 52px;
  min-height: calc(100vh - 240px);
  background: rgba(255, 252, 250, 1);
  &-content {
    padding: 20px 15px 40px;
  }
  &-empty {
    text-align: center;
    color: rgba(60, 50, 28, 0.6);
    padding: 40px 0;
    font-size: 14px;
  }
  &-list {
    display: grid;
    gap: 16px;
  }
  .news-item {
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    .item-media {
      aspect-ratio: 16 / 9;
      flex-shrink: 0;
      overflow: hidden;
    }
    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      &.placeholder {
        background: linear-gradient(135deg, #f5f0ea, #ebe3d8);
      }
    }
    .item-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 18px 16px;
    }
    h3 {
      margin: 0 0 12px;
      height: 3em;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      overflow-wrap: anywhere;
      font-size: 18px;
      color: rgba(60, 50, 28, 1);
      line-height: 1.5;
    }
    p {
      margin: 0 0 16px;
      height: 5.1em;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      overflow-wrap: anywhere;
      font-size: 14px;
      color: rgba(60, 50, 28, 0.7);
      line-height: 1.7;
    }
    .item-date {
      margin-top: auto;
      font-size: 12px;
      color: rgba(60, 50, 28, 0.45);
    }
  }
  &-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    .page-btn {
      padding: 8px 16px;
      border: 1px solid rgba(60, 50, 28, 0.3);
      border-radius: 6px;
      background: transparent;
      color: rgba(60, 50, 28, 1);
      font-size: 13px;
      &:disabled {
        opacity: 0.4;
      }
      &:active:not(:disabled) {
        background: rgba(60, 50, 28, 0.08);
      }
    }
    .page-info {
      font-size: 13px;
      color: rgba(60, 50, 28, 0.7);
    }
  }
}
</style>
