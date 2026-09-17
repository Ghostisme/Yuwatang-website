<template>
  <div class="trace" :class="[variant, { ready }]">
    <section class="trace-hero" aria-label="产品溯源">
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
      <div class="hero-veil" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="hero-eyebrow">YUHE TANG · TRACE</p>
        <h1 class="hero-title">产品溯源</h1>
        <p class="hero-sub">道地蕲艾 · 三年陈化 · 一码可溯</p>
      </div>
    </section>

    <div class="trace-body">
      <header class="body-head">
        <h2 class="body-title">防伪溯源</h2>
        <p class="body-desc">扫码核验真伪 · 追溯原料与生产信息</p>
      </header>

      <article class="verify-card">
        <div class="verify-glow" aria-hidden="true"></div>
        <div class="verify-main">
          <img class="verify-shield" :src="verifyInfo.shieldIcon" alt="" />
          <div class="verify-code-block">
            <div class="verify-label">您所查询的防伪码是</div>
            <div class="verify-code" aria-label="防伪码">
              <span v-for="(chunk, i) in codeChunks" :key="i" class="code-chunk">{{ chunk }}</span>
            </div>
          </div>
          <div class="verify-divider" aria-hidden="true"></div>
          <div class="verify-info-block">
            <div class="verify-sub">防伪验证信息</div>
            <p>
              您好，本次为您第<span class="hl">{{ verifyInfo.scanCount }}</span
              >次扫描结果，首次查询时间为<span class="hl">{{ verifyInfo.firstQueryTime }}</span
              >，感谢您的查询！如有疑问，请致电
              <a class="phone" :href="`tel:${verifyInfo.phone}`">{{ verifyInfo.phone }}</a>。
            </p>
          </div>
        </div>
      </article>

      <div class="info-grid">
        <InfoBlock title="原料信息" :rows="materialRows" appearance="card" :collapsible="false" />
        <InfoBlock title="生产信息" :rows="productionRows" appearance="card" :collapsible="false" />
        <InfoBlock title="储存信息" :rows="storageRows" appearance="card" :collapsible="false" />
      </div>

      <section class="report-block static">
        <div class="report-head">
          <span>检验报告</span>
        </div>
        <div class="fold open flat">
          <div class="fold-inner">
            <div class="report-gallery">
              <figure v-for="(src, i) in reportImages" :key="i" class="report-frame">
                <img :src="src" class="media-img" alt="检验报告" />
              </figure>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import {
  materialRows,
  productionRows,
  reportImages,
  storageRows,
  traceBanners,
  verifyInfo
} from "@/data/traceProduct"
import InfoBlock from "./TraceInfoBlock.vue"

defineProps<{ variant: "pc" | "mobile" }>()

const modules = [Autoplay, Pagination, EffectFade]
const ready = ref(false)

const codeChunks = computed(() => {
  const raw = String(verifyInfo.code || "").replace(/\s+/g, "")
  return raw.match(/.{1,4}/g) || [raw]
})

onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true
  })
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

/* ---------- Hero ---------- */
.trace-hero {
  position: relative;
  width: 100%;
  min-height: 380px;
  overflow: hidden;

  .hero-swiper,
  :deep(.swiper),
  :deep(.swiper-wrapper),
  :deep(.swiper-slide) {
    height: 100%;
    min-height: 380px;
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
  bottom: 52px;
  z-index: 2;
  text-align: center;
  color: #fff;
  pointer-events: none;
  padding: 0 20px;

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

/* ---------- Body ---------- */
.trace-body {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.body-head {
  text-align: center;
  margin-bottom: 28px;
}

.body-title {
  margin: 0;
  font-family: "LinHai", serif;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.18em;
  color: var(--ink);
}

.body-desc {
  margin: 10px 0 0;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
}

/* ---------- Verify ---------- */
.verify-card {
  position: relative;
  overflow: hidden;
  margin-bottom: 28px;
  border-radius: 18px;
  color: #fff;
  background: linear-gradient(
    145deg,
    rgba(54, 44, 24, 0.96) 0%,
    rgba(98, 78, 42, 0.92) 55%,
    rgba(72, 58, 30, 0.95) 100%
  );
  box-shadow:
    0 18px 40px rgba(60, 50, 28, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transform: translateY(10px);
  opacity: 0;
  animation: riseIn 0.7s var(--ease-out) 0.05s forwards;
}

.verify-glow {
  position: absolute;
  width: 240px;
  height: 240px;
  right: -48px;
  top: -72px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 214, 160, 0.28), transparent 68%);
  pointer-events: none;
  animation: glowPulse 4.5s ease-in-out infinite;
}

.verify-main {
  position: relative;
  padding: 26px 28px 24px;
}

.verify-shield {
  position: absolute;
  top: 22px;
  right: 24px;
  width: 72px;
  height: auto;
  z-index: 1;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25));
  animation: floatY 3.6s ease-in-out infinite;
}

.verify-code-block {
  position: relative;
  z-index: 1;
  padding-right: 88px;
}

.verify-label {
  font-size: 13px;
  letter-spacing: 0.08em;
  opacity: 0.82;
  margin-bottom: 12px;
}

.verify-code {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1.25;
}

