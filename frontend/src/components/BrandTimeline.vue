<template>
  <!-- 手机：竖排直线 -->
  <ol v-if="mobile" class="brand-timeline is-mobile">
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

  <!-- PC：紧凑蛇形（无卡片） -->
  <div v-else ref="stageRef" class="brand-timeline is-s" :style="{ height: `${stageH}px` }">
    <svg
      class="s-svg"
      :viewBox="`0 0 ${stageW} ${stageH}`"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
    >
      <path class="s-path" fill="none" :d="pathD" />
    </svg>

    <div
      v-for="(node, index) in nodes"
      :key="`${node.year}-${index}`"
      class="s-node"
      :class="node.laneDir"
      :title="`${node.year}　${node.text}`"
      :style="{
        left: `${node.x}px`,
        top: `${node.y}px`,
        '--i': index
      }"
    >
      <span class="tl-dot" aria-hidden="true"></span>
      <div class="s-label">
        <time class="tl-year">{{ node.year }}</time>
        <p class="tl-text">{{ node.text }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "BrandTimeline" }
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"

type Item = { year: string; text: string }
type NodePos = Item & {
  x: number
  y: number
  laneDir: "ltr" | "rtl"
}

const props = defineProps<{
  items: Item[]
  mobile?: boolean
}>()

const PAD_X = 28
const PAD_Y = 28
/** 紧凑行距，仍够放下 2～3 行完整文案 */
const LANE_PITCH = 108

const stageRef = ref<HTMLElement | null>(null)
const stageW = ref(960)
const stageH = ref(360)
const pathD = ref("")
const nodes = ref<NodePos[]>([])

let ro: ResizeObserver | null = null

const itemCount = computed(() => props.items?.length || 0)

/** → 半圆 ← 半圆 → … */
const buildSnakePath = (w: number, lanes: number, pitch: number) => {
  const L = PAD_X + 6
  const R = w - PAD_X - 6
  const y0 = PAD_Y + pitch / 2
  const r = pitch / 2
  const parts: string[] = [`M ${L} ${y0}`]

  for (let i = 0; i < lanes; i++) {
    const y = y0 + i * pitch
    const goRight = i % 2 === 0

    if (goRight) {
      parts.push(`H ${R}`)
      if (i < lanes - 1) parts.push(`A ${r} ${r} 0 0 1 ${R} ${y + pitch}`)
    } else {
      parts.push(`H ${L}`)
      if (i < lanes - 1) parts.push(`A ${r} ${r} 0 0 0 ${L} ${y + pitch}`)
    }
  }

  return parts.join(" ")
}

/**
 * 节点只落在水平段，两端内缩避开半圆拐弯（否则会像 2016 压在线上）。
 */
const placeNodesOnHorizontals = (
  items: Item[],
  w: number,
  lanes: number,
  pitch: number
): NodePos[] => {
  const n = items.length
  if (!n) return []

  const L = PAD_X + 6
  const R = w - PAD_X - 6
  const y0 = PAD_Y + pitch / 2
  // 半圆半径 = pitch/2，水平段两端再多留一点空隙
  const endInset = Math.max(40, pitch * 0.42)
  const x0 = L + endInset
  const x1 = R - endInset

  const base = Math.floor(n / lanes)
  const rem = n % lanes
  const out: NodePos[] = []
  let idx = 0

  for (let lane = 0; lane < lanes; lane++) {
    const count = base + (lane < rem ? 1 : 0)
    if (!count) continue
    const y = y0 + lane * pitch
    const goRight = lane % 2 === 0
    const laneDir: "ltr" | "rtl" = goRight ? "ltr" : "rtl"

    for (let j = 0; j < count; j++) {
      const t = count === 1 ? 0.5 : j / (count - 1)
      const x = goRight ? x0 + t * (x1 - x0) : x1 - t * (x1 - x0)
      out.push({ ...items[idx++], x, y, laneDir })
    }
  }

  return out
}

const layout = () => {
  if (props.mobile) return
  const stage = stageRef.value
  const n = itemCount.value
  if (!stage || !n) {
    nodes.value = []
    return
  }

  const w = Math.max(640, stage.clientWidth || 960)
  stageW.value = w

  const perLane = Math.max(2, Math.floor((w - PAD_X * 2) / 220))
  const lanes = Math.max(2, Math.ceil(n / perLane))
  stageH.value = PAD_Y * 2 + lanes * LANE_PITCH
  pathD.value = buildSnakePath(w, lanes, LANE_PITCH)
  nodes.value = placeNodesOnHorizontals(props.items, w, lanes, LANE_PITCH)
}

const scheduleLayout = async () => {
  await nextTick()
  layout()
}

watch(
  () => [props.items, props.mobile] as const,
  () => scheduleLayout(),
  { deep: true }
)

onMounted(() => {
  scheduleLayout()
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => scheduleLayout())
    if (stageRef.value) ro.observe(stageRef.value)
  } else {
    window.addEventListener("resize", scheduleLayout)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener("resize", scheduleLayout)
})
</script>

<style lang="scss" scoped>
.brand-timeline {
  --accent: rgba(122, 86, 54, 1);
  --line: rgba(122, 86, 54, 0.34);
  --muted: rgba(60, 50, 28, 0.72);
  --page: #fcf8f4;

  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  position: relative;
}

.tl-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--page);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 3px rgba(122, 86, 54, 0.1);
  flex-shrink: 0;
  z-index: 1;
}

.tl-year {
  display: block;
  font-family: "LinHai";
  font-size: 18px;
  line-height: 1.15;
  letter-spacing: 0.04em;
  color: var(--accent);
  margin-bottom: 2px;
}

.tl-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--muted);
}

.is-mobile {
  --rail: 18px;

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

  .tl-item {
    display: grid;
    grid-template-columns: var(--rail) minmax(0, 1fr);
    column-gap: 14px;
    align-items: start;
    padding: 0 0 18px;
    opacity: 0;
    transform: translateY(8px);
    animation: tlIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: calc(var(--i, 0) * 45ms + 50ms);

    &:last-child {
      padding-bottom: 4px;
    }
  }

  .tl-rail {
    display: flex;
    justify-content: center;
    padding-top: 6px;
  }

  .tl-dot {
    width: 8px;
    height: 8px;
    border-width: 1.5px;
  }

  .tl-year {
    font-size: 16px;
  }

  .tl-text {
    font-size: 12px;
  }
}

.is-s {
  position: relative;
  width: 100%;
  margin: 12px 0 8px;
  overflow: visible;
}

.s-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 0;
}

.s-path {
  stroke: var(--line);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.s-node {
  position: absolute;
  z-index: 1;
  width: 0;
  height: 0;
  opacity: 0;
  animation: tlIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i, 0) * 40ms + 60ms);

  .tl-dot {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .s-label {
    position: absolute;
    left: 50%;
    top: 10px;
    width: max-content;
    max-width: min(220px, 28vw);
    transform: translateX(-50%);
    text-align: center;
  }

  .tl-year {
    font-size: 15px;
    margin-bottom: 2px;
  }

  .tl-text {
    font-size: 12px;
    line-height: 1.45;
    white-space: normal;
    word-break: break-word;
  }
}

@keyframes tlIn {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tl-item,
  .s-node {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
