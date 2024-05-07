<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useShowStore } from '@/stores/show'

export default defineComponent({
  name: 'ProductCartAction',
  setup(props, ctx) {
    const show = useShowStore()
    const showCart = ref<boolean>(show.showCart)
    
    function toggleCart() {
      show.toggleShowCart()
    }
    
    return {
      props, ctx, showCart, show, toggleCart
    }
  },
  
})
</script>

<template>
  <div class="cart-action flex items-center justify-between mt-4 px-4">
    <button
      class="bg-slate-900 text-gray-50 px-5 py-2.5 border rounded-lg hover:bg-slate-700 hover:text-gray-100 ring-cyan-900 active:ring-2 hover:shadow-lg hover:font-semibold shadow-blue-500">
      Checkout
    </button>
    <button
      class="text-gray-900 px-5 py-2.5 border rounded-lg hover:ring-slate-800 hover:text-gray-800 ring-slate-800 active:ring-2 ml-4 hover:font-semibold hover:shadow-lg shadow-blue-800"
      @click="toggleCart">
      Continue Shopping
    </button>
  </div>
</template>

<style scoped>

</style>