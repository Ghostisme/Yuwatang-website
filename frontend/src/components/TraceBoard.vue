<template>
  <div class="trace" :class="[variant, { ready }]">
    <section class="trace-hero">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :loop="true"
        :speed="1400"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 5200, disableOnInteraction: false }"
        effect="fade"
        class="hero-swiper"
      >
        <swiper-slide v-for="(img, i) in traceBanners" :key="i">
          <div class="hero-media">
            <img :src="img" alt="" />
          </div>
        </swiper-slide>
      </swiper>
      <div class="hero-veil"></div>
      <div class="hero-copy">
        <p class="hero-eyebrow">YUHE TANG · TRACE</p>
        <h1 class="hero-title">产品溯源</h1>
        <p class="hero-sub">道地蕲艾 · 三年陈化 · 一码可溯</p>
      </div>
    </section>

    <div class="trace-body">
      <nav class="trace-tabs" aria-label="溯源分类">
        <div
          class="tab-ink"
          :style="{
            width: `${ink.width}px`,
            transform: `translateX(${ink.x}px)`
          }"
        ></div>
        <button
          v-for="tab in traceTabs"
          :key="tab.key"
          :ref="(el) => setTabRef(tab.key, el)"
          type="button"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="onTab(tab)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <Transition name="panel" mode="out-in">
        <!-- 防伪溯源 -->
        <section v-if="activeTab === 'verify'" key="verify" class="panel">
          <div class="verify-card reveal">
            <div class="verify-glow"></div>
            <div class="verify-top">
              <div>
                <div class="verify-label">您所查询的防伪码是</div>
                <div class="verify-code">{{ verifyInfo.code }}</div>
              </div>
              <img class="verify-shield" :src="verifyInfo.shieldIcon" alt="" />
            </div>
            <div class="verify-bottom">
              <div class="verify-sub">防伪验证信息</div>
              <p>
                您好，本次为您第<span class="hl">{{ verifyInfo.scanCount }}</span
                >次扫描结果，首次查询时间为<span class="hl">{{ verifyInfo.firstQueryTime }}</span
                >，感谢您的查询！如有疑问，请致电{{ verifyInfo.phone }}。
              </p>
            </div>
          </div>

          <InfoBlock title="原料信息" :rows="materialRows" :open="openMap.material" @toggle="toggle('material')" />
          <InfoBlock title="生产信息" :rows="productionRows" :open="openMap.production" @toggle="toggle('production')" />
          <InfoBlock title="储存信息" :rows="storageRows" :open="openMap.storage" @toggle="toggle('storage')" />

          <div class="block">
            <button type="button" class="block-head" @click="toggle('report')">
              <span>检验报告</span>
              <i :class="{ open: openMap.report }"></i>
            </button>
            <div class="fold" :class="{ open: openMap.report }">
              <div class="fold-inner">
                <img
                  v-for="(src, i) in reportImages"
                  :key="i"
                  :src="src"
                  class="media-img"
                  alt="检验报告"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 产品介绍 -->
        <section v-else-if="activeTab === 'product'" key="product" class="panel">
          <div class="block">
            <button type="button" class="block-head" @click="toggle('productImg')">
              <span>产品图片</span>
              <i :class="{ open: openMap.productImg }"></i>
            </button>
            <div class="fold" :class="{ open: openMap.productImg }">
              <div class="fold-inner">
                <div class="media-frame" v-for="(src, i) in productImages" :key="i">
                  <img :src="src" class="media-img" alt="产品图片" />
                </div>
              </div>
            </div>
          </div>

          <div class="block">
            <button type="button" class="block-head" @click="toggle('video')">
              <span>产品视频</span>
              <i :class="{ open: openMap.video }"></i>
            </button>
            <div class="fold" :class="{ open: openMap.video }">
              <div class="fold-inner">
                <div class="video-wrap">
                  <video class="video" controls preload="metadata" :src="productVideo.src"></video>
                </div>
                <p class="video-cap">{{ productVideo.caption }}</p>
              </div>
            </div>
          </div>

          <InfoBlock title="产品信息" :rows="productRows" :open="openMap.productInfo" @toggle="toggle('productInfo')" />

          <div class="block">
            <button type="button" class="block-head" @click="toggle('qualify')">
              <span>资质介绍</span>
              <i :class="{ open: openMap.qualify }"></i>
            </button>
            <div class="fold" :class="{ open: openMap.qualify }">
              <div class="fold-inner qualify-grid">
                <div class="media-frame" v-for="(src, i) in qualifyImages" :key="i">
                  <img :src="src" class="media-img" alt="资质" />
                </div>
              </div>
            </div>
          </div>

          <div class="block">
            <button type="button" class="block-head" @click="toggle('usage')">
              <span>使用说明</span>
              <i :class="{ open: openMap.usage }"></i>
            </button>
            <div class="fold" :class="{ open: openMap.usage }">
              <div class="fold-inner usage">
                <h2 class="usage-main">艾条产品使用说明</h2>
                <div v-for="(sec, si) in usageSections" :key="si" class="usage-sec">
                  <h3>{{ sec.title }}</h3>
                  <div v-for="(blk, bi) in sec.blocks" :key="bi" class="usage-blk">
                    <h4>{{ blk.subtitle }}</h4>
                    <p v-for="(p, pi) in blk.paragraphs" :key="pi">{{ p }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 公司简介 -->
        <section v-else key="company" class="panel">
          <article v-for="(block, i) in companyBlocks" :key="i" class="company-card" :style="{ '--d': `${i * 80}ms` }">
            <div class="company-index">0{{ i + 1 }}</div>
            <h3>{{ block.title }}</h3>
            <p>{{ block.text }}</p>
            <div class="company-gallery">
              <div class="media-frame" v-for="(src, j) in block.images" :key="j">
                <img :src="src" class="media-img" alt="" />
              </div>
            </div>
          </article>
        </section>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import {
  companyBlocks,
  materialRows,
  productionRows,
  productImages,
  productRows,
  productVideo,
  qualifyImages,
  reportImages,
  storageRows,
  traceBanners,
  traceTabs,
  usageSections,
  verifyInfo
} from "@/data/traceProduct"
import InfoBlock from "./TraceInfoBlock.vue"

defineProps<{ variant: "pc" | "mobile" }>()

const modules = [Autoplay, Pagination, EffectFade]
const activeTab = ref<"verify" | "product" | "company">("verify")
const ready = ref(false)
const tabEls = reactive<Record<string, HTMLElement | null>>({})
const ink = reactive({ x: 0, width: 28 })

const openMap = reactive({
  material: true,
  production: true,
  storage: true,
  report: true,
  productImg: true,
  video: true,
  productInfo: true,
  qualify: false,
  usage: false
})

const setTabRef = (key: string, el: unknown) => {
  tabEls[key] = (el as HTMLElement | null) || null
}

const updateInk = () => {
  const el = tabEls[activeTab.value]
  if (!el) return
  const parent = el.parentElement
  if (!parent) return
  const pRect = parent.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  ink.width = Math.min(36, Math.max(24, rect.width * 0.28))
  ink.x = rect.left - pRect.left + (rect.width - ink.width) / 2
}

const toggle = (key: keyof typeof openMap) => {
  openMap[key] = !openMap[key]
}

const onTab = (tab: (typeof traceTabs)[number]) => {
  activeTab.value = tab.key
}

watch(activeTab, async () => {
  await nextTick()
  updateInk()
})

onMounted(async () => {
  await nextTick()
  updateInk()
  requestAnimationFrame(() => {
    ready.value = true
  })
  window.addEventListener("resize", updateInk)
})

onUnmounted(() => {
  window.removeEventListener("resize", updateInk)
})
</script>

<style lang="scss" scoped>
.trace {
  --ink: #3c321c;
  --ink-soft: rgba(60, 50, 28, 0.55);
  --paper: #fffefa;
  --paper-deep: #f7f1ea;
  --line: rgba(60, 50, 28, 0.1);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  background:
    radial-gradient(1200px 480px at 50% -10%, rgba(196, 168, 120, 0.14), transparent 60%),
    linear-gradient(180deg, #fbf7f2 0%, var(--paper) 28%, #fff 100%);
  overflow: hidden;
  &.pc {
    margin-top: 88px;
  }
  &.mobile {
    margin-top: 52px;
  }
}

.trace-hero {
  position: relative;
  width: 100%;
  min-height: 360px;
  overflow: hidden;
  .hero-swiper,
  :deep(.swiper),
  :deep(.swiper-wrapper),
  :deep(.swiper-slide) {
    height: 100%;
    min-height: 360px;
  }
}

.hero-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.06);
    animation: kenburns 14s var(--ease) infinite alternate;
    will-change: transform;
  }
}

