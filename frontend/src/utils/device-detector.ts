/**
 * 设备检测工具
 */

export type DeviceType = "mobile" | "tablet" | "desktop"

class DeviceDetector {
  private breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1025
  }

  /**
   * 获取当前设备类型
   */
  public getDeviceType(): DeviceType {
    const width = window.innerWidth
    console.log(width)
    if (width <= this.breakpoints.mobile) {
      return "mobile"
    } else if (width <= this.breakpoints.tablet) {
      return "tablet"
    } else {
      return "desktop"
    }
  }

  /**
   * 检测是否为移动设备
   */
  public isMobile(): boolean {
    return this.getDeviceType() === "mobile"
  }

  /**
   * 检测是否为平板设备
   */
  public isTablet(): boolean {
    return this.getDeviceType() === "tablet"
  }

  /**
   * 检测是否为桌面设备
   */
  public isDesktop(): boolean {
    return this.getDeviceType() === "desktop"
  }

  /**
   * 监听窗口大小变化
   */
  public onResize(callback: (deviceType: DeviceType) => void): () => void {
    const handler = () => {
      callback(this.getDeviceType())
    }

    window.addEventListener("resize", handler)

    // 返回取消监听函数
    return () => {
      window.removeEventListener("resize", handler)
    }
  }

  /**
   * 获取断点配置
   */
  public getBreakpoints() {
    return { ...this.breakpoints }
  }
}

// 创建单例
export const deviceDetector = new DeviceDetector()

// 导出工具函数
export const getDeviceType = (): DeviceType => deviceDetector.getDeviceType()
export const isMobile = (): boolean => deviceDetector.isMobile()
export const isTablet = (): boolean => deviceDetector.isTablet()
export const isDesktop = (): boolean => deviceDetector.isDesktop()
