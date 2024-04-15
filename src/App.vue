<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <n-message-provider placement="bottom">
    <RouterView />
  </n-message-provider>
</template>

<style scoped>

</style>
