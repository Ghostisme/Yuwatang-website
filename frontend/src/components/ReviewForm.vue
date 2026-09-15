<template>
  <form class="review-form" @submit.prevent="onSubmit" novalidate>
    <div class="field" :class="{ invalid: !!errors.name }">
      <label class="label" for="review-name">{{ t("reviews.fields.name") }}</label>
      <input
        id="review-name"
        v-model="form.name"
        type="text"
        autocomplete="nickname"
        :maxlength="REVIEW_LIMITS.nameMax"
        :placeholder="t('reviews.nicknamePlaceholder')"
        @blur="touch('name')"
        @input="onInput('name')"
      />
      <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
      <p class="field-hint">{{ t("reviews.hints.name", { min: REVIEW_LIMITS.nameMin, max: REVIEW_LIMITS.nameMax }) }}</p>
    </div>

    <div class="field" :class="{ invalid: !!errors.phone }">
      <label class="label" for="review-phone">{{ t("reviews.fields.phone") }}</label>
      <input
        id="review-phone"
        v-model="form.phone"
        type="tel"
        inputmode="numeric"
        autocomplete="tel"
        :maxlength="REVIEW_LIMITS.phoneLen"
        :placeholder="t('reviews.phonePlaceholder')"
        @blur="touch('phone')"
        @input="onPhoneInput"
      />
      <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
      <p class="field-hint">{{ t("reviews.hints.phone") }}</p>
    </div>

    <div class="field" :class="{ invalid: !!errors.email }">
      <label class="label" for="review-email">{{ t("reviews.fields.email") }}</label>
      <input
        id="review-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        :maxlength="REVIEW_LIMITS.emailMax"
        :placeholder="t('reviews.emailPlaceholder')"
        @blur="touch('email')"
        @input="onEmailInput"
      />
      <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      <p class="field-hint">{{ t("reviews.hints.email") }}</p>
    </div>

    <div class="field" :class="{ invalid: !!errors.store_name }">
      <label class="label" for="review-store">{{ t("reviews.fields.store") }}</label>
      <select
        id="review-store"
        v-model="form.store_name"
        @blur="touch('store_name')"
        @change="onInput('store_name')"
      >
        <option value="">{{ t("reviews.storePlaceholder") }}</option>
        <option v-for="s in storeOptions" :key="s.slug" :value="s.name">{{ s.name }}</option>
      </select>
      <p v-if="errors.store_name" class="field-error">{{ errors.store_name }}</p>
    </div>

    <div class="field" :class="{ invalid: !!errors.content }">
      <label class="label" for="review-content">{{ t("reviews.fields.content") }}</label>
      <textarea
        id="review-content"
        v-model="form.content"
        :rows="rows"
        :maxlength="REVIEW_LIMITS.contentMax"
        :placeholder="t('reviews.contentPlaceholder')"
        @blur="touch('content')"
        @input="onInput('content')"
      ></textarea>
      <div class="field-meta">
        <p v-if="errors.content" class="field-error">{{ errors.content }}</p>
        <span class="char-count" :class="{ warn: form.content.trim().length > REVIEW_LIMITS.contentMax - 30 }">
          {{ form.content.trim().length }}/{{ REVIEW_LIMITS.contentMax }}
        </span>
      </div>
      <p class="field-hint">
        {{ t("reviews.hints.content", { min: REVIEW_LIMITS.contentMin, max: REVIEW_LIMITS.contentMax }) }}
      </p>
    </div>

    <p class="compliance-hint">{{ t("reviews.compliance") }}</p>
    <p v-if="message" class="form-msg" :class="{ error: isError }" role="alert">{{ message }}</p>

    <button class="submit-btn" type="submit" :disabled="submitting">
      {{ submitting ? t("reviews.submitting") : t("reviews.submit") }}
    </button>
  </form>
</template>

<script lang="ts">
export default { name: "ReviewForm" }
</script>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { submitFeedback } from "@/api/index"
import { loadStoreRows, localizeStore } from "@/config/stores"
import {
  REVIEW_LIMITS,
  normalizeEmail,
  normalizePhone,
  validateReviewField,
  validateReviewForm,
  type ReviewField,
  type ReviewFormValues
} from "@/utils/reviewFormValidate"

withDefaults(
  defineProps<{
    rows?: number
  }>(),
  { rows: 5 }
)

const emit = defineEmits<{
  success: []
}>()

const { t, locale } = useI18n()

