<template>
  <Transition name="back-top">
    <button
      v-if="visible"
      type="button"
      class="back-to-top"
      :aria-label="label"
      :title="label"
      @click="scrollTop"
    >
      <svg
        class="back-to-top-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 4h14M12 20V8m-6 6 6-6 6 6" />
      </svg>
    </button>
  </Transition>
</template>

<script lang="ts">
export default { name: "BackToTop" }
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()
const visible = ref(false)
const SHOW_AFTER = 420

const label = computed(() => {
  if (locale.value === "en") return "Back to top"
  if (locale.value === "jp") return "ページ上部へ"
  return "回到顶部"
})

const onScroll = () => {
  visible.value = window.scrollY > SHOW_AFTER
}

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

onMounted(() => {
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 28px;
  z-index: 90;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fcf8f4;
  background: rgba(122, 86, 54, 0.92);
  box-shadow: 0 8px 20px rgba(60, 50, 28, 0.18);
  transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(122, 86, 54, 1);
    box-shadow: 0 10px 24px rgba(60, 50, 28, 0.22);
  }

  &:active {
    transform: translateY(-1px);
  }
}

.back-to-top-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (max-width: 768px) {
  .back-to-top {
    right: 16px;
    bottom: 20px;
    width: 44px;
    height: 44px;
  }
  .back-to-top-icon {
    width: 22px;
    height: 22px;
  }
}
</style>
