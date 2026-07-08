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
