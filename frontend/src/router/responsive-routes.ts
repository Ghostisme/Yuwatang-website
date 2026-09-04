/**
 * 响应式路由配置（需求2 路径）
 */
import type { RouteRecordRaw } from "vue-router"
import { deviceDetector } from "@/utils/device-detector"
import { defineAsyncComponent, ref, onMounted, onUnmounted, h } from "vue"
import { legacyRedirects } from "@/config/navigation"

export const pageComponents = {
  home: {
    desktop: () => import("@/views/pc/Home.vue"),
    mobile: () => import("@/views/mobile/Home.vue")
  },
  services: {
    desktop: () => import("@/views/pc/Services.vue"),
    mobile: () => import("@/views/mobile/Services.vue")
  },
  serviceDetail: {
    desktop: () => import("@/views/pc/ServiceDetail.vue"),
    mobile: () => import("@/views/mobile/ServiceDetail.vue")
  },
  base: {
    desktop: () => import("@/views/pc/Base.vue"),
    mobile: () => import("@/views/mobile/Base.vue")
  },
  serve: {
    desktop: () => import("@/views/pc/Serve.vue"),
    mobile: () => import("@/views/mobile/Serve.vue")
  },
  shop: {
    desktop: () => import("@/views/pc/Shop.vue"),
    mobile: () => import("@/views/mobile/Shop.vue")
  },
  stores: {
    desktop: () => import("@/views/pc/Stores.vue"),
    mobile: () => import("@/views/mobile/Stores.vue")
  },
  storeDetail: {
    desktop: () => import("@/views/pc/StoreDetail.vue"),
    mobile: () => import("@/views/mobile/StoreDetail.vue")
  },
  about: {
    desktop: () => import("@/views/pc/AboutUs.vue"),
    mobile: () => import("@/views/mobile/AboutUs.vue")
  },
  contact: {
    desktop: () => import("@/views/pc/ContactUs.vue"),
    mobile: () => import("@/views/mobile/ContactUs.vue")
  },
  reviews: {
    desktop: () => import("@/views/pc/Reviews.vue"),
    mobile: () => import("@/views/mobile/Reviews.vue")
  },
  news: {
    desktop: () => import("@/views/pc/News.vue"),
    mobile: () => import("@/views/mobile/News.vue")
  },
  newsDetail: {
    desktop: () => import("@/views/pc/NewsDetail.vue"),
    mobile: () => import("@/views/mobile/NewsDetail.vue")
  },
  trace: {
    desktop: () => import("@/views/pc/Trace.vue"),
    mobile: () => import("@/views/mobile/Trace.vue")
  },
  faq: {
    desktop: () => import("@/views/pc/Faq.vue"),
    mobile: () => import("@/views/mobile/Faq.vue")
  },
  guide: {
    desktop: () => import("@/views/pc/Guide.vue"),
    mobile: () => import("@/views/mobile/Guide.vue")
  }
} as const

const createResponsiveWrapper = (pageKey: keyof typeof pageComponents) =>
  defineAsyncComponent({
    loader: async () => {
      const { defineComponent, ref, onMounted, onUnmounted } = await import("vue")

      return defineComponent({
        name: "ResponsiveWrapper",
        setup(props, { attrs, slots }) {
          const deviceType = ref(deviceDetector.getDeviceType())
          const CurrentComponent = ref<ReturnType<typeof defineAsyncComponent>>()

          const loadComponent = () => {
            const componentMap = pageComponents[pageKey]
            const loader = deviceType.value === "mobile" ? componentMap.mobile : componentMap.desktop
            CurrentComponent.value = defineAsyncComponent(loader)
          }

          const handleResize = () => {
            const newDeviceType = deviceDetector.getDeviceType()
            if (newDeviceType !== deviceType.value) {
              deviceType.value = newDeviceType
              loadComponent()
            }
          }

          let resizeTimer: number
          const debouncedResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = window.setTimeout(handleResize, 100)
          }

          onMounted(() => {
            loadComponent()
            window.addEventListener("resize", debouncedResize)
          })

          onUnmounted(() => {
            window.removeEventListener("resize", debouncedResize)
            clearTimeout(resizeTimer)
          })

          return () => {
            if (!CurrentComponent.value) return null
            return h(CurrentComponent.value, { ...attrs }, slots)
          }
        }
      })
    }
  })

const legacyRedirectRoutes: RouteRecordRaw[] = Object.entries(legacyRedirects).map(([from, to]) => ({
  path: from,
  redirect: () => ({ path: to, replace: true })
}))

export function createResponsiveRoutes(): RouteRecordRaw[] {
  return [
    ...legacyRedirectRoutes,
    {
      path: "/",
      name: "Home",
      component: createResponsiveWrapper("home"),
      meta: { seoTitle: "seo.home.title", seoDesc: "seo.home.description", responsive: true }
    },
    {
      path: "/about",
      name: "About",
      component: createResponsiveWrapper("about"),
      meta: { seoTitle: "seo.about.title", seoDesc: "seo.about.description", responsive: true }
    },
    {
      path: "/services",
      name: "Services",
      component: createResponsiveWrapper("services"),
      meta: { seoTitle: "seo.services.title", seoDesc: "seo.services.description", responsive: true }
    },
    {
      path: "/services/:slug",
      name: "ServiceDetail",
      component: createResponsiveWrapper("serviceDetail"),
      meta: { responsive: true }
    },
    {
      path: "/base",
      name: "Base",
      component: createResponsiveWrapper("base"),
      meta: { seoTitle: "seo.base.title", seoDesc: "seo.base.description", responsive: true }
    },
    {
      path: "/stores",
      name: "Stores",
      component: createResponsiveWrapper("stores"),
      meta: { seoTitle: "seo.stores.title", seoDesc: "seo.stores.description", responsive: true }
    },
    {
      path: "/stores/:slug",
      name: "StoreDetail",
      component: createResponsiveWrapper("storeDetail"),
      meta: { responsive: true }
    },
    {
      path: "/reviews",
      name: "Reviews",
      component: createResponsiveWrapper("reviews"),
      meta: { seoTitle: "seo.reviews.title", seoDesc: "seo.reviews.description", responsive: true }
    },
    {
      path: "/contact",
      name: "Contact",
      component: createResponsiveWrapper("contact"),
      meta: { seoTitle: "seo.contact.title", seoDesc: "seo.contact.description", responsive: true }
    },
    {
      path: "/news",
      name: "News",
      component: createResponsiveWrapper("news"),
      meta: { seoTitle: "seo.news.title", seoDesc: "seo.news.description", responsive: true }
    },
    {
      path: "/news/:id",
      name: "NewsDetail",
      component: createResponsiveWrapper("newsDetail"),
      meta: { responsive: true }
    },
    {
      path: "/trace",
      name: "Trace",
      component: createResponsiveWrapper("trace"),
      meta: { seoTitle: "seo.trace.title", seoDesc: "seo.trace.description", responsive: true }
    },
    {
      path: "/faq",
      name: "Faq",
      component: createResponsiveWrapper("faq"),
      meta: { seoTitle: "seo.faq.title", seoDesc: "seo.faq.description", responsive: true }
    },
    {
      path: "/guide",
      name: "Guide",
      component: createResponsiveWrapper("guide"),
      meta: { seoTitle: "seo.guide.title", seoDesc: "seo.guide.description", responsive: true }
    },
    { path: "/serve", redirect: "/services/traditional" }
  ]
}
