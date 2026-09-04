<template></template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const raw = route.query.redirect
  const redirectPath = String((Array.isArray(raw) ? raw[0] : raw) || "/").trim() || "/"

  window.setTimeout(() => {
    router.replace(redirectPath).catch(() => {
      router.replace({ path: "/" })
    })
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
</style>
