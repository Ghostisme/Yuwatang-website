import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// 在 ES 模块中获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function checkI18nBuild() {
  const distPath = path.resolve(__dirname, "../dist")

  console.log("🔍 检查 i18n 构建结果...")

  // 检查主要 JS 文件
  const jsDir = path.join(distPath, "js")
  if (!fs.existsSync(jsDir)) {
    console.log("❌ js 目录不存在")
    return false
  }

  const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith(".js"))

  let foundI18n = false

  jsFiles.forEach((file) => {
    const filePath = path.join(distPath, "js", file)
    const content = fs.readFileSync(filePath, "utf8")

    // 检查是否包含语言消息
    const hasZhMessages = content.includes("品牌介绍") || content.includes("footer.item1")
    const hasEnMessages = content.includes("Brand Introduction") || content.includes("About Us")

    if (hasZhMessages || hasEnMessages) {
      console.log(`✅ ${file} 包含语言资源`)
      foundI18n = true

      // 检查具体的消息键
      const keysToCheck = ["footer.item1", "home.item1", "serve.item1"]
      keysToCheck.forEach((key) => {
        if (content.includes(key)) {
          console.log(`   📦 找到消息键: ${key}`)
        }
      })
    }
  })

  if (!foundI18n) {
    console.log("❌ 未在 JS 文件中找到语言资源")
    console.log("💡 可能的原因:")
    console.log("   - 语言包没有被正确导入")
    console.log("   - Tree-shaking 移除了未使用的语言资源")
    console.log("   - 构建配置有问题")
  }

  return foundI18n
}

checkI18nBuild()
