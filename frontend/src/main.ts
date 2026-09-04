import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import i18n from "./i18n"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { lazyLoadDirective } from "./utils/lazy-load"
import "./utils/rem"
import "./assets/main.css"
import "./assets/base.css"
import "./assets/font/font.css"
import "./assets/premium.css"
import { revealDirective } from "./utils/premium-motion"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedstate)

app.directive("lazy", lazyLoadDirective)
app.directive("reveal", revealDirective)
app.use(router)
app.use(i18n)

/**
 * 必须等首屏路由解析完成再 mount。
 * 否则 App/useHreflang 会在默认 location `/` 上执行 router.replace(?lang=)，
 * 把正在进行的 /trace、/faq 等深链导航冲掉，刷新后落到首页。
 */
router.isReady().then(() => {
  app.mount("#app")
})
