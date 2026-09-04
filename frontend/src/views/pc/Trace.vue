<template>
  <TraceBoard variant="pc" />
</template>

<script setup lang="ts">
import TraceBoard from "@/components/TraceBoard.vue"
import { usePageSeo } from "@/composables/usePageSeo"

usePageSeo({ titleKey: "seo.trace.title", descriptionKey: "seo.trace.description" })
</script>