.hero-veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(28, 22, 12, 0.15) 0%, rgba(28, 22, 12, 0.28) 42%, rgba(28, 22, 12, 0.72) 100%),
    radial-gradient(80% 60% at 50% 100%, rgba(60, 50, 28, 0.35), transparent 70%);
  pointer-events: none;
}

.hero-copy {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 48px;
  z-index: 2;
  text-align: center;
  color: #fff;
  pointer-events: none;
  .hero-eyebrow {
    margin: 0 0 10px;
    font-size: 11px;
    letter-spacing: 0.42em;
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity 0.8s var(--ease-out) 0.15s,
      transform 0.8s var(--ease-out) 0.15s;
  }
  .hero-title {
    margin: 0;
    font-family: "LinHai", serif;
    font-size: clamp(34px, 4.2vw, 48px);
    font-weight: 400;
    letter-spacing: 0.28em;
    text-indent: 0.28em;
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity 0.9s var(--ease-out) 0.28s,
      transform 0.9s var(--ease-out) 0.28s;
  }
  .hero-sub {
    margin: 14px 0 0;
    font-size: 14px;
    letter-spacing: 0.22em;
    opacity: 0;
    transform: translateY(12px);
    color: rgba(255, 246, 232, 0.88);
    transition:
      opacity 0.9s var(--ease-out) 0.42s,
      transform 0.9s var(--ease-out) 0.42s;
  }
}

.trace.ready .hero-copy {
  .hero-eyebrow,
  .hero-title,
  .hero-sub {
    opacity: 1;
    transform: none;
  }
}

.trace.mobile .trace-hero,
.trace.mobile .trace-hero .hero-swiper,
.trace.mobile .trace-hero :deep(.swiper),
.trace.mobile .trace-hero :deep(.swiper-slide) {
  min-height: 240px;
}
.trace.mobile .hero-copy {
  bottom: 28px;
  .hero-title {
    font-size: 28px;
    letter-spacing: 0.2em;
    text-indent: 0.2em;
  }
  .hero-sub {
    font-size: 12px;
    letter-spacing: 0.12em;
  }
}

.trace-body {
  max-width: 920px;
  margin: 0 auto;
  padding: 36px 24px 96px;
}

.trace.mobile .trace-body {
  padding: 20px 16px 64px;
}

.trace-tabs {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 0 32px;
  border-bottom: 1px solid var(--line);
  .tab-ink {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    border-radius: 2px;
    background: var(--ink);
    transition:
      transform 0.45s var(--ease),
      width 0.45s var(--ease);
    will-change: transform, width;
  }
  .tab-item {
    position: relative;
    flex: 1;
    max-width: 180px;
    padding: 16px 8px 18px;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: rgba(60, 50, 28, 0.38);
    font-size: 16px;
    letter-spacing: 0.14em;
    font-family: "LinHai", "PingFangSC-Regular", serif;
    line-height: 1.2;
    transition: color 0.35s var(--ease);
    &:hover {
      color: rgba(60, 50, 28, 0.78);
    }
    &.active {
      color: var(--ink);
    }
  }
}

.trace.mobile .trace-tabs {
  margin-bottom: 22px;
  .tab-item {
    max-width: none;
    padding: 12px 4px 14px;
    font-size: 14px;
    letter-spacing: 0.08em;
  }
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.38s var(--ease),
    transform 0.38s var(--ease);
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.verify-card {
  position: relative;
  overflow: hidden;
  margin-bottom: 18px;
  border-radius: 18px;
  padding: 26px 28px 22px;
  color: #fff;
  background:
    linear-gradient(145deg, rgba(54, 44, 24, 0.96) 0%, rgba(98, 78, 42, 0.92) 55%, rgba(72, 58, 30, 0.95) 100%);
  box-shadow:
    0 18px 40px rgba(60, 50, 28, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transform: translateY(10px);
  opacity: 0;
  animation: riseIn 0.7s var(--ease-out) 0.05s forwards;
  .verify-glow {
    position: absolute;
    width: 220px;
    height: 220px;
    right: -40px;
    top: -60px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 214, 160, 0.28), transparent 68%);
    pointer-events: none;
    animation: glowPulse 4.5s ease-in-out infinite;
  }
  .verify-top {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  }
  .verify-label {
    font-size: 13px;
    letter-spacing: 0.08em;
    opacity: 0.82;
    margin-bottom: 10px;
  }
  .verify-code {
    font-size: 28px;
    letter-spacing: 0.12em;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .verify-shield {
    width: 76px;
    height: auto;
    flex-shrink: 0;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
    animation: floatY 3.6s ease-in-out infinite;
  }
  .verify-bottom {
    position: relative;
    padding-top: 16px;
    font-size: 14px;
    line-height: 1.8;
    .verify-sub {
      font-weight: 600;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
    }
    .hl {
      color: #ffd7a8;
      margin: 0 4px;
      font-weight: 600;
    }
  }
}

.trace.mobile .verify-card {
  padding: 18px 16px 16px;
  border-radius: 14px;
  .verify-code {
    font-size: 20px;
    letter-spacing: 0.06em;
  }
  .verify-shield {
    width: 56px;
  }
  .verify-bottom {
    font-size: 13px;
  }
}

.block {
  border-bottom: 1px solid var(--line);
}

.block-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 2px;
  border: 0;
  background: transparent;
  color: var(--ink);
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
  .fold-inner {
    overflow: hidden;
    min-height: 0;
    padding: 0 0 18px;
  }
}

