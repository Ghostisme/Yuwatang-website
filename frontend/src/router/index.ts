import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { migrateLegacyHashUrl } from "@/utils/hashMigration"
import { createResponsiveRoutes } from "./responsive-routes"
import { deviceDetector } from "@/utils/device-detector"

migrateLegacyHashUrl(import.meta.env.BASE_URL)

// 使用 Record 类型直接定义 meta
type RouteMeta = Record<string, unknown> & {
  title?: string
  requiresAuth?: boolean
}

// 通用页面（不需要响应式的页面）
const commonRoutes: RouteRecordRaw[] = [
  {
    path: "/device-redirect",
    name: "DeviceRedirect",
    component: () => import("@/views/common/DeviceRedirect.vue"),
    meta: {
      title: "页面跳转中..."
    }
  }
]

const routes: RouteRecordRaw[] = [
  ...createResponsiveRoutes(),
  ...commonRoutes,
  // 404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/common/NotFound.vue"),
    meta: {
      title: "页面未找到"
    }
  }
]

// 需求2-23：History 模式，独立网址（无 #）
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 存储上一次的设备类型；路由就绪前忽略 resize，避免 redirect 落到默认 `/`
let lastDeviceType = deviceDetector.getDeviceType()
let deviceRedirectReady = false

router.isReady().then(() => {
  // 首屏布局/滚动条引起的宽度抖动稍后再监听
  window.setTimeout(() => {
    deviceRedirectReady = true
    lastDeviceType = deviceDetector.getDeviceType()
  }, 800)
})

deviceDetector.onResize((newDeviceType) => {
  if (!deviceRedirectReady) {
    lastDeviceType = newDeviceType
    return
  }
  if (lastDeviceType === newDeviceType) return

  console.log(`设备类型变化: ${lastDeviceType} -> ${newDeviceType}`)
  lastDeviceType = newDeviceType

  const currentRoute = router.currentRoute.value
  if (!currentRoute.meta?.responsive) return
  if (currentRoute.path === "/device-redirect") return

  router.push({
    path: "/device-redirect",
    query: {
      redirect: currentRoute.fullPath,
      from: lastDeviceType,
      to: newDeviceType
    }
  })
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const meta = to.meta as RouteMeta
  if (meta.title && !meta.seoTitle) {
    document.title = meta.title as string
  }

  if (meta.requiresAuth) {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      next("/login")
      return
    }
  }

  next()
})

export type { RouteMeta }
export default router
