<script lang="ts">

import IconArrowHook from '@/components/icons/IconArrowHook.vue'
import router from '@/router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProductDetailHeader',
  components: { IconArrowHook },
  
  setup() {
    // 回退
    function clickHandler() {
      // 返回上一页
      router.go(-1)
    }
    
    return {
      clickHandler
    }
  }
})
</script>

<template>
  <div class="detail-header mb-8">
    <n-button text @click="clickHandler">
      <template #icon>
        <n-icon>
          <icon-arrow-hook />
        </n-icon>
      </template>
      Back
    </n-button>
  </div>
</template>

<style scoped>

</style>