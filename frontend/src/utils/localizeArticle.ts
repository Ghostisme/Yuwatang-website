/** 后台文章原始行（含多语言） */
export type ArticleApiRow = {
  id: number
  project_id?: number
  article_title: string
  article_title_en?: string
  article_title_jp?: string
  content?: string
  content_en?: string
  content_jp?: string
  datetime?: string | number
  createtime?: number
  author?: string
  image?: string
}

/** 按当前语言取标题/正文（缺省回退中文） */
export function localizeArticle(row: ArticleApiRow, locale: string) {
  const lang = locale === "en" || locale === "jp" ? locale : "zh"
  const title =
    (lang === "en" ? row.article_title_en : lang === "jp" ? row.article_title_jp : row.article_title) ||
    row.article_title ||
    ""
  const content =
    (lang === "en" ? row.content_en : lang === "jp" ? row.content_jp : row.content) ||
    row.content ||
    ""
  return {
    ...row,
    article_title: String(title).trim() || row.article_title,
    content: String(content).trim() || row.content || ""
  }
}
