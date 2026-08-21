<template>
  <div class="trace" :class="variant">
    <div class="trace-banner">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :loop="true"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :effect="'fade'"
        class="banner-swiper"
      >
        <swiper-slide v-for="(img, i) in traceBanners" :key="i">
          <img :src="img" alt="" />
        </swiper-slide>
      </swiper>
      <div class="banner-tit">产品溯源</div>
    </div>

    <div class="trace-body">
      <nav class="trace-tabs" aria-label="溯源分类">
        <button
          v-for="tab in traceTabs"
          :key="tab.key"
          type="button"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="onTab(tab)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- 防伪溯源 -->
      <section v-show="activeTab === 'verify'" class="panel">
        <div class="verify-card">
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
          <div class="block-body" v-show="openMap.report">
            <img v-for="(src, i) in reportImages" :key="i" :src="src" class="full-img" alt="检验报告" />
          </div>
        </div>
      </section>

      <!-- 产品介绍 -->
      <section v-show="activeTab === 'product'" class="panel">
        <div class="block">
          <button type="button" class="block-head" @click="toggle('productImg')">
            <span>产品图片</span>
            <i :class="{ open: openMap.productImg }"></i>
          </button>
          <div class="block-body" v-show="openMap.productImg">
            <img v-for="(src, i) in productImages" :key="i" :src="src" class="full-img" alt="产品图片" />
          </div>
        </div>

        <div class="block">
          <button type="button" class="block-head" @click="toggle('video')">
            <span>产品视频</span>
            <i :class="{ open: openMap.video }"></i>
          </button>
          <div class="block-body" v-show="openMap.video">
            <video class="video" controls preload="metadata" :src="productVideo.src"></video>
            <p class="video-cap">{{ productVideo.caption }}</p>
          </div>
        </div>

        <InfoBlock title="产品信息" :rows="productRows" :open="openMap.productInfo" @toggle="toggle('productInfo')" />

        <div class="block">
          <button type="button" class="block-head" @click="toggle('qualify')">
            <span>资质介绍</span>
            <i :class="{ open: openMap.qualify }"></i>
          </button>
          <div class="block-body" v-show="openMap.qualify">
            <img v-for="(src, i) in qualifyImages" :key="i" :src="src" class="full-img" alt="资质" />
          </div>
        </div>

        <div class="block">
          <button type="button" class="block-head" @click="toggle('usage')">
            <span>使用说明</span>
            <i :class="{ open: openMap.usage }"></i>
          </button>
          <div class="block-body usage" v-show="openMap.usage">
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
      </section>

      <!-- 公司简介 -->
      <section v-show="activeTab === 'company'" class="panel">
        <article v-for="(block, i) in companyBlocks" :key="i" class="company-card">
          <h3>{{ block.title }}</h3>
          <p>{{ block.text }}</p>
          <img v-for="(src, j) in block.images" :key="j" :src="src" class="full-img" alt="" />
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
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

const toggle = (key: keyof typeof openMap) => {
  openMap[key] = !openMap[key]
}

const onTab = (tab: (typeof traceTabs)[number]) => {
  activeTab.value = tab.key
}
</script>

<style lang="scss" scoped>
.trace {
  width: 100%;
  background: rgba(255, 252, 250, 1);
  overflow: hidden;
  &.pc {
    margin-top: 88px;
  }
  &.mobile {
    margin-top: 52px;
  }
}

.trace-banner {
  position: relative;
  width: 100%;
  .banner-swiper {
    width: 100%;
  }
  img {
    width: 100%;
    display: block;
    max-height: 420px;
    object-fit: cover;
  }
  .banner-tit {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 36px;
    text-align: center;
    color: #fff;
    font-size: 32px;
    letter-spacing: 0.12em;
    font-weight: 400;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }
}

.trace.mobile .trace-banner {
  img {
    max-height: 220px;
  }
  .banner-tit {
    bottom: 18px;
    font-size: 22px;
  }
}

.trace-body {
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 24px 80px;
}

