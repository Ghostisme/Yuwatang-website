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
    method: "get",
    params: { page: 1, limit: 50 }
  })
}

/** 官网门店列表（动态） */
export const getStoreList = (params: { page?: number; limit?: number } = {}) => {
  return request({
    url: "/api/ygame/store/index",
    method: "get",
    params: { page: 1, limit: 50, ...params }
  })
}

/** 官网门店详情 */
export const getStoreDetail = (slug: string) => {
  return request({
    url: "/api/ygame/store/info",
    method: "get",
    params: { slug }
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

export const getFeedbackList = (params: { page?: number; limit?: number } = {}) => {
  return request({
    url: "/api/ygame/feedback/index",
    method: "get",
    params
  })
}

export const submitFeedback = (data: { name: string; content: string }) => {
  return request({
    url: "/api/ygame/feedback/submit",
    method: "post",
    data
  })
}
