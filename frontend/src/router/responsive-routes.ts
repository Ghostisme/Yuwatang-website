/**
 * 响应式路由配置
 */
import type { RouteRecordRaw } from "vue-router"
import { deviceDetector } from "@/utils/device-detector"
import { defineAsyncComponent, ref, onMounted, onUnmounted, watch, h } from "vue"

// 页面组件映射
export const pageComponents = {
  home: {
    desktop: () => import("@/views/pc/Home.vue"),
    mobile: () => import("@/views/mobile/Home.vue")
  },
  // 其他页面...
  feature: {
    desktop: () => import("@/views/pc/Feature.vue"),
    mobile: () => import("@/views/mobile/Feature.vue")
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
  store: {
    desktop: () => import("@/views/pc/Store.vue"),
    mobile: () => import("@/views/mobile/Store.vue")
  },
  aboutUs: {
    desktop: () => import("@/views/pc/AboutUs.vue"),
    mobile: () => import("@/views/mobile/AboutUs.vue")
  },
  contactUs: {
    desktop: () => import("@/views/pc/ContactUs.vue"),
    mobile: () => import("@/views/mobile/ContactUs.vue")
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
  }
} as const

/**
 * 创建响应式包装组件
 */
const createResponsiveWrapper = (pageKey: keyof typeof pageComponents) =>
  defineAsyncComponent({
    loader: async () => {
      const { defineComponent, ref, onMounted, onUnmounted, watch } = await import("vue")

      return defineComponent({
        name: "ResponsiveWrapper",
        setup(props, { attrs, slots }) {
          const deviceType = ref(deviceDetector.getDeviceType())
          console.log("触发！！！！！", deviceType.value)
          const CurrentComponent = ref<ReturnType<typeof defineAsyncComponent>>()

          // 加载对应设备组件
          const loadComponent = () => {
            const componentMap = pageComponents[pageKey]
            const loader = deviceType.value === "mobile" ? componentMap.mobile : componentMap.desktop
            CurrentComponent.value = defineAsyncComponent(loader)
          }

          // 监听窗口大小变化
          const handleResize = () => {
            const newDeviceType = deviceDetector.getDeviceType()
            console.log(1111)
            if (newDeviceType !== deviceType.value) {
              deviceType.value = newDeviceType
              loadComponent()
            }
          }

          // 防抖函数
          let resizeTimer: number
          const debouncedResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = window.setTimeout(handleResize, 100)
          }

          onMounted(() => {
            loadComponent() // 初始加载
            window.addEventListener("resize", debouncedResize)
          })

          onUnmounted(() => {
            window.removeEventListener("resize", debouncedResize)
            clearTimeout(resizeTimer)
          })

          return () => {
            if (!CurrentComponent.value) {
              return null
            }
            return h(CurrentComponent.value, { ...attrs }, slots)
          }
        }
      })
    }
  })

/**
 * 创建响应式路由
 */
export function createResponsiveRoutes(): RouteRecordRaw[] {
  return [
    {
      path: "/",
      name: "Home",
      component: createResponsiveWrapper("home"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/feature",
      name: "Feature",
      component: createResponsiveWrapper("feature"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/base",
      name: "Base",
      component: createResponsiveWrapper("base"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/serve",
      name: "Serve",
      component: createResponsiveWrapper("serve"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/shop",
      name: "Shop",
      component: createResponsiveWrapper("shop"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/store",
      name: "Store",
      component: createResponsiveWrapper("store"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/about-us",
      name: "AboutUs",
      component: createResponsiveWrapper("aboutUs"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/contact-us",
      name: "ContactUs",
      component: createResponsiveWrapper("contactUs"),
      meta: {
        title: "裕和堂 Yu Health",
        responsive: true
      }
    },
    {
      path: "/news",
      name: "News",
      component: createResponsiveWrapper("news"),
      meta: {
        title: "裕和堂 - 资讯",
        responsive: true
      }
    },
    {
      path: "/news/:id",
      name: "NewsDetail",
      component: createResponsiveWrapper("newsDetail"),
      meta: {
        title: "裕和堂 - 资讯详情",
        responsive: true
      }
    },
    {
      path: "/trace",
      name: "Trace",
      component: createResponsiveWrapper("trace"),
      meta: {
        title: "裕和堂 - 产品溯源",
        responsive: true
      }
    }
  ]
}
