<template>
  <div class="home-honors">
    <ul class="honor-bar">
      <li v-for="(item, index) in honorItems" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const honorItems = computed(() =>
  t("homeV2.honor")
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean)
)
</script>

<style scoped lang="scss">
.home-honors {
  max-width: 1407px;
  margin: 0 auto 70px;
  padding: 0 25px;
  position: relative;
  z-index: 5;
}
.honor-bar {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  align-items: center;
  padding: 32px 12px;
  border: 1px solid var(--pm-line);
  border-radius: 12px;
  background: var(--pm-paper-warm);
  li {
    min-width: 0;
    padding: 0 28px;
    color: var(--pm-ink);
    font-size: 18px;
    line-height: 1.8;
    text-align: center;
    text-wrap: pretty;
    & + li {
      border-left: 1px solid rgba(196, 168, 120, 0.35);
    }
  }
}
@media (max-width: 768px) {
  .home-honors {
    margin: 12px auto 32px;
    padding: 0 15px;
  }
  .honor-bar {
    grid-template-columns: 1fr;
    padding: 4px 20px;
    border-radius: 10px;
    li {
      padding: 14px 0;
      font-size: 14px;
      line-height: 1.8;
      & + li {
        border-left: 0;
        border-top: 1px solid rgba(196, 168, 120, 0.35);
      }
    }
  }
}
</style>
