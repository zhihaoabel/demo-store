<script lang="ts">
import { defineComponent, type Ref, ref } from 'vue'
import { useShowStore } from '@/stores/show'
import router from '@/router'
import type { Product } from '@/entities/Product'
import { useCartStore } from '@/stores/cart'

export default defineComponent({
  name: 'ProductCartAction',
  setup(props, ctx) {
    const show = useShowStore()
    const cart = useCartStore()
    const showCart = ref<boolean>(show.showCart)
    const products:Ref = ref<Product[]>([] as Product[])
    
    products.value = props.product as Product[]
    
    function toggleCart() {
      show.toggleShowCart()
    }
    
    function toCart() {
      router.push({ name: 'cart', query: { date: new Date().getTime() } })
    }
    
    return {
      props, ctx, showCart, show, toggleCart, toCart, cart
    }
  },
  
  props: {
    product: {
      type: Object as () => Product[],
    },
  }
  
})
</script>

<template>
  <div class="cart-action flex items-center justify-between mt-4 px-4">
    <button
      class="bg-slate-900 text-gray-50 px-5 py-2.5 border rounded-lg hover:bg-slate-700 hover:text-gray-100 ring-cyan-900 active:ring-1 hover:shadow-lg hover:font-semibold shadow-blue-500"
      @click="toCart">
      View Cart
    </button>
    <button
      class="text-gray-900 px-5 py-2.5 border rounded-lg hover:ring-slate-500 hover:text-gray-800 ring-slate-500 active:ring-1 ml-4 hover:font-semibold hover:shadow-lg shadow-blue-800"
      @click="toggleCart">
      Continue Shopping
    </button>
  </div>
</template>

<style scoped>

</style>