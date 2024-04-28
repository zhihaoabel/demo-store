<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <n-message-provider placement="bottom">
    <n-modal-provider>
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-modal-provider>
  </n-message-provider>
</template>

<style scoped>

</style>
