<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProductCartHeader',
  setup(props, ctx) {
    
    
    return {
      props, ctx
    }
  },
})
</script>

<template>
  <div class="cart-header flex items-start">
    <h4 class="text-md font-semibold text-slate-950">Shopping Cart</h4>
  </div>
</template>

<style scoped>

</style>