<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <n-config-provider>
    <n-message-provider placement="bottom">
      <n-modal-provider>
        <n-dialog-provider>
          <RouterView />
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
