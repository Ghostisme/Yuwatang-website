<template>
  <div class="contact">
    <div class="contact-banner">
      <img src="@/assets/img/contact-banner.jpg" alt="" />
      <div class="banner-tit">{{ t("contact.item6") }}</div>
    </div>
    <div class="contact-box" style="max-width: 1407px; padding: 0 25px">
      <div class="contact-title">{{ t("contact.item1") }}</div>
      <div class="contact-cards">
        <div class="contact-card">
          <div class="card-icon phone-icon">📞</div>
          <h3>{{ t("contact.item2") }}</h3>
          <div class="contact-link" @click="makePhoneCall('+86-18895366320')">+86-18895366320</div>
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
        <textarea v-model.trim="form.content" rows="5" :placeholder="t('contact.contentPlaceholder')"></textarea>
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
  min-height: calc(100vh - 383px);
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 88px;
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
      margin: 0 auto;
      font-size: 38px;
      line-height: 48px;
      text-align: center;
      color: #fff;
      font-weight: 400;
    }
  }
  &-box {
    margin: 0 auto;
  }
  &-title {
    width: 100%;
    padding: 70px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  }
  .contact-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    margin-bottom: 40px;
  }
  .contact-card {
    flex: 1;
    min-width: 280px;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    padding: 40px 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    }
  }
  .card-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }
  .phone-icon {
    background-color: #e8f4f8;
  }
  .email-icon {
    background-color: #fef7fb;
  }
  .contact-card h3 {
    font-size: 20px;
    color: #2c3e50;
    margin-bottom: 16px;
    font-weight: 500;
  }
  .contact-link {
    display: inline-block;
    padding: 10px 16px;
    border-radius: 8px;
    color: rgba(60, 50, 28, 1);
    background: rgb(252, 248, 244);
    cursor: pointer;
  }
  .feedback-form {
    max-width: 600px;
    margin: 40px auto 80px;
    padding: 40px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    .form-title {
      margin: 0 0 24px;
      text-align: center;
      font-size: 22px;
      color: rgba(60, 50, 28, 1);
      font-weight: 500;
    }
    input,
    textarea {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 20px;
      box-sizing: border-box;
      font-family: inherit;
      &:focus {
        outline: none;
        border-color: rgba(60, 50, 28, 0.45);
      }
    }
    .form-msg {
      margin: -8px 0 16px;
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
      transition: opacity 0.3s ease;
      &:hover:not(:disabled) {
        opacity: 0.9;
      }
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>
