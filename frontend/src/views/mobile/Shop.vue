<template>
  <div class="shop">
    <div>
      <div class="shop-banner">
        <img :src="shopBannerSrc" alt="" />
      </div>
      <div class="shop-title">
        <img src="@/assets/img/shop-tit-bg.png" alt="" />
        <div class="title-text">
          {{ t("shop.item1") }}
        </div>
        <div class="subtit-text" v-html="t('shop.item10')"></div>
      </div>
    </div>
    <!-- 主内容区 -->
    <div class="shop-content">
      <!-- 右侧内容区域 -->
      <div class="content">
        <div v-for="(item, index) in menuItems" :key="index" class="section" :id="item.id">
          <img :src="item.src" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import { getStoreBanner } from "@/api"
import ShopPic1 from "@/assets/img/shop-pic1.png"
import ShopPic2 from "@/assets/img/shop-pic2.png"
import ShopPic3 from "@/assets/img/shop-pic3.png"
import ShopPic4 from "@/assets/img/shop-pic4.png"
import ShopPic5 from "@/assets/img/shop-pic5.png"
import ShopPic6 from "@/assets/img/shop-pic6.png"
import ShopPic7 from "@/assets/img/shop-pic7.png"
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

const shopBannerSrc = ref(ShopBanZh)

const getBanner = () => {
  // 可以在这里调用获取首页banner的接口
  getStoreBanner().then((res: any) => {
    console.log("首页banner数据：", res)
    if (res.code == 1) {
      let array = res.data.data
      let menuArray = menuItems.value
      array.map((item: any, index: number) => {
        let imageUrl = ""
        console.log(item)
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
        console.log(imageUrl, "图片地址")
        menuArray[index].src = item.image
      })
      console.log(menuArray, "菜单图片地址")
      menuItems.value = menuArray
    }
  })
}

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

onMounted(() => {
  getBanner()
})
</script>
<style lang="scss" scoped>
.shop {
  width: 100%;
  min-height: calc(100vh - 240px);
  margin-top: 50px;
  overflow: hidden;
  &-banner {
    width: 100%;
    img {
      width: 100%;
      display: block;
    }
  }
  &-title {
    width: 100%;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0px;
    text-align: center;
    position: relative;
    img {
      position: absolute;
      width: 391px;
      top: -10px;
      left: -10px;
      z-index: 1;
    }
    .title-text {
      padding-top: 30px;
      width: 300px;
      margin: 0 auto;
      color: rgba(60, 50, 28, 1);
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      text-align: center;
      position: relative;
      z-index: 5;
    }
    .subtit-text {
      width: 345px;
      margin: 0 auto 10px;
      margin-top: 10px;
      color: rgba(194, 153, 116, 1);
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: -1px;
      text-align: center;
      position: relative;
      z-index: 5;
    }
  }

  .shop-content {
    display: flex;
    position: relative;
    z-index: 5;
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
