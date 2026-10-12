<template>
  <div class="service-media" :class="{ 'has-image': imageSrc }">
    <img v-if="imageSrc" :src="imageSrc" :alt="t(service.nameKey)" loading="lazy" />
    <div v-else class="service-art" aria-hidden="true">
      <span class="art-brand">YU HEALTH</span>
      <div class="art-emblem">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path v-for="(d, index) in iconPaths" :key="index" :d="d" />
        </svg>
      </div>
      <span class="art-name">{{ t(service.nameKey) }}</span>
      <span class="art-line"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import type { ServiceInfo } from "@/config/services"

const props = defineProps<{ service: ServiceInfo }>()
const { t } = useI18n()
const images = import.meta.glob("../assets/img/*", { eager: true, import: "default" }) as Record<string, string>
const imageSrc = computed(() => {
  const image = props.service.image.trim()
  if (!image) return ""
  return images[`../assets/img/${image}`] || image
})

const icons: Record<string, string[]> = {
  cupping: [
    "M23 14h18v8l6 8v16a6 6 0 0 1-6 6H23a6 6 0 0 1-6-6V30l6-8z",
    "M23 22h18M22 42h20M26 7v3m12-3v3M22 52h20"
  ],
  "gua-sha": [
    "M18 14c7-5 13 2 14 9 1-7 8-14 14-8 9 9-1 21-8 30-3 4-7 8-11 7-5-2-3-9-6-13-4-6-11-18-3-25z",
    "M23 19c-3 5 0 12 4 18m16-16c-1 7-6 14-10 19"
  ],
  "ear-care": [
    "M20 24c0-10 6-16 15-16s15 7 15 16c0 10-9 13-12 19-2 4-2 10-8 11-6 1-11-3-11-9",
    "M27 24c0-5 3-9 8-9 6 0 9 4 9 9 0 5-5 8-9 10m-7-9c6-2 10 2 8 6-1 3-7 3-7 8"
  ],
  pedicure: [
    "M35 22c-3 7-3 13 1 19 4 7 1 13-7 14-10 1-16-6-14-14 2-6 5-10 6-15",
    "M24 23c-4 1-7-2-7-6 0-5 3-8 6-7 4 0 6 4 5 8-1 3-2 4-4 5z",
    "M33 12c4-1 7 4 5 7-2 3-6 1-6-2-1-2-1-4 1-5zm9 5c3-1 6 3 4 6-2 2-5 0-5-2-1-2-1-3 1-4zm7 8c3 0 4 3 2 5-2 1-5-1-4-3 0-1 1-2 2-2",
    "M24 38c-3 5-3 9 1 11"
  ],
  "pediatric-tuina": [
    "M32 27a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM26 10c1-4 6-5 8-1",
    "M21 45v-7a7 7 0 0 1 7-7h8a7 7 0 0 1 7 7v7",
    "M9 35v8c0 8 11 11 23 14 12-3 23-6 23-14v-8M13 42l11 5m27-5-11 5"
  ]
}
const iconPaths = computed(() => icons[props.service.slug] || [])
</script>

<style scoped lang="scss">
.service-media {
  aspect-ratio: 4 / 3;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #f3ebdf;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.service-art {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 28px;
  color: #947348;
  background: linear-gradient(145deg, #f8f2e9, #ede2d2);
}
.art-brand {
  font-size: 10px;
  letter-spacing: 0.3em;
  color: rgba(122, 86, 54, 0.65);
}
.art-emblem {
  width: 106px;
  height: 106px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(148, 115, 72, 0.24);
  border-radius: 50%;
  svg {
    width: 66px;
    height: 66px;
  }
}
.art-name {
  max-width: 100%;
  font-family: "LinHai", var(--font-zh);
  font-size: 26px;
  line-height: 1.4;
  text-align: center;
  color: var(--pm-ink);
}
.art-line {
  width: 32px;
  height: 1px;
  background: var(--pm-gold);
}
@media (max-width: 768px) {
  .service-art {
    gap: 14px;
    padding: 24px;
  }
  .art-emblem {
    width: 82px;
    height: 82px;
    svg {
      width: 54px;
      height: 54px;
    }
  }
  .art-name {
    font-size: 22px;
  }
}
</style>
