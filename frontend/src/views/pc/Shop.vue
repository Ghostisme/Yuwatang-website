<template>
  <div class="shop">
    <div ref="topContentRef">
      <div class="shop-banner">
        <img :src="shopBannerSrc" alt="" />
      </div>
      <div class="shop-title">
        <img src="@/assets/img/shop-tit-bg.png" alt="" />
        <div class="title-text">
          {{ t("shop.item1") }}
        </div>
        <div class="subtit-text" v-html="t('shop.item2')"></div>
      </div>
    </div>
    <!-- 主内容区 -->
    <div class="shop-content">
      <!-- 左侧导航菜单 -->
      <aside class="sidebar" :class="{ fixed: isFixed }" ref="sidebarRef">
        <ul>
          <li
            v-for="(item, index) in menuItems"
            :key="index"
            :class="{ active: activeIndex === index }"
            @click="scrollToSection(index)"
          >
            <div class="address-icon">
              <img v-show="activeIndex === index" src="@/assets/img/address-icon.svg" alt="" />
            </div>
            {{ item.name }}
          </li>
        </ul>
      </aside>

      <!-- 右侧内容区域 -->
      <div class="content">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          :ref="(el) => (sectionRefs[index] = el)"
          class="section"
          :id="item.id"
        >
          <img :src="item.src" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue"
import { useI18n } from "vue-i18n"
import { getStoreBanner } from "@/api"
import ShopPic1 from "@/assets/img/shop-pic1.jpg"
import ShopPic2 from "@/assets/img/shop-pic2.jpg"
import ShopPic3 from "@/assets/img/shop-pic3.jpg"
import ShopPic4 from "@/assets/img/shop-pic4.jpg"
import ShopPic5 from "@/assets/img/shop-pic5.jpg"
import ShopPic6 from "@/assets/img/shop-pic6.jpg"
import ShopPic7 from "@/assets/img/shop-pic7.jpg"
import ShopBanZh from "@/assets/img/shop-banner-zh.jpg"
import ShopBanEn from "@/assets/img/shop-banner-en.jpg"
import ShopBanJp from "@/assets/img/shop-banner-jp.jpg"

const { t, locale } = useI18n()

// 定义菜单项目类型
interface MenuItem {
  id: string
  name: string
  src: string
}

// 菜单数据
const menuItems = ref<MenuItem[]>([
  {
    id: "section1",
    name: t("shop.item3"),
    src: ShopPic1
  },
  {
    id: "section2",
    name: t("shop.item4"),
    src: ShopPic2
  },
  {
    id: "section3",
    name: t("shop.item5"),
    src: ShopPic3
  },
  {
    id: "section4",
    name: t("shop.item6"),
    src: ShopPic4
  },
  {
    id: "section5",
    name: t("shop.item7"),
    src: ShopPic5
  },
  {
    id: "section6",
    name: t("shop.item8"),
    src: ShopPic6
  },
  {
    id: "section7",
    name: t("shop.item9"),
    src: ShopPic7
  }
])

// 引用
const topContentRef = ref<HTMLDivElement | null>(null)
const sidebarRef = ref<HTMLElement | null>(null)
const sectionRefs = ref<(HTMLElement | null)[]>([])

// 状态
const isFixed = ref(false)
const activeIndex = ref(0)
const sidebarOffsetTop = ref(0)
const rootFontSize = ref(16)
const wxheight = ref(0)
const sectionPositions = ref([])
const windowWidth = ref(window.innerWidth)
const shopBannerSrc = ref(ShopBanZh)

const getBanner = () => {
  // 可以在这里调用获取首页banner的接口
  getStoreBanner().then((res: any) => {
    if (res.code == 1) {
      let array = res.data.data
      let menuArray = menuItems.value
      array.map((item: any, index: number) => {
        let imageUrl = ""
        switch (locale.value) {
          case "zh":
            imageUrl = item.image
            break
          case "en":
            imageUrl = item.image_en
            break
          case "jp":
            imageUrl = item.image_jp
            break
        }
        menuArray[index].src = item.image
      })
      menuItems.value = menuArray
    }
  })
}

// 当窗口宽度或 refs 变化时重新计算
watch(
  [windowWidth, sectionRefs],
  () => {
    calculatePositions()
    scrollToSection(activeIndex.value)
  },
  { deep: true }
)

// 监听 locale 变化
watch(
  locale,
  (newLocale, oldLocale) => {
    console.log(`语言从 ${oldLocale} 切换到 ${newLocale}`)
    switch (newLocale) {
      case "zh":
        shopBannerSrc.value = ShopBanZh
        break
      case "en":
        shopBannerSrc.value = ShopBanEn
        break
      case "jp":
        shopBannerSrc.value = ShopBanJp
        break
    }
    getBanner()
  },
  { immediate: true }
)

