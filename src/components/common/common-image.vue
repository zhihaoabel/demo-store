<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Image } from '@/entities/Image'

export default defineComponent({
  name: 'CommonImage',
  
  setup() {
    return {
      // data
    }
  },
  
  props: {
    images: {
      type: Array as PropType<Image[]>,
      default: () => []
    }
  }
})
</script>

<template>
  <n-image-group show-toolbar-tooltip>
    <n-space v-if="$props.images">
      <n-image v-for="image in $props.images"
               :key="image.id"
               :alt="image.alt"
               :height="image.height"
               :src="require('@/assets/images/your-image.png')"
               :width="image.width" />
    </n-space>
  </n-image-group>
</template>

<style scoped>

</style>