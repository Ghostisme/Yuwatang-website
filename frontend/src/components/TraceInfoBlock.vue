<template>
  <div class="info-block">
    <button type="button" class="block-head" @click="$emit('toggle')">
      <span>{{ title }}</span>
      <i :class="{ open }"></i>
    </button>
    <div class="fold" :class="{ open }">
      <div class="fold-inner">
        <div
          class="row"
          v-for="(row, i) in rows"
          :key="i"
          :style="{ '--i': i }"
        >
          <span class="label">{{ row.label }}</span>
          <span class="value">{{ row.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InfoRow } from "@/data/traceProduct"

defineProps<{
  title: string
  rows: InfoRow[]
  open: boolean
}>()

defineEmits<{ toggle: [] }>()
</script>

<style lang="scss" scoped>
.info-block {
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  border-bottom: 1px solid rgba(60, 50, 28, 0.1);
}
.block-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 2px;
  border: 0;
  background: transparent;
  color: #3c321c;
  font-size: 17px;
  letter-spacing: 0.12em;
  cursor: pointer;
  font-family: "LinHai", "PingFangSC-Regular", serif;
  transition: color 0.25s ease;
  &:hover {
    color: rgba(60, 50, 28, 0.75);
  }
  i {
    width: 8px;
    height: 8px;
    border-right: 1.5px solid rgba(60, 50, 28, 0.4);
    border-bottom: 1.5px solid rgba(60, 50, 28, 0.4);
    transform: rotate(45deg);
    transition: transform 0.35s var(--ease);
    &.open {
      transform: rotate(-135deg);
      margin-top: 4px;
    }
  }
}
.fold {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s var(--ease);
  &.open {
    grid-template-rows: 1fr;
  }
}
.fold-inner {
  overflow: hidden;
  min-height: 0;
  padding: 0 0 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 2px;
  font-size: 14px;
  line-height: 1.55;
  border-top: 1px solid rgba(60, 50, 28, 0.06);
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.4s var(--ease),
    transform 0.4s var(--ease);
  transition-delay: calc(var(--i) * 40ms);
  .fold.open & {
    opacity: 1;
    transform: none;
  }
  .label {
    flex: 0 0 34%;
    color: rgba(60, 50, 28, 0.48);
    letter-spacing: 0.04em;
  }
  .value {
    flex: 1;
    text-align: right;
    color: rgba(60, 50, 28, 0.92);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fold,
  .row,
  .block-head i {
    transition: none !important;
  }
  .row {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
