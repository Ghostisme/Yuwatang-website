import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
// 显式导入 i18n 的 index 入口，确保使用带有 messages 和 globalInjection 配置的实例
import i18n from "./i18n"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { lazyLoadDirective } from "./utils/lazy-load"
import "./utils/rem"
import "./assets/main.css"
import "./assets/base.css"
import "./assets/font/font.css"

// 导入 Swiper 样式
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedstate)

app.directive("lazy", lazyLoadDirective)
app.use(router)
app.use(i18n)

app.mount("#app")