.code-chunk {
  display: inline-block;
}

.verify-divider {
  height: 1px;
  margin: 22px 0 18px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.28),
    rgba(255, 255, 255, 0.12) 60%,
    transparent
  );
}

.verify-info-block {
  position: relative;
  z-index: 1;
  font-size: 14px;
  line-height: 1.85;
  max-width: 52em;

  .verify-sub {
    font-weight: 600;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    opacity: 0.95;
  }

  .hl {
    color: #ffd7a8;
    margin: 0 4px;
    font-weight: 600;
  }

  .phone {
    color: #ffd7a8;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 215, 168, 0.45);
    margin-left: 2px;
  }
}

/* ---------- Info grid ---------- */
.info-grid {
  display: grid;
  gap: 0;
  margin-bottom: 8px;
}

/* ---------- Report ---------- */
.report-block {
  border-top: 1px solid var(--line);
  margin-top: 8px;
}

.report-head {
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
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", serif;
  box-sizing: border-box;
  text-align: left;

  .report-block.static & {
    cursor: default;
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
  padding: 0 0 18px;
}

.report-gallery {
  display: grid;
  gap: 12px;
}

.report-frame {
  margin: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--paper-deep);
  box-shadow: 0 8px 20px rgba(60, 50, 28, 0.06);
}

.media-img {
  display: block;
  width: 100%;
  max-width: 100%;
}

/* ========== PC ========== */
.trace.pc {
  .trace-body {
    max-width: 1080px;
    padding: 48px 32px 100px;
  }

  .body-head {
    margin-bottom: 36px;
  }

  .body-title {
    font-size: 32px;
  }

  .verify-card {
    margin-bottom: 36px;
  }

  .verify-main {
    padding: 32px 40px 30px;
  }

  .verify-shield {
    top: 28px;
    right: 36px;
    width: 84px;
  }

  .verify-code-block {
    padding-right: 108px;
  }

  .verify-label {
    font-size: 14px;
  }

  .verify-code {
    font-size: 34px;
    gap: 10px 16px;
    letter-spacing: 0.08em;
  }

  .verify-divider {
    margin: 26px 0 20px;
  }

  .verify-info-block {
    font-size: 15px;
    line-height: 1.9;
  }

  .info-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 28px;
  }

  .report-block {
    border: 1px solid rgba(60, 50, 28, 0.08);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 18px rgba(60, 50, 28, 0.05);
    overflow: hidden;
  }

  .report-head {
    padding: 18px 22px;
    background: rgba(252, 248, 244, 0.65);
  }

  .fold-inner {
    padding: 0 22px 22px;
  }

  .report-gallery {
    max-width: 720px;
    margin: 0 auto;
  }

  @media (max-width: 900px) {
    .trace-body {
      padding: 36px 20px 80px;
    }

    .verify-main {
      padding: 24px 22px 22px;
    }

    .verify-code {
      font-size: 26px;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
}

/* ========== Mobile ========== */
.trace.mobile {
  .trace-hero,
  .trace-hero .hero-swiper,
  .trace-hero :deep(.swiper),
  .trace-hero :deep(.swiper-slide) {
    min-height: 220px;
  }

  .hero-copy {
    bottom: 26px;

    .hero-title {
      font-size: 26px;
      letter-spacing: 0.18em;
      text-indent: 0.18em;
    }

    .hero-sub {
      font-size: 12px;
      letter-spacing: 0.1em;
    }
  }

  .trace-body {
    max-width: 100%;
    padding: 22px 16px 72px;
  }

  .body-head {
    margin-bottom: 18px;
  }

  .body-title {
    font-size: 22px;
    letter-spacing: 0.14em;
  }

  .body-desc {
    font-size: 12px;
    letter-spacing: 0.04em;
  }

  .verify-card {
    border-radius: 16px;
    margin-bottom: 14px;
  }

  .verify-main {
    padding: 18px 16px 16px;
  }

  .verify-shield {
    top: 14px;
    right: 14px;
    width: 48px;
  }

  .verify-code-block {
    padding-right: 56px;
  }

  .verify-code {
    font-size: 18px;
    gap: 6px 8px;
    letter-spacing: 0.04em;
  }

  .verify-divider {
    margin: 16px 0 14px;
  }

  .verify-info-block {
    font-size: 13px;
    line-height: 1.75;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  }

  .report-block {
    margin-top: 0;
    border: 1px solid rgba(60, 50, 28, 0.08);
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 6px 18px rgba(60, 50, 28, 0.05);
    overflow: hidden;

    &.static .report-head {
      cursor: default;
      padding: 14px 16px;
      font-size: 15px;
      letter-spacing: 0.08em;
      background: rgba(252, 248, 244, 0.65);
    }
  }

  .fold-inner {
    padding: 0 16px 16px;
  }

  .report-frame {
    border-radius: 10px;
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
  .verify-card {
    animation: none !important;
  }

  .hero-copy .hero-eyebrow,
  .hero-copy .hero-title,
  .hero-copy .hero-sub,
  .verify-card {
    opacity: 1 !important;
    transform: none !important;
  }

  .fold,
  .report-head i {
    transition: none !important;
  }
}
</style>
