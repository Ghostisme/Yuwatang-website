<template>
  <div class="buffered-video" :class="{ 'is-playing': videoPlaying }" @contextmenu.prevent>
    <img v-if="poster" class="video-poster" :src="poster" :alt="title || ''" />
    <video
      v-if="objectUrl"
      ref="videoRef"
      :src="objectUrl"
      :poster="poster"
      :aria-label="title"
      :controls="false"
      controlslist="nodownload nofullscreen noremoteplayback noplaybackrate"
      tabindex="-1"
      autoplay
      muted
      loop
      playsinline
      disablepictureinpicture
      disableremoteplayback
      preload="auto"
      @loadedmetadata="enforcePresentation"
      @playing="onPlaying"
      @error="videoPlaying = false"
      @volumechange="enforcePresentation"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue"

const props = defineProps<{
  src: string
  poster?: string
  title?: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const objectUrl = ref("")
const videoPlaying = ref(false)

const enforcePresentation = () => {
  const video = videoRef.value
  if (!video) return
  video.controls = false
  video.removeAttribute("controls")
  video.disablePictureInPicture = true
  video.disableRemotePlayback = true
  video.defaultMuted = true
  if (!video.muted) video.muted = true
  if (video.volume !== 0) video.volume = 0
}

const onPlaying = () => {
  videoPlaying.value = true
  enforcePresentation()
}

watch(
  () => props.src,
  async (src, _previous, onCleanup) => {
    const controller = new AbortController()
    let loadedUrl = ""
    let video: HTMLVideoElement | null = null

    onCleanup(() => {
      controller.abort()
      if (video) {
        video.pause()
        video.removeAttribute("src")
        video.load()
      }
      if (loadedUrl) URL.revokeObjectURL(loadedUrl)
    })

    objectUrl.value = ""
    videoPlaying.value = false

    try {
      const response = await fetch(src, { signal: controller.signal })
      if (!response.ok) throw new Error(`Video download failed: ${response.status}`)

      // 完整下载后才把本地 Blob 地址交给播放器，避免播放时继续请求视频。
      const blob = await response.blob()
      if (controller.signal.aborted) return
      if (!blob.size) throw new Error("Video download is empty")

      loadedUrl = URL.createObjectURL(blob)
      objectUrl.value = loadedUrl
      await nextTick()
      if (controller.signal.aborted) return
      video = videoRef.value
      enforcePresentation()
      await video?.play()
    } catch {
      // 下载失败或自动播放受限时保留封面，不显示额外控件。
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.buffered-video {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1a1610;

  video,
  .video-poster {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-poster {
    z-index: 1;
    transition: opacity 0.6s ease;
    pointer-events: none;
  }

  video {
    pointer-events: none;
  }

  video::-webkit-media-controls,
  video::-webkit-media-controls-enclosure,
  video::-webkit-media-controls-panel,
  video::-webkit-media-controls-overlay-enclosure,
  video::-webkit-media-controls-overlay-play-button,
  video::-webkit-media-controls-start-playback-button {
    display: none !important;
    opacity: 0 !important;
  }

  &.is-playing .video-poster {
    opacity: 0;
  }
}
</style>
