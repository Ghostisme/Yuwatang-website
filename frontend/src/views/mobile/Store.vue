<template>
  <div class="store">
    <div class="store-banner">
      <img src="@/assets/img/store-banner.png" alt="" />
    </div>
    <div class="store-box" style="padding: 0 15px">
      <div class="store-title">{{ t("store.item1") }}</div>
      <div class="store-boxs">
        <div class="store-box-item" v-for="(item, index) in storeList" :key="index">
          <div class="item-head" @click="item.isOpen = !item.isOpen">
            <div class="item-city">{{ item.city }}</div>
            <img :class="item.isOpen ? 'active' : ''" src="@/assets/img/select-icon.svg" alt="" />
          </div>
          <div class="item-list" v-if="item.isOpen">
            <div class="item-list-box" v-for="(item2, index2) in item.list" :key="index2">
              <div class="box-name">{{ item2.name }}</div>
              <div class="box-text">
                {{ t("store.item5") }} <span>{{ item2.address }}</span>
              </div>
              <div class="box-text">
                {{ t("store.item6") }} <span>{{ item2.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="store-title mt100">{{ t("store.item28") }}</div>
      <div class="store-subtit">{{ t("store.item29") }}</div>
      <div class="store-btn" @click="goContact">{{ t("store.item30") }}</div>
    </div>

    <img class="left-icon" src="@/assets/img/left-icon.png" alt="" />
    <img class="right-icon" src="@/assets/img/right-icon.png" alt="" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
const { t, locale } = useI18n()
const router = useRouter()

const storeList = ref([
  {
    city: t("store.item2"),
    isOpen: false,
    list: [
      {
        name: t("store.item22"),
        address: t("store.item23"),
        phone: t("store.item24")
      },
      {
        name: t("store.item19"),
        address: t("store.item20"),
        phone: t("store.item21")
      },
      {
        name: t("store.item13"),
        address: t("store.item14"),
        phone: t("store.item15")
      },
      {
        name: t("store.item10"),
        address: t("store.item11"),
        phone: t("store.item12")
      }
    ]
  },
  {
    city: t("store.item3"),
    isOpen: false,
    list: [
      {
        name: t("store.item16"),
        address: t("store.item17"),
        phone: t("store.item18")
      }
    ]
  },
  {
    city: t("store.item4"),
    isOpen: false,
    list: [
      {
        name: t("store.item7"),
        address: t("store.item8"),
        phone: t("store.item9")
      },
      {
        name: t("store.item25"),
        address: t("store.item26"),
        phone: t("store.item27")
      }
    ]
  }
])

const storeKey = ref(Date.now())

// 监听 locale 变化
watch(locale, async () => {
  storeList.value = [
    {
      city: t("store.item2"),
      isOpen: false,
      list: [
        {
          name: t("store.item22"),
          address: t("store.item23"),
          phone: t("store.item24")
        },
        {
          name: t("store.item19"),
          address: t("store.item20"),
          phone: t("store.item21")
        },
        {
          name: t("store.item13"),
          address: t("store.item14"),
          phone: t("store.item15")
        },
        {
          name: t("store.item10"),
          address: t("store.item11"),
          phone: t("store.item12")
        }
      ]
    },
    {
      city: t("store.item3"),
      isOpen: false,
      list: [
        {
          name: t("store.item16"),
          address: t("store.item17"),
          phone: t("store.item18")
        }
      ]
    },
    {
      city: t("store.item4"),
      isOpen: false,
      list: [
        {
          name: t("store.item7"),
          address: t("store.item8"),
          phone: t("store.item9")
        },
        {
          name: t("store.item25"),
          address: t("store.item26"),
          phone: t("store.item27")
        }
      ]
    }
  ]
  // 更新 key 强制重新渲染组件
  storeKey.value = Date.now()

  // 等待 DOM 更新
  await nextTick()
})
const goContact = () => {
  router.push({
    path: "/contact-us"
  })
}
</script>
<style lang="scss" scoped>
.store {
  min-height: calc(100vh - 240px);
  margin-top: 50px;
  position: relative;
  width: 100%;
  overflow: hidden;
  &-banner {
    width: 100%;
    img {
      width: 100%;
      display: block;
    }
  }
  &-box {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    .box-text {
      display: flex;
      align-items: flex-start;
      span {
        flex: 1;
      }
    }
  }
  &-title {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    color: rgba(60, 50, 28, 1);
    font-size: 24px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0px;
    text-align: center;
    &.mt100 {
      margin-top: 100px;
    }
  }
  &-boxs {
    .store-box-item {
      .item-head {
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(224, 204, 185, 1);
        cursor: pointer;
        .item-city {
          font-size: 14px;
          line-height: 20px;
        }
        img {
          width: 15px;
          height: 15px;
          cursor: pointer;
          transform: rotateX(180deg);
          &.active {
            transform: rotateY(0deg);
          }
        }
      }
      .item-list {
        padding: 0 10px;
        .item-list-box {
          padding: 10px 0;
          margin-top: 10px;
          font-size: 12px;
          line-height: 18px;
          font-weight: 400;
          color: rgba(60, 50, 28, 1);
          .box-name {
            font-weight: bold;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  &-subtit {
    width: 100%;
    color: rgba(60, 50, 28, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0px;
    text-align: center;
    padding: 0 10px;
  }
  &-btn {
    padding: 15px 16px;
    border-bottom: 1px solid rgba(194, 153, 116, 1);
    background: rgba(255, 255, 255, 0);
    color: rgba(194, 153, 116, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 1px;
    text-align: center;
    margin: 15px auto 100px;
    cursor: pointer;
    display: inline-block;
  }
}
.left-icon {
  position: absolute;
  top: 815px;
  left: -132px;
  width: 363px;
  height: 363px;
  display: block;
  z-index: 1;
}
.right-icon {
  position: absolute;
  width: 550px;
  height: 304px;
  display: block;
  right: -186px;
  top: 1177px;
  z-index: 1;
}
</style>
