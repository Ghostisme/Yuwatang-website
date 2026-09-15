<template>
  <div
    class="info-block"
    :class="{
      open: shown,
      card: appearance === 'card',
      static: !collapsible
    }"
  >
    <component
      :is="collapsible ? 'button' : 'div'"
      :type="collapsible ? 'button' : undefined"
      class="block-head"
      @click="onHeadClick"
    >
      <span>{{ title }}</span>
      <i v-if="collapsible" :class="{ open: shown }" aria-hidden="true"></i>
    </component>
    <div class="fold" :class="{ open: shown, flat: !collapsible }">
      <div class="fold-inner">
        <div class="row" v-for="(row, i) in rows" :key="i">
          <span class="label">{{ row.label }}</span>
          <span class="value">{{ row.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { InfoRow } from "@/data/traceProduct"

const props = withDefaults(
  defineProps<{
    title: string
    rows: InfoRow[]
    open?: boolean
    appearance?: "list" | "card"
    /** false：不可折叠，内容常显（手机端） */
    collapsible?: boolean
  }>(),
  {
    open: true,
    appearance: "list",
    collapsible: true
  }
)

const emit = defineEmits<{ toggle: [] }>()

const shown = computed(() => !props.collapsible || props.open)

const onHeadClick = () => {
  if (props.collapsible) emit("toggle")
}
</script>

<style lang="scss" scoped>
.info-block {
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ink: #3c321c;
  border-bottom: 1px solid rgba(60, 50, 28, 0.1);

  &.card {
    border: 1px solid rgba(60, 50, 28, 0.08);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 18px rgba(60, 50, 28, 0.05);
    overflow: hidden;
  }

  &.static .block-head {
    cursor: default;
  }
}

.block-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 2px;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  letter-spacing: 0.1em;
  cursor: pointer;
  font-family: "LinHai", "PingFangSC-Regular", serif;
  text-align: left;
  box-sizing: border-box;

  .card & {
    padding: 16px 18px;
    background: rgba(252, 248, 244, 0.65);
  }

  .info-block:not(.static) &:hover {
    color: rgba(60, 50, 28, 0.75);
  }

  i {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
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

  &.open,
  &.flat {
    grid-template-rows: 1fr;
  }

  &.flat {
    transition: none;
  }
}

.fold-inner {
  overflow: hidden;
  min-height: 0;
  padding: 0 0 10px;

  .card & {
    padding: 0 18px 14px;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 2px;
  font-size: 14px;
  line-height: 1.55;
  border-top: 1px solid rgba(60, 50, 28, 0.06);

  .label {
    flex: 0 0 34%;
    max-width: 7.5em;
    color: rgba(60, 50, 28, 0.48);
    letter-spacing: 0.04em;
  }

  .value {
    flex: 1;
    min-width: 0;
    text-align: right;
    word-break: break-word;
    color: rgba(60, 50, 28, 0.92);
  }
}

@media (max-width: 767px) {
  .info-block.card {
    border-radius: 14px;
  }

  .card .block-head {
    padding: 14px 16px;
    font-size: 15px;
    letter-spacing: 0.08em;
  }

  .card .fold-inner {
    padding: 0 16px 12px;
  }

  .card .row {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
    padding: 11px 0;

    .label {
      flex: 0 0 5.5em;
      max-width: 5.5em;
      font-size: 12px;
      line-height: 1.5;
    }

    .value {
      text-align: right;
      font-size: 13px;
      line-height: 1.5;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .fold,
  .block-head i {
    transition: none !important;
  }
}
</style>
