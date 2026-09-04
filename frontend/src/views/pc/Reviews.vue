<template>
  <div class="page reviews">
    <div class="page-banner">
      <img src="@/assets/img/contact-banner.jpg" :alt="t('reviews.h1')" />
      <h1 class="banner-tit">{{ t("reviews.h1") }}</h1>
    </div>
    <div class="page-body">
      <p class="lead">{{ t("reviews.lead") }}</p>

      <section class="review-form-wrap">
        <h2 class="section-title">{{ t("reviews.formTitle") }}</h2>
        <ReviewForm :rows="5" @success="loadList" />
      </section>

      <section class="review-wall" aria-label="客户反馈展示">
        <p v-if="loading" class="muted">{{ t("reviews.loading") }}</p>
        <p v-else-if="!list.length" class="muted">{{ t("reviews.empty") }}</p>
        <article v-for="item in list" :key="item.id" class="review-card">
          <header class="review-meta">
            <strong>{{ item.name || t("reviews.anonymous") }}</strong>
            <time>{{ formatDate(item.createtime) }}</time>
          </header>
          <p class="review-text">{{ item.content }}</p>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { getFeedbackList } from "@/api/index"
import { usePageSeo } from "@/composables/usePageSeo"
import { sanitizeReviewDisplay } from "@/utils/reviewCompliance"
import ReviewForm from "@/components/ReviewForm.vue"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.reviews.title", descriptionKey: "seo.reviews.description", h1Key: "reviews.h1" })

type ReviewItem = { id: number; name: string; content: string; createtime: number }

const list = ref<ReviewItem[]>([])
const loading = ref(true)

const formatDate = (ts: number) => {
  if (!ts) return ""
  const d = new Date(ts * 1000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const loadList = async () => {
  loading.value = true
  try {
    const res: any = await getFeedbackList({ page: 1, limit: 50 })
    const raw = res?.data?.list || []
    list.value = raw.map((item: ReviewItem) => ({
      ...item,
      content: sanitizeReviewDisplay(item.content)
    }))
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.page {
  padding-top: 88px;
  min-height: 60vh;
  background: #fcf8f4;
}
.page-banner {
  position: relative;
  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    display: block;
  }
  .banner-tit {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    font-size: 36px;
    color: #fff;
    font-family: "LinHai";
    letter-spacing: 0.12em;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }
}
.page-body {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 96px;
}
.lead {
  text-align: center;
  color: rgba(60, 50, 28, 0.72);
  line-height: 1.8;
  margin-bottom: 40px;
  font-family: "LinHai";
}
.muted {
  text-align: center;
  color: rgba(60, 50, 28, 0.45);
}
.review-wall {
  display: grid;
  gap: 16px;
  margin-top: 48px;
}
.review-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
}
.review-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: rgba(60, 50, 28, 0.55);
  font-size: 13px;
  strong {
    color: rgba(60, 50, 28, 0.9);
  }
}
.review-text {
  margin: 0;
  line-height: 1.75;
  color: rgba(60, 50, 28, 0.8);
}
.section-title {
  text-align: center;
  font-size: 22px;
  margin: 0 0 24px;
  color: rgba(60, 50, 28, 1);
  font-family: "LinHai";
}
</style>