.trace.mobile .trace-body {
  padding: 16px 15px 48px;
}

.trace-tabs {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 0;
  margin: 0 0 28px;
  border-bottom: 1px solid rgba(60, 50, 28, 0.12);
  .tab-item {
    position: relative;
    flex: 1;
    max-width: 180px;
    padding: 14px 8px 16px;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: rgba(60, 50, 28, 0.45);
    font-size: 16px;
    letter-spacing: 0.08em;
    font-family: inherit;
    line-height: 1.2;
    transition: color 0.2s ease;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -1px;
      width: 0;
      height: 2px;
      background: rgba(60, 50, 28, 1);
      transform: translateX(-50%);
      transition: width 0.25s ease;
    }
    &:hover {
      color: rgba(60, 50, 28, 0.85);
    }
    &.active {
      color: rgba(60, 50, 28, 1);
      font-weight: 500;
      &::after {
        width: 42px;
      }
    }
  }
}

.trace.mobile .trace-tabs {
  margin-bottom: 18px;
  .tab-item {
    max-width: none;
    padding: 12px 4px 14px;
    font-size: 14px;
    letter-spacing: 0.04em;
    &.active::after {
      width: 28px;
    }
  }
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.verify-card {
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(60, 50, 28, 0.92), rgba(120, 98, 56, 0.88));
  color: #fff;
  padding: 22px 24px 20px;
  .verify-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.28);
  }
  .verify-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }
  .verify-code {
    font-size: 26px;
    letter-spacing: 0.08em;
    font-weight: 500;
  }
  .verify-shield {
    width: 72px;
    height: auto;
    flex-shrink: 0;
  }
  .verify-bottom {
    padding-top: 14px;
    font-size: 14px;
    line-height: 1.75;
    .verify-sub {
      font-weight: 600;
      margin-bottom: 6px;
    }
    .hl {
      color: #ffd7a8;
      margin: 0 4px;
      font-weight: 600;
    }
  }
}

.trace.mobile .verify-card {
  padding: 16px;
  .verify-code {
    font-size: 20px;
  }
  .verify-shield {
    width: 56px;
  }
  .verify-bottom {
    font-size: 13px;
  }
}

.block {
  background: transparent;
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid rgba(60, 50, 28, 0.08);
  overflow: visible;
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
  padding: 0 0 16px;
}

.full-img {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 8px auto 0;
}

.video {
  width: 100%;
  display: block;
  background: #111;
  border-radius: 8px;
}
.video-cap {
  text-align: center;
  margin: 10px 0 0;
  color: rgba(60, 50, 28, 0.7);
  font-size: 14px;
}

.usage {
  padding: 4px 2px 18px !important;
  .usage-main {
    margin: 8px 0 16px;
    font-size: 20px;
    color: rgba(60, 50, 28, 1);
    font-weight: 500;
  }
  .usage-sec {
    margin-bottom: 18px;
    h3 {
      margin: 0 0 10px;
      font-size: 17px;
      color: rgba(60, 50, 28, 1);
    }
  }
  .usage-blk {
    margin-bottom: 12px;
    h4 {
      margin: 0 0 8px;
      font-size: 15px;
      color: rgba(60, 50, 28, 0.9);
    }
    p {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 1.75;
      color: rgba(60, 50, 28, 0.8);
    }
  }
}

.company-card {
  padding: 8px 2px 28px;
  border-bottom: 1px solid rgba(60, 50, 28, 0.08);
  &:last-child {
    border-bottom: 0;
  }
  h3 {
    margin: 0 0 12px;
    font-size: 18px;
    color: rgba(60, 50, 28, 1);
    font-weight: 500;
    letter-spacing: 0.04em;
  }
  p {
    margin: 0 0 14px;
    font-size: 15px;
    line-height: 1.8;
    color: rgba(60, 50, 28, 0.82);
  }
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.7);
  opacity: 1;
}
:deep(.swiper-pagination-bullet-active) {
  background: rgba(60, 50, 28, 1);
}
</style>
