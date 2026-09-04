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
        <form class="review-form" @submit.prevent="onSubmit">
          <input v-model.trim="form.name" type="text" :placeholder="t('reviews.nicknamePlaceholder')" />
          <textarea v-model.trim="form.content" rows="4" :placeholder="t('reviews.contentPlaceholder')"></textarea>
          <p class="compliance-hint">{{ t("reviews.compliance") }}</p>
          <p v-if="message" class="form-msg" :class="{ error: isError }">{{ message }}</p>
          <button class="submit-btn" type="submit" :disabled="submitting">
            {{ submitting ? t("reviews.submitting") : t("reviews.submit") }}
          </button>
        </form>
      </section>
      <section class="review-wall">
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
import { onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { getFeedbackList, submitFeedback } from "@/api/index"
import { usePageSeo } from "@/composables/usePageSeo"
import { hasMedicalClaim, sanitizeReviewDisplay } from "@/utils/reviewCompliance"

const { t } = useI18n()
usePageSeo({ titleKey: "seo.reviews.title", descriptionKey: "seo.reviews.description", h1Key: "reviews.h1" })

type ReviewItem = { id: number; name: string; content: string; createtime: number }

const list = ref<ReviewItem[]>([])
const loading = ref(true)
const submitting = ref(false)
const message = ref("")
const isError = ref(false)
const form = reactive({ name: "", content: "" })

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

const onSubmit = async () => {
  message.value = ""
  if (!form.name || !form.content) {
    isError.value = true
    message.value = t("reviews.required")
    return
  }
  if (hasMedicalClaim(form.name) || hasMedicalClaim(form.content)) {
    isError.value = true
    message.value = t("reviews.compliance")
    return
  }
  submitting.value = true
  try {
    const res: any = await submitFeedback({ name: form.name, content: form.content })
    if (res.code == 1) {
      isError.value = false
      message.value = t("reviews.success")
      form.name = ""
      form.content = ""
    } else {
      isError.value = true
      message.value = res.msg || t("reviews.fail")
    }
  } catch (e: any) {
    isError.value = true
    message.value = e?.msg || e?.message || t("reviews.fail")
  } finally {
    submitting.value = false
  }
}

onMounted(loadList)
</script>

<style lang="scss" scoped>
.page {
  padding-top: 52px;
  min-height: 60vh;
  background: #fcf8f4;
}
.page-banner {
  position: relative;
  img {
    width: 100%;
    height: 180px;
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
    font-size: 22px;
    color: #fff;
    font-family: "LinHai";
    letter-spacing: 0.1em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  }
}
.page-body {
  padding: 24px 16px 64px;
}
.lead {
  font-size: 14px;
  line-height: 1.75;
  color: rgba(60, 50, 28, 0.72);
  margin-bottom: 24px;
}
.muted {
  text-align: center;
  color: rgba(60, 50, 28, 0.45);
  font-size: 14px;
}
.review-wall {
  display: grid;
  gap: 12px;
  margin-top: 32px;
}
.review-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(60, 50, 28, 0.06);
}
.review-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(60, 50, 28, 0.55);
}
.review-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
}
.section-title {
  font-size: 18px;
  text-align: center;
  margin: 0 0 16px;
  font-family: "LinHai";
}
.review-form {
  padding: 20px 16px;
  background: #fff;
  border-radius: 10px;
  input,
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 12px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .form-msg {
    font-size: 13px;
    color: #2e7d32;
    &.error {
      color: #c62828;
    }
  }
  .compliance-hint {
    margin: -4px 0 10px;
    font-size: 12px;
    color: rgba(60, 50, 28, 0.45);
    line-height: 1.5;
  }
  .submit-btn {
    width: 100%;
    padding: 12px;
    background: rgba(60, 50, 28, 1);
    color: #fff;
    border: none;
    border-radius: 8px;
  }
}
</style>
