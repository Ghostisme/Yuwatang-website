<template>
  <div class="info-block">
    <button type="button" class="block-head" @click="$emit('toggle')">
      <span>{{ title }}</span>
      <i :class="{ open }"></i>
    </button>
    <div class="block-body" v-show="open">
      <div class="row" v-for="(row, i) in rows" :key="i">
        <span class="label">{{ row.label }}</span>
        <span class="value">{{ row.value }}</span>
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
  border-bottom: 1px solid rgba(60, 50, 28, 0.08);
}
.block-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 2px;
  border: 0;
  background: transparent;
  color: rgba(60, 50, 28, 1);
  font-size: 17px;
  letter-spacing: 0.06em;
  cursor: pointer;
  font-family: inherit;
  i {
    width: 8px;
    height: 8px;
    border-right: 1.5px solid rgba(60, 50, 28, 0.45);
    border-bottom: 1.5px solid rgba(60, 50, 28, 0.45);
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    &.open {
      transform: rotate(-135deg);
      margin-top: 4px;
    }
  }
}
.block-body {
  padding: 0 0 12px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 2px;
  font-size: 14px;
  line-height: 1.5;
  border-top: 1px solid rgba(60, 50, 28, 0.05);
  .label {
    flex: 0 0 34%;
    color: rgba(60, 50, 28, 0.5);
  }
  .value {
    flex: 1;
    text-align: right;
    color: rgba(60, 50, 28, 0.92);
  }
}
</style>
