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
  <n-layout-footer class="">
    <div class="text-center flex justify-center">
      <div class="flex flex-col justify-center">
        <span>© {{year}}. All rights reserved.</span>
      </div>
    </div>
  </n-layout-footer>
</template>

<style scoped>
</style>