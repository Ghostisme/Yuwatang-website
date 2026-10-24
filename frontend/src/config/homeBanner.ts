import { rewriteMediaUrl } from "@/utils/mediaCdn"

const version = "20261024"

const withVersion = (baseUrl: string, path: string) => rewriteMediaUrl(`${baseUrl}${path}?v=${version}`)

export type HomeBannerAssets = {
  isPortrait: boolean
  posterSrc: string
  videoSources: string[]
}

type NetworkConnection = {
  effectiveType?: string
  saveData?: boolean
}

let initialAssets: HomeBannerAssets | undefined

// Cache the initial selection so responsive page remounts also keep the same orientation.
export const getHomeBannerAssets = (): HomeBannerAssets => {
  if (initialAssets) return initialAssets

  const baseUrl = String(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")
  const isPortrait =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-aspect-ratio: 1/1)").matches

  const connection = typeof navigator !== "undefined"
    ? (navigator as Navigator & { connection?: NetworkConnection }).connection
    : undefined
  const preferLightweight = connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType || "")

  initialAssets = {
    isPortrait,
    posterSrc: withVersion(baseUrl, `images/${isPortrait ? "home-banner-mobile-poster.jpg" : "home-banner-poster.jpg"}`),
    videoSources: (isPortrait
      ? ["home-banner-mobile-720x1280.mp4", "home-banner-mobile-1080x1920.mp4"]
      : preferLightweight
        ? ["home-banner-720p.mp4"]
        : ["home-banner-1080p.mp4", "home-banner-720p.mp4"]
    ).map((name) => withVersion(baseUrl, `media/${name}`))
  }

  return initialAssets
}
