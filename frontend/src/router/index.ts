import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router"
import { createResponsiveRoutes } from "./responsive-routes"
import { deviceDetector } from "@/utils/device-detector"

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

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 存储上一次的设备类型
let lastDeviceType = deviceDetector.getDeviceType()
// 设备变化时重新加载页面
deviceDetector.onResize((newDeviceType) => {
  if (lastDeviceType !== newDeviceType) {
    console.log(`设备类型变化: ${lastDeviceType} -> ${newDeviceType}`)
    lastDeviceType = newDeviceType

    // 如果当前页面是响应式页面，重新加载以切换组件
    const currentRoute = router.currentRoute.value
    const needsRefresh = currentRoute.meta?.responsive
    if (needsRefresh) {
      // 使用重定向页面平滑过渡
      router.push({
        path: "/device-redirect",
        query: {
          redirect: currentRoute.fullPath,
          from: lastDeviceType,
          to: newDeviceType
        }
      })
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  const meta = to.meta as RouteMeta
  if (meta.title) {
    document.title = meta.title as string
  }

  // 检查是否需要认证
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
