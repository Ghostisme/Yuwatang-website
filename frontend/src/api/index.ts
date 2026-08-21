import request from "./request"

// post模板
export const caseApi = (formData: any) => {
  return request({
    url: "/api/cases",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const getHomeBanner = () => {
  return request({
    url: "/api/ygame/banner",
    method: "get"
  })
}

export const getStoreBanner = () => {
  return request({
    url: "/api/ygame/store",
    method: "get"
  })
}

export const getArticleList = (data: { project_id?: number; page: number; limit: number }) => {
  return request({
    url: "/api/ygame/article/index",
    method: "post",
    data
  })
}

export const getArticleDetail = (id: number) => {
  return request({
    url: "/api/ygame/article/info",
    method: "post",
    data: { id }
  })
}

export const submitFeedback = (data: {
  name: string
  phone: string
  store_name: string
  content: string
}) => {
  return request({
    url: "/api/ygame/feedback/submit",
    method: "post",
    data
  })
}
