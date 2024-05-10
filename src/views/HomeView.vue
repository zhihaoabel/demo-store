<script lang="ts" setup>
import PageHeader from '@/components/layout/header/page-header.vue'
import PageFooter from '@/components/layout/footer/page-footer.vue'
</script>

<template>
  <n-layout >
    <page-header class="self-center w-full"/>
    <router-view />
    <page-footer class="fixed bottom-0 self-center w-full"/>
  </n-layout>
</template>

<style scoped>

:deep(.n-layout-scroll-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
