/** 基准大小 */
const baseSize = 16

function setRem() {
  const clientWidth = document.documentElement.clientWidth
  const isMobile = clientWidth <= 768
  const baseWidth = isMobile ? 375 : 1920
  const scale = document.documentElement.clientWidth / baseWidth // 375是设计稿的宽度
  console.log(baseSize * Math.min(scale, 2))
  let fontSize = 0
  if (isMobile) {
    fontSize = baseSize * Math.min(scale, 2) > 16 ? baseSize * Math.min(scale, 2) : 16
  } else {
    fontSize = baseSize * Math.min(scale, 2)
  }
  document.documentElement.style.fontSize = `${fontSize}px`
}

// 初始化
setRem()

// 改变窗口大小时重新设置rem
window.onresize = function () {
  setRem()
}