const form = reactive<ReviewFormValues>({
  name: "",
  phone: "",
  email: "",
  store_name: "",
  content: ""
})

const touched = reactive<Record<ReviewField, boolean>>({
  name: false,
  phone: false,
  email: false,
  store_name: false,
  content: false
})

const submitting = ref(false)
const message = ref("")
const isError = ref(false)
const storeOptions = ref<Array<{ slug: string; name: string }>>([])

const errors = computed(() => {
  const next: Partial<Record<ReviewField, string>> = {}
  ;(["name", "phone", "email", "store_name", "content"] as ReviewField[]).forEach((field) => {
    if (!touched[field]) return
    const msg = validateReviewField(field, form, t)
    if (msg) next[field] = msg
  })
  return next
})

const loadStores = async () => {
  const rows = await loadStoreRows()
  storeOptions.value = rows.map((row) => {
    const s = localizeStore(row, locale.value)
    return { slug: s.slug, name: s.name }
  })
}

watch(locale, loadStores)

const touch = (field: ReviewField) => {
  touched[field] = true
}

const onInput = (field: ReviewField) => {
  // 手机/邮箱联动：改其中一个时刷新另一个的错误态
  if (field === "phone" || field === "email") {
    if (touched.phone) touched.phone = true
    if (touched.email) touched.email = true
  }
  if (message.value && isError.value) message.value = ""
}

const onPhoneInput = () => {
  form.phone = normalizePhone(form.phone).slice(0, REVIEW_LIMITS.phoneLen)
  onInput("phone")
}

const onEmailInput = () => {
  form.email = normalizeEmail(form.email).slice(0, REVIEW_LIMITS.emailMax)
  onInput("email")
}

const resetTouched = () => {
  touched.name = false
  touched.phone = false
  touched.email = false
  touched.store_name = false
  touched.content = false
}

const onSubmit = async () => {
  message.value = ""
  touched.name = true
  touched.phone = true
  touched.email = true
  touched.store_name = true
  touched.content = true

  const result = validateReviewForm(form, t)
  if (!result.ok) {
    const firstField = (["name", "phone", "email", "store_name", "content"] as ReviewField[]).find(
      (f) => result.errors[f]
    )
    if (firstField) {
      document.getElementById(`review-${firstField === "store_name" ? "store" : firstField}`)?.focus()
    }
    return
  }

  submitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      phone: normalizePhone(form.phone),
      email: normalizeEmail(form.email),
      store_name: form.store_name.trim(),
      content: form.content.trim()
    }
    const res: any = await submitFeedback(payload)
    if (res.code == 1) {
      isError.value = false
      message.value = t("reviews.success")
      form.name = ""
      form.phone = ""
      form.email = ""
      form.store_name = ""
      form.content = ""
      resetTouched()
      emit("success")
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

onMounted(loadStores)
</script>

<style lang="scss" scoped>
.review-form {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(60, 50, 28, 0.06);
}

.field {
  margin-bottom: 14px;
  &.invalid {
    input,
    textarea,
    select {
      border-color: rgba(198, 40, 40, 0.55);
    }
  }
}

.label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: rgba(60, 50, 28, 0.72);
  font-family: "LinHai";
}

input,
textarea,
select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: inherit;
  background: #fff;
  color: rgba(60, 50, 28, 0.9);
  outline: none;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: rgba(122, 86, 54, 0.55);
  }
}

select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, rgba(60, 50, 28, 0.45) 50%),
    linear-gradient(135deg, rgba(60, 50, 28, 0.45) 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 36px;
}

.field-error {
  margin: 6px 0 0;
  font-size: 12px;
  color: #c62828;
  line-height: 1.4;
}

.field-hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(60, 50, 28, 0.4);
  line-height: 1.4;
}

.field-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
  .field-error {
    margin: 0;
    flex: 1;
  }
}

.char-count {
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(60, 50, 28, 0.38);
  &.warn {
    color: rgba(122, 86, 54, 0.85);
  }
}

.compliance-hint {
  margin: 4px 0 12px;
  font-size: 12px;
  color: rgba(60, 50, 28, 0.45);
  line-height: 1.5;
}

.form-msg {
  margin: 0 0 12px;
  font-size: 14px;
  color: #2e7d32;
  &.error {
    color: #c62828;
  }
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: rgba(60, 50, 28, 1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .review-form {
    padding: 20px 16px;
  }
}
</style>
