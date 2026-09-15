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
        <ReviewForm :rows="5" @success="onSubmitSuccess" />
      </section>

      <section class="review-wall" aria-label="客户反馈展示">
        <p v-if="initialLoading" class="muted">{{ t("reviews.loading") }}</p>
        <p v-else-if="!list.length" class="muted">{{ t("reviews.empty") }}</p>
        <template v-else>
          <div class="review-list" :class="{ fetching: fetching }">
            <article v-for="item in list" :key="item.id" class="review-card">
              <header class="review-meta">
                <strong>{{ item.name || t("reviews.anonymous") }}</strong>
                <time>{{ formatDate(item.createtime) }}</time>
              </header>
              <p class="review-text">{{ item.content }}</p>
            </article>
          </div>
          <div class="review-pagination" v-if="total > limit">
            <button
              class="page-btn"
              type="button"
              :disabled="page <= 1 || fetching"
              @click="changePage(page - 1)"
            >
              {{ t("reviews.prev") }}
            </button>
            <span class="page-info">{{ page }} / {{ totalPages }}</span>
            <button
              class="page-btn"
              type="button"
              :disabled="page >= totalPages || fetching"
              @click="changePage(page + 1)"
            >
              {{ t("reviews.next") }}
            </button>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { getFeedbackList } from "@/api/index"
import { usePageSeo } from "@/composables/usePageSeo"
import { sanitizeReviewDisplay } from "@/utils/reviewCompliance"
import ReviewForm from "@/components/ReviewForm.vue"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.reviews.title", descriptionKey: "seo.reviews.description", h1Key: "reviews.h1" })

type ReviewItem = { id: number; name: string; content: string; createtime: number; status?: number }

const list = ref<ReviewItem[]>([])
const initialLoading = ref(true)
const fetching = ref(false)
const page = ref(1)
const limit = ref(5)
const total = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

const formatDate = (ts: number) => {
  if (!ts) return ""
  const d = new Date(ts * 1000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const loadList = async (opts: { silent?: boolean } = {}) => {
  const silent = !!opts.silent && list.value.length > 0
  if (silent) fetching.value = true
  else initialLoading.value = true

  try {
    const res: any = await getFeedbackList({ page: page.value, limit: limit.value })
    const raw = (res?.data?.list || []).filter(
      (item: any) => item.status === undefined || Number(item.status) === 1
    )
    list.value = raw.map((item: ReviewItem) => ({
      ...item,
      content: sanitizeReviewDisplay(item.content)
    }))
    total.value = Number(res?.data?.total) || 0
  } catch {
    if (!silent) {
      list.value = []
      total.value = 0
    }
  } finally {
    initialLoading.value = false
    fetching.value = false
  }
}

const changePage = (p: number) => {
  if (p < 1 || p > totalPages.value || fetching.value) return
  page.value = p
  loadList({ silent: true })
}

const onSubmitSuccess = () => {
  page.value = 1
  loadList({ silent: true })
}

onMounted(() => loadList())
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
.review-list {
  display: grid;
  gap: 16px;
  &.fetching {
    pointer-events: none;
  }
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
.review-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  padding-top: 8px;
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
</style>
