import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { getHomeBannerAssets } from "@/config/homeBanner"

export function useHomeBanner() {
  const { posterSrc: bannerPosterSrc, videoSources } = getHomeBannerAssets()
  const sourceIndex = ref(0)
  const bannerVideoSrc = computed(() => videoSources[sourceIndex.value])
  const videoReady = ref(false)
  const videoPlaying = ref(false)
  let idleHandle: number | undefined
  let timerHandle: number | undefined

  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }

  const handleBannerCanPlay = (event: Event) => {
    const video = event.currentTarget as HTMLVideoElement
    video.muted = true
    void video.play().catch(() => {
      // Keep the poster visible if the browser blocks autoplay.
      videoPlaying.value = false
    })
  }

  const handleBannerVideoError = () => {
    videoPlaying.value = false
    // Retry the alternate version for this orientation, then retain the poster.
    if (sourceIndex.value < videoSources.length - 1) sourceIndex.value += 1
  }

  onMounted(() => {
    const enableVideo = () => { videoReady.value = true }
    if (typeof idleWindow.requestIdleCallback === "function") {
      idleHandle = idleWindow.requestIdleCallback(enableVideo, { timeout: 2500 })
    } else {
      timerHandle = window.setTimeout(enableVideo, 2000)
    }
  })

  onBeforeUnmount(() => {
    if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle)
    if (timerHandle !== undefined) window.clearTimeout(timerHandle)
  })

  return { bannerPosterSrc, bannerVideoSrc, videoReady, videoPlaying, handleBannerCanPlay, handleBannerVideoError }
}