// 计算每个区块的位置
const calculatePositions = () => {
  sectionPositions.value = sectionRefs.value.map((section) => {
    if (section) {
      const rect = section.getBoundingClientRect()
      return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        height: rect.height,
        width: rect.width
      }
    }
    return { top: 0, bottom: 0, height: 0, width: 0 }
  })
}

// 滚动到指定区块
const scrollToSection = (index: number) => {
  const section = sectionPositions.value[index]
  if (section) {
    window.scrollTo({
      top: section.top - wxheight.value + 20, // 减去一点偏移量
      behavior: "smooth"
    })
  }
}

// 处理滚动事件
const handleScroll = () => {
  const scrollTop = window.scrollY

  // 处理侧边栏固定逻辑
  if (sidebarRef.value && topContentRef.value) {
    if (scrollTop >= sidebarOffsetTop.value) {
      isFixed.value = true
    } else {
      isFixed.value = false
    }
  }

  // 处理当前激活菜单项
  for (let i = sectionPositions.value.length - 1; i >= 0; i--) {
    const position = sectionPositions.value[i]
    if (scrollTop >= position.top - wxheight.value) {
      // 提前100px激活
      activeIndex.value = i
      break
    }
  }
}

// 等待所有图片加载完成
const waitForImagesLoad = (): Promise<void> => {
  return new Promise((resolve) => {
    const images = document.querySelectorAll("img")
    let loadedCount = 0
    const totalImages = images.length

    if (totalImages === 0) {
      resolve()
      return
    }

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        resolve()
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        checkAllLoaded()
      } else {
        img.addEventListener("load", checkAllLoaded)
        img.addEventListener("error", checkAllLoaded) // 即使加载失败也继续
      }
    })
  })
}

// 获取根元素（html）的字体大小
const getRootFontSize = (): number => {
  const htmlElement = document.documentElement
  const fontSize = window.getComputedStyle(htmlElement).fontSize
  return parseFloat(fontSize)
}

// 处理窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
  rootFontSize.value = getRootFontSize()
  wxheight.value = rootFontSize.value * 7.6875
  // 计算侧边栏初始位置
  if (sidebarRef.value && topContentRef.value) {
    sidebarOffsetTop.value = topContentRef.value.offsetHeight - wxheight.value
  }
}

// 初始化
onMounted(async () => {
  getBanner()
  // 等待DOM更新完成
  await nextTick()

  // 等待所有图片加载完成
  await waitForImagesLoad()

  calculatePositions()
  // 监听窗口大小变化
  window.addEventListener("resize", handleResize)

  // 监听滚动事件
  window.addEventListener("scroll", handleScroll)

  // 初始触发一次滚动事件以设置正确状态
  handleResize()
  handleScroll()
})

// 清理
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
  window.removeEventListener("resize", handleResize)
})
</script>
<style lang="scss" scoped>
.shop {
  min-height: calc(100vh - 383px);
  width: 100%;
  overflow: hidden;
  margin-top: 88px;
  &-banner {
    width: 100%;
    img {
      width: 100%;
      display: block;
    }
  }
  &-title {
    width: 100%;
    // height: 450px;
    padding-bottom: 160px;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    text-align: center;
    position: relative;
    img {
      position: absolute;
      width: 1960px;
      top: -20px;
      left: -20px;
      z-index: 1;
    }
    .title-text {
      padding-top: 87px;
      width: 100%;
      color: rgba(60, 50, 28, 1);
      font-size: 36px;
      font-weight: 500;
      line-height: 44px;
      letter-spacing: 0px;
      text-align: center;
      position: relative;
      z-index: 5;
    }
    .subtit-text {
      margin-top: 39px;
      color: rgba(194, 153, 116, 1);
      font-size: 28px;
      font-weight: 400;
      line-height: 40px;
      letter-spacing: -1px;
      text-align: center;
      position: relative;
      z-index: 5;
    }
  }

  .shop-content {
    display: flex;
    margin-top: -103px;
    position: relative;
    z-index: 5;
  }

  .sidebar {
    width: 286px;
    padding: 20px 0;
    transition: all 0.3s ease;
    margin-left: 59px;
    position: absolute;
  }

  .sidebar.fixed {
    position: fixed;
    top: 15%;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    cursor: pointer;
    color: rgba(60, 50, 28, 0.6);
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: 0px;
    text-align: left;
    transition: background-color 0.2s;
    .address-icon {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      img {
        display: block;
        width: 100%;
      }
    }
  }

  .sidebar li.active {
    color: rgba(194, 153, 116, 1);
  }

  .content {
    flex: 1;
  }

  .section {
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>