.media-frame {
  overflow: hidden;
  border-radius: 12px;
  margin-top: 10px;
  background: var(--paper-deep);
  img {
    transition: transform 0.8s var(--ease);
  }
  &:hover img {
    transform: scale(1.03);
  }
}

.media-img {
  display: block;
  width: 100%;
  max-width: 100%;
}

.qualify-grid {
  display: grid;
  gap: 12px;
}

.video-wrap {
  overflow: hidden;
  border-radius: 12px;
  background: #111;
  box-shadow: 0 12px 28px rgba(60, 50, 28, 0.12);
}
.video {
  width: 100%;
  display: block;
}
.video-cap {
  text-align: center;
  margin: 12px 0 0;
  color: var(--ink-soft);
  font-size: 13px;
  letter-spacing: 0.12em;
}

.usage {
  padding-top: 4px !important;
  .usage-main {
    margin: 4px 0 18px;
    font-family: "LinHai", serif;
    font-size: 22px;
    color: var(--ink);
    font-weight: 400;
    letter-spacing: 0.08em;
  }
  .usage-sec {
    margin-bottom: 20px;
    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      letter-spacing: 0.06em;
      color: var(--ink);
    }
  }
  .usage-blk {
    margin-bottom: 14px;
    h4 {
      margin: 0 0 8px;
      font-size: 14px;
      color: rgba(60, 50, 28, 0.88);
    }
    p {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 1.85;
      color: rgba(60, 50, 28, 0.78);
    }
  }
}

.company-card {
  position: relative;
  padding: 12px 2px 32px;
  border-bottom: 1px solid var(--line);
  opacity: 0;
  transform: translateY(16px);
  animation: riseIn 0.7s var(--ease-out) var(--d, 0ms) forwards;
  &:last-child {
    border-bottom: 0;
  }
  .company-index {
    font-family: "LinHai", serif;
    font-size: 13px;
    letter-spacing: 0.2em;
    color: rgba(60, 50, 28, 0.35);
    margin-bottom: 8px;
  }
  h3 {
    margin: 0 0 14px;
    font-family: "LinHai", serif;
    font-size: 22px;
    color: var(--ink);
    font-weight: 400;
    letter-spacing: 0.08em;
  }
  p {
    margin: 0 0 18px;
    font-size: 15px;
    line-height: 1.9;
    color: rgba(60, 50, 28, 0.8);
  }
}
.company-gallery {
  display: grid;
  gap: 12px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}

:deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.45);
  opacity: 1;
  transition:
    width 0.35s var(--ease),
    background 0.35s ease;
}
:deep(.swiper-pagination-bullet-active) {
  width: 18px;
  border-radius: 999px;
  background: #fff;
}

@keyframes kenburns {
  from {
    transform: scale(1.06) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.14) translate3d(-1.2%, -0.8%, 0);
  }
}
@keyframes riseIn {
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes floatY {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-media img,
  .verify-shield,
  .verify-glow,
  .company-card,
  .verify-card {
    animation: none !important;
  }
  .hero-copy .hero-eyebrow,
  .hero-copy .hero-title,
  .hero-copy .hero-sub,
  .verify-card,
  .company-card {
    opacity: 1 !important;
    transform: none !important;
  }
  .panel-enter-active,
  .panel-leave-active,
  .fold,
  .tab-ink,
  .media-frame img {
    transition: none !important;
  }
}
</style>
