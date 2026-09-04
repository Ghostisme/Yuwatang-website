<template>
  <Transition name="rocket">
    <button
      v-if="visible"
      type="button"
      class="back-to-top"
      :aria-label="label"
      :title="label"
      @click="scrollTop"
    >
      <svg class="rocket-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2c2.8 2.2 4.4 5.3 4.6 9.1.7.4 1.5 1.2 2 2.2.4.8.5 1.6.3 2.2l-1.8-.5c.1-.3.1-.7-.1-1.1-.4-.8-1.1-1.4-1.7-1.7-.2 1.9-.8 3.5-1.8 4.9l1.6 1.6-.9.9-1.7-1.7c-.7.6-1.5 1-2.5 1.2v2.4h-1.2v-2.4c-1-.2-1.8-.6-2.5-1.2L4.9 19l-.9-.9 1.6-1.6C4.6 15 4 13.4 3.8 11.5c-.6.3-1.3.9-1.7 1.7-.2.4-.2.8-.1 1.1l-1.8.5c-.2-.6-.1-1.4.3-2.2.5-1 1.3-1.8 2-2.2C2.7 7.3 4.3 4.2 7.1 2c.7 1.4 1.9 2.4 3.3 2.9.5-.2 1-.3 1.6-.3s1.1.1 1.6.3c1.4-.5 2.6-1.5 3.3-2.9zM9.2 10.2c.5 0 .9-.4.9-.9s-.4-.9-.9-.9-.9.4-.9.9.4.9.9.9zm5.6 0c.5 0 .9-.4.9-.9s-.4-.9-.9-.9-.9.4-.9.9.4.9.9.9z"
        />
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

.rocket-icon {
  width: 22px;
  height: 22px;
  display: block;
}

.rocket-enter-active,
.rocket-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.rocket-enter-from,
.rocket-leave-to {
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
  .rocket-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
