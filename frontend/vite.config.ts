import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import postcssPxtorem from "postcss-pxtorem"
import Components from "unplugin-vue-components/vite"
import { VantResolver } from "unplugin-vue-components/resolvers"
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import { resolve, dirname } from "path" // 确保导入 resolve
import { fileURLToPath, URL } from "node:url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// 加载环境变量

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    base: env.VITE_BASE_URL || "/", // 项目地址
    server: {
      host: "0.0.0.0", // 或 process.env.VITE_HOST
      open: true, // 自动打开浏览器
      cors: true,
      proxy: {
        // 开发环境代理配置
        "/api": {
          target: env.VITE_API_BASE_URL, // 代理地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    },
    plugins: [
      vue(),
      VueI18nPlugin({
        include: path.resolve(__dirname, "./src/locales/**"),
        strictMessage: false
      }),
      Components({
        resolvers: [VantResolver()]
      })
    ],
    build: {
      target: "es2015",
      outDir: "dist",
      assetsDir: "assets",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html")
        },
        output: {
          // 入口 JS 文件
          entryFileNames: "js/entries/[name]-[hash].js",

          // 代码分割 chunk
          chunkFileNames: "js/chunks/[name]-[hash].js",

          // CSS 文件
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".json")) {
              return "locales/[name]-[hash][extname]"
            }

            const extType = assetInfo.name?.split(".").pop()?.toLowerCase() || ""
            const name = assetInfo.name?.split(".")[0] || ""

            // CSS 文件
            if (extType === "css") {
              if (name === "index") {
                return "css/main-[hash][extname]"
              }
              return "css/[name]-[hash][extname]"
            }

            // 图片分类
            if (/png|jpe?g|svg|gif|webp/i.test(extType)) {
              if (name.includes("icon") || name.includes("ico")) {
                return "images/icons/[name]-[hash][extname]"
              }
              if (name.includes("logo")) {
                return "images/logos/[name]-[hash][extname]"
              }
              return "images/[name]-[hash][extname]"
            }

            // 字体文件
            if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
              return "fonts/[name]-[hash][extname]"
            }

            // 其他文件
            return "assets/[name]-[hash][extname]"
          },

          // i18n
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            i18n: ["vue-i18n"]
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    css: {
      // postcss: {
      //   plugins: [
      //     postcssPxtorem({
      //       rootValue: 16, // 根元素字体大小，rem相对px转换的基准值，通常为16px
      //       unitPrecision: 3, // 转rem精确到小数点后3位
      //       exclude: /(node_modules|vant-theme\.css)/i, // 排除 Vant 和变量文件
      //       propList: ["*"], // 需要转换的属性，*表示所有
      //       selectorBlackList: ["div", "span"], // 不进行px转换的选择器
      //       replace: true, // 是否直接更换属性值，而不添加备用属性
      //       mediaQuery: false, // 是否在媒体查询的css代码中也进行转换
      //       minPixelValue: 0 // 设置要替换的最小像素值
      //     })
      //   ]
      // }
    }
  }
})
