import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const frontend = fileURLToPath(new URL("../", import.meta.url))
const repository = path.dirname(frontend)
const dist = path.join(frontend, "dist")
const sourceCache = process.env.CDN_UPLOAD_SOURCE_DIR || path.join(repository, "output", "cdn-upload-cache")
const mediaExtension = /\.(avif|gif|ico|jpe?g|png|svg|webp|mp4|webm|ogg)$/i
const built = JSON.parse(await readFile(path.join(dist, "media-cdn-build.json"), "utf8"))
if (!built.mediaCdnBase) throw new Error("当前 dist 未启用 CDN。先配置 VITE_MEDIA_CDN_BASE，再重新构建。")
const uploaded = JSON.parse(await readFile(path.join(frontend, "src/config/cdnUploads.json"), "utf8"))
const sha256 = (data) => createHash("sha256").update(data).digest("hex")

async function listMedia(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await listMedia(absolute))
    else if (entry.isFile() && mediaExtension.test(entry.name)) result.push(absolute)
  }
  return result
}

const entries = []
for (const file of await listMedia(dist)) {
  const relative = path.relative(dist, file).split(path.sep).join("/")
  const key = `${built.basePath}${relative}`.replace(/^\//, "")
  const data = await readFile(file)
  entries.push({ key, source: file, bytes: data.length, sha256: sha256(data), group: relative.split("/")[0] })
}
for (const [pathname, version] of Object.entries(uploaded)) {
  const key = pathname.replace(/^\//, "")
  const source = path.join(sourceCache, key)
  const data = await readFile(source)
  const hash = sha256(data)
  if (!hash.startsWith(version)) throw new Error(`已收集素材与前端清单不匹配：${key}`)
  entries.push({ key, source, bytes: data.length, sha256: hash, group: "uploads" })
}
entries.sort((a, b) => a.key.localeCompare(b.key))
if (new Set(entries.map((entry) => entry.key)).size !== entries.length) throw new Error("上传路径重复")

const batchHash = sha256(JSON.stringify(entries.map(({ key, sha256 }) => ({ key, sha256 })))).slice(0, 10)
const date = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10).replaceAll("-", "")
const output = path.join(repository, "output", `官网CDN素材_${date}_${batchHash}`)
const upload = path.join(output, "oss-upload")
await mkdir(upload, { recursive: true })
for (const entry of entries) {
  const target = path.join(upload, entry.key)
  await mkdir(path.dirname(target), { recursive: true })
  await copyFile(entry.source, target)
  if (sha256(await readFile(target)) !== entry.sha256) throw new Error(`复制校验失败：${entry.key}`)
}

const manifest = {
  batch: `${date}_${batchHash}`,
  cdnBase: built.mediaCdnBase,
  basePath: built.basePath,
  count: entries.length,
  bytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
  files: entries.map(({ key, bytes, sha256, group }) => ({ key, bytes, sha256, group }))
}
await writeFile(path.join(output, "asset-manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
const csv = ["OSS路径,字节数,SHA256,分类", ...entries.map(({ key, bytes, sha256, group }) => `${key},${bytes},${sha256},${group}`)].join("\r\n")
await writeFile(path.join(output, "素材清单.csv"), "\uFEFF" + csv)
await writeFile(path.join(output, "上传说明.txt"), `官网 CDN 素材批次：${manifest.batch}
文件数：${manifest.count}，合计 ${(manifest.bytes / 1024 / 1024).toFixed(1)} MiB。

1. 进入阿里云 OSS → website-frontend-oss → 文件列表。
2. 上传 oss-upload 内的所有文件/目录到 Bucket 根目录，保留 images、media、trace-assets、uploads 等相对路径。
   不要额外套一层 oss-upload，也不要直接把 ZIP 文件上传后当作网站资源。
   同路径素材允许覆盖；已上传的首页素材与本包中的文件一致。
3. 继续保持私有 Bucket 和现有 CDN 私有回源授权。
4. CDN 域名 ${manifest.cdnBase} → 缓存配置 → 修改出站响应头：
   Access-Control-Allow-Origin: https://www.yuhetangtcm.com
   响应头操作选“增加”，是否允许重复选“不允许”，仅供官网使用时填写上面的单个来源。
   基地视频通过 fetch 完整下载，必须让实际 CDN 响应带上此响应头。
   如在 OSS 配置跨域，允许来源同上，方法 GET、HEAD，允许 Header 为 *；
   如同时配置 CDN 响应头，避免出现两个 Access-Control-Allow-Origin 值。
5. MP4 的 Content-Type 应为 video/mp4，SVG 为 image/svg+xml，图片保持原类型。
6. 上传完成后验证 CDN 文件和跨域响应。新版文件使用构建哈希或 v 参数，CDN 缓存键须保留 v。
7. 最后发布同一次构建生成的 frontend/dist 到宝塔前端目录。
   先备份原前端；保留 PHP API、现有 uploads、服务器配置；不要用空目录整体替换网站根目录。

本包包含：前端构建输出的图片/封面/视频，以及本次公开 API 引用的门店图片、三语地图、新闻图片。
微小图标可能已经内嵌在代码中，无需额外上传。JS、CSS、字体和 API 继续由原站提供。
上传包与当前 dist 是配套文件；今后重新构建改变哈希文件名时，先重新上传素材再发布前端。
后台今后新增的图片默认继续使用原地址；再次收集并上传后才会改走 CDN。
当前 CDN 加速区域不含中国内地，国内节点需备案通过后再调整。
`)

const archive = path.join(output, "官网CDN素材.zip")
execFileSync(process.env.PYTHON || "python", ["-X", "utf8", "-c", `
import hashlib,json,pathlib,sys,zipfile
root,archive,manifest=map(pathlib.Path,sys.argv[1:])
entries=json.loads(manifest.read_text(encoding='utf-8'))['files']
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_STORED) as z:
    for item in entries:z.write(root/item['key'],item['key'])
with zipfile.ZipFile(archive) as z:
    assert sorted(z.namelist())==sorted(x['key'] for x in entries)
    for item in entries:assert hashlib.sha256(z.read(item['key'])).hexdigest()==item['sha256']
`, upload, archive, path.join(output, "asset-manifest.json")], { stdio: "inherit" })
const archiveStat = await stat(archive)
console.log(JSON.stringify({ ...manifest, files: undefined, output, upload, archive, archiveBytes: archiveStat.size }, null, 2))
