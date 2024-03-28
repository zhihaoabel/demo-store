<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageFooter',
  setup() {
    const year = new Date().getFullYear()
    
    return {
      year
    }
  }
})
</script>

<template>
  <!--  关于-->
  <n-layout-footer position="absolute">
    <div class="text-center">
      <span>© {{year}}. All rights reserved.</span>
    </div>
  </n-layout-footer>
</template>

<style scoped>
.n-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.n-layout-content {
  flex-grow: 1;
}
</style>