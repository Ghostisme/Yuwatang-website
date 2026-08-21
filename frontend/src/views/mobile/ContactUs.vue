<template>
  <div class="contact">
    <div class="contact-banner">
      <img src="@/assets/img/contact-banner.jpg" alt="" />
    </div>
    <div class="banner-tit">{{ t("contact.item6") }}</div>
    <div class="contact-box" style="padding: 0 15px">
      <div class="contact-title">{{ t("contact.item1") }}</div>
      <div class="contact-cards">
        <div class="contact-card">
          <div class="card-icon phone-icon">📞</div>
          <h3>{{ t("contact.item2") }}</h3>
          <div class="contact-link" @click="makePhoneCall('18895366320')">+86-18895366320</div>
        </div>
        <div class="contact-card">
          <div class="card-icon email-icon">✉️</div>
          <h3>{{ t("contact.item4") }}</h3>
          <div class="contact-link">tty12138@foxmail.com</div>
        </div>
      </div>

      <form class="feedback-form" @submit.prevent="onSubmit">
        <h3 class="form-title">{{ t("contact.feedbackTitle") }}</h3>
        <input v-model.trim="form.name" type="text" :placeholder="t('contact.namePlaceholder')" />
        <input v-model.trim="form.phone" type="tel" :placeholder="t('contact.phonePlaceholder')" />
        <input v-model.trim="form.store_name" type="text" :placeholder="t('contact.storePlaceholder')" />
        <textarea v-model.trim="form.content" rows="4" :placeholder="t('contact.contentPlaceholder')"></textarea>
        <p v-if="message" class="form-msg" :class="{ error: isError }">{{ message }}</p>
        <button class="submit-btn" type="submit" :disabled="submitting">
          {{ submitting ? t("contact.submitting") : t("contact.submit") }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import { submitFeedback } from "@/api/index"

const { t } = useI18n()
const submitting = ref(false)
const message = ref("")
const isError = ref(false)
const form = reactive({
  name: "",
  phone: "",
  store_name: "",
  content: ""
})

const makePhoneCall = (tel: string) => {
  const link = document.createElement("a")
  link.href = `tel:${tel}`
  link.click()
}

const onSubmit = async () => {
  message.value = ""
  if (!form.name || !form.phone || !form.store_name) {
    isError.value = true
    message.value = t("contact.required")
    return
  }
  submitting.value = true
  try {
    const res: any = await submitFeedback({ ...form })
    if (res.code == 1) {
      isError.value = false
      message.value = t("contact.success")
      form.name = ""
      form.phone = ""
      form.store_name = ""
      form.content = ""
    } else {
      isError.value = true
      message.value = res.msg || t("contact.fail")
    }
  } catch (e: any) {
    isError.value = true
    message.value = e?.msg || e?.message || t("contact.fail")
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact {
  min-height: calc(100vh - 240px);
  margin-top: 52px;
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgba(255, 252, 250, 1);
  &-banner {
    width: 100%;
    position: relative;
    img {
      width: 100%;
      display: block;
    }
  }
  .banner-tit {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 24px;
    font-weight: 500;
    line-height: 1.5;
    margin-top: 10px;
  }
  &-box {
    margin: 0 auto;
  }
  &-title {
    padding: 25px 15px;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }
  .contact-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    margin-bottom: 24px;
  }
  .contact-card {
    width: calc(50% - 8px);
    background: white;
    border-radius: 12px;
    padding: 20px 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    box-sizing: border-box;
  }
  .card-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .phone-icon {
    background-color: #e8f4f8;
  }
  .email-icon {
    background-color: #fef7fb;
  }
  .contact-card h3 {
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 500;
  }
  .contact-link {
    display: inline-block;
    padding: 6px 8px;
    border-radius: 8px;
    color: rgba(60, 50, 28, 1);
    font-size: 12px;
    background: rgb(252, 248, 244);
  }
  .feedback-form {
    padding: 20px 15px 40px;
    .form-title {
      margin: 0 0 16px;
      text-align: center;
      font-size: 18px;
      color: rgba(60, 50, 28, 1);
      font-weight: 500;
    }
    input,
    textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 15px;
      box-sizing: border-box;
      font-family: inherit;
    }
    .form-msg {
      margin: -6px 0 12px;
      font-size: 13px;
      color: #2e7d32;
      &.error {
        color: #c62828;
      }
    }
    .submit-btn {
      width: 100%;
      padding: 12px;
      background: rgba(60, 50, 28, 1);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      &:disabled {
        opacity: 0.6;
      }
      &:active:not(:disabled) {
        opacity: 0.85;
      }
    }
  }
}
</style>
