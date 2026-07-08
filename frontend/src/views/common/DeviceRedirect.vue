<template></template>

<script setup lang="ts">
import { onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const redirectPath = route.query.redirect || "/"

  // 短暂延迟后跳转，让用户看到提示
  setTimeout(() => {
    router.replace(redirectPath as string)
  }, 100)
})
</script>

<style scoped lang="scss">
.device-redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
}

.loading-content {
  text-align: center;

  p {
    margin-top: 10px;
    font-size: 12px;
  }
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
