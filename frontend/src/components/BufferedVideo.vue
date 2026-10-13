<template>
  <video
    ref="videoRef"
    :src="src"
    :poster="poster"
    :title="title"
    controls
    muted
    playsinline
    preload="auto"
    :autoplay="autoplayReady"
    @loadedmetadata="checkBuffer"
    @loadeddata="checkBuffer"
    @progress="checkBuffer"
    @canplay="checkBuffer"
    @play="onPlay"
    @volumechange="keepMuted"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"

defineProps<{
  src: string
  poster?: string
  title?: string
}>()

const INITIAL_BUFFER_SECONDS = 30
const MAX_AUTOPLAY_WAIT_MS = 8000
const videoRef = ref<HTMLVideoElement | null>(null)
const autoplayReady = ref(false)
let hasStarted = false
let autoplayRequested = false
let waitExpired = false
let startupTimer: ReturnType<typeof setTimeout> | undefined

const clearStartupTimer = () => {
  if (startupTimer !== undefined) {
    clearTimeout(startupTimer)
    startupTimer = undefined
  }
}

const keepMuted = () => {
  const video = videoRef.value
  if (!video) return
  video.defaultMuted = true
  if (!video.muted) video.muted = true
  if (video.volume !== 0) video.volume = 0
}

const onPlay = () => {
  hasStarted = true
  clearStartupTimer()
  keepMuted()
}

const checkBuffer = () => {
  const video = videoRef.value
  if (!video || hasStarted || autoplayRequested || video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return

  const target = Number.isFinite(video.duration)
    ? Math.min(INITIAL_BUFFER_SECONDS, video.duration - video.currentTime)
    : INITIAL_BUFFER_SECONDS
  let bufferedAhead = 0
  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) <= video.currentTime && video.buffered.end(i) > video.currentTime) {
      bufferedAhead = video.buffered.end(i) - video.currentTime
      break
    }
  }

  // 优先缓冲 30 秒；浏览器限制预加载或网速较慢时，不无限等待封面。
  if (!waitExpired && bufferedAhead + 0.1 < target) return
  autoplayRequested = true
  autoplayReady.value = true
  clearStartupTimer()
  keepMuted()
  video.play().catch(() => {
    // 浏览器阻止自动播放时，保留原生播放控件供用户点击。
    autoplayReady.value = false
  })
}

onMounted(() => {
  keepMuted()
  startupTimer = setTimeout(() => {
    waitExpired = true
    checkBuffer()
  }, MAX_AUTOPLAY_WAIT_MS)
  checkBuffer()
})

onBeforeUnmount(() => {
  clearStartupTimer()
  videoRef.value?.pause()
})
</script>
