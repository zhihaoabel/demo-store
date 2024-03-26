<script lang="ts" setup>

import PageHeaderRight from '@/components/layout/header/page-header-right.vue'
</script>

<template>
  <n-layout-header class="border-b">
    <div class="header-container flex items-center justify-between px-4 max-h-20">
      <div class="logo-container">
        <router-link to="/"><img class="store-logo" alt="store logo" src="/logo.png" width="75"></router-link>
      </div>
      <page-header-right />
    </div>
  </n-layout-header>
</template>

<style scoped>
</style>