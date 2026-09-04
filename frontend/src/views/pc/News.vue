<template>
  <div class="news">
    <div class="news-banner">
      <img src="@/assets/img/contact-banner.jpg" :alt="t('news.title')" />
      <div class="banner-tit"><h1 class="banner-h1">{{ t("news.title") }}</h1></div>
    </div>
    <div class="news-content">
      <div v-if="loading" class="news-empty">{{ t("news.loading") }}</div>
      <div v-else-if="!articleList.length" class="news-empty">{{ t("news.empty") }}</div>
      <div v-else class="news-grid">
        <div class="news-card" v-for="item in articleList" :key="item.id" @click="goDetail(item.id)">
          <div class="card-img">
            <img v-if="item.image" :src="item.image" :alt="item.article_title" />
            <div v-else class="card-img-placeholder"></div>
          </div>
          <div class="card-info">
            <h3>{{ item.article_title }}</h3>
            <p>{{ getSummary(item.content) }}</p>
            <span class="card-date">{{ formatDate(item.datetime || item.createtime) }}</span>
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
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { getArticleList } from "@/api/index"
import { usePageSeo } from "@/composables/usePageSeo"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.news.title", descriptionKey: "seo.news.description", h1Key: "news.title" })
const router = useRouter()
const articleList = ref<any[]>([])
const page = ref(1)
const limit = ref(9)
const total = ref(0)
const loading = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()

const getSummary = (content = "") => {
  const text = stripHtml(content)
  return text.length > 80 ? text.slice(0, 80) + "..." : text
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
        articleList.value = res.data?.data || []
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
  margin-top: 88px;
  min-height: calc(100vh - 383px);
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
      font-size: 38px;
      line-height: 48px;
      text-align: center;
      color: #fff;
      font-weight: 400;
      .banner-h1 {
        margin: 0;
        font: inherit;
        font-weight: inherit;
      }
    }
  }
  &-content {
    max-width: 1407px;
    padding: 60px 25px;
    margin: 0 auto;
  }
  &-empty {
    text-align: center;
    color: rgba(60, 50, 28, 0.6);
    padding: 80px 0;
    font-size: 16px;
  }
  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  .news-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    }
    .card-img {
      height: 200px;
      overflow: hidden;
      background: #f5f0ea;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      &-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f5f0ea, #ebe3d8);
      }
    }
    .card-info {
      padding: 24px;
      h3 {
        margin: 0 0 12px;
        font-size: 20px;
        line-height: 1.4;
        color: rgba(60, 50, 28, 1);
        font-weight: 500;
      }
      p {
        margin: 0 0 16px;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(60, 50, 28, 0.7);
        min-height: 66px;
      }
      .card-date {
        font-size: 13px;
        color: rgba(60, 50, 28, 0.45);
      }
    }
  }
  &-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 48px;
    .page-btn {
      padding: 10px 24px;
      border: 1px solid rgba(60, 50, 28, 0.3);
      border-radius: 6px;
      background: transparent;
      color: rgba(60, 50, 28, 1);
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover:not(:disabled) {
        background: rgba(60, 50, 28, 0.05);
        border-color: rgba(60, 50, 28, 0.6);
      }
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
    .page-info {
      color: rgba(60, 50, 28, 0.7);
      font-size: 14px;
    }
  }
}
@media (max-width: 1100px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
