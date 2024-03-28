<script lang="ts" setup>
import PageHeader from '@/components/layout/header/page-header.vue'
import PageFooter from '@/components/layout/footer/page-footer.vue'
</script>

<template>
  <n-layout position="absolute">
    <page-header />
    <router-view />
    <page-footer />
  </n-layout>
</template>
