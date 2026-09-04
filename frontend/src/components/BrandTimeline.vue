<template>
  <ol class="brand-timeline" :class="{ 'is-mobile': mobile }">
    <li
      v-for="(item, index) in items"
      :key="`${item.year}-${index}`"
      class="tl-item"
      :style="{ '--i': index }"
    >
      <div class="tl-rail" aria-hidden="true">
        <span class="tl-dot"></span>
      </div>
      <div class="tl-content">
        <time class="tl-year">{{ item.year }}</time>
        <p class="tl-text">{{ item.text }}</p>
      </div>
    </li>
  </ol>
</template>

<script lang="ts">
export default { name: "BrandTimeline" }
</script>

<script setup lang="ts">
defineProps<{
  items: Array<{ year: string; text: string }>
  mobile?: boolean
}>()
</script>

<style lang="scss" scoped>
.brand-timeline {
  --rail: 22px;
  --accent: rgba(122, 86, 54, 1);
  --line: rgba(122, 86, 54, 0.28);
  --muted: rgba(60, 50, 28, 0.72);
  --page: #fcf8f4;

  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: calc(var(--rail) / 2);
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(122, 86, 54, 0.08) 0%,
      var(--line) 12%,
      var(--line) 88%,
      rgba(122, 86, 54, 0.08) 100%
    );
    transform: translateX(-50%);
  }
}

.tl-item {
  display: grid;
  grid-template-columns: var(--rail) minmax(0, 1fr);
  column-gap: 20px;
  align-items: start;
  position: relative;
  padding: 0 0 28px;
  opacity: 0;
  transform: translateY(10px);
  animation: tlIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i, 0) * 50ms + 60ms);

  &:last-child {
    padding-bottom: 4px;
  }
}

.tl-rail {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.tl-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--page);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 4px rgba(122, 86, 54, 0.1);
  flex-shrink: 0;
  z-index: 1;
}

.tl-content {
  min-width: 0;
  padding: 2px 0;
}

.tl-year {
  display: block;
  font-family: "LinHai";
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: 0.04em;
  color: var(--accent);
  margin-bottom: 6px;
}

.tl-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: var(--muted);
  max-width: 42em;
}

.is-mobile {
  --rail: 18px;

  .tl-item {
    column-gap: 14px;
    padding-bottom: 22px;
  }

  .tl-dot {
    width: 9px;
    height: 9px;
    border-width: 1.5px;
    box-shadow: 0 0 0 3px rgba(122, 86, 54, 0.1);
  }

  .tl-year {
    font-size: 17px;
    margin-bottom: 4px;
  }

  .tl-text {
    font-size: 13px;
    line-height: 1.7;
  }
}

@keyframes tlIn {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tl-item {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
