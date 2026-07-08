import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"

// 扩展配置接口
interface RequestConfig extends InternalAxiosRequestConfig {
  // 可以在这里添加自定义配置
  showLoading?: boolean
  retryCount?: number
}

// 响应数据接口
interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: "http://www.yuhetangtcm.com/api.php",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
  maxRedirects: 5 // 允许有限次数的重定向
})

// 请求拦截器
request.interceptors.request.use(
  (config: RequestConfig) => {
    // 在发送请求之前做些什么，例如添加token
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 可以在这里添加加载状态管理
    if (config.showLoading) {
      // 显示加载提示
      console.log("请求开始，显示loading...")
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const config: RequestConfig = response.config

    // 隐藏加载提示
    if (config.showLoading) {
      console.log("请求完成，隐藏loading...")
    }

    // 如果后端有统一的响应格式，可以在这里处理
    // 例如：return response.data.data
    return response.data
  },
  (error) => {
    // 处理错误响应
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem("token")
      // 跳转到登录页
      console.log("未授权，跳转到登录页")
      // window.location.href = "/login"
    } else if (error.response?.status === 500) {
      console.error("服务器内部错误")
    }

    return Promise.reject(error)
  }
)

export default request
