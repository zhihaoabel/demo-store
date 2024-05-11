<script lang="ts">

import ProductSummary from '@/components/products/product-checkout/product-summary.vue'
import ProductPayment from '@/components/products/product-checkout/product-payment.vue'
import { defineComponent, onBeforeMount, onUnmounted, ref, type Ref, type UnwrapRef } from 'vue'
import { Product } from '@/entities/Product'
import { useCartStore } from '@/stores/cart'

export default defineComponent({
  name: 'CheckoutView',
  components: {
    ProductSummary,
    ProductPayment
  },
  setup() {
    const cart = useCartStore()
    let products: Ref<UnwrapRef<Product[]>> = ref<Product[]>({} as Product[])
    
    onBeforeMount(() => {
      // 优先从localStorage中获取直接下单的商品
      const directOrderProduct = ref(localStorage.getItem('directOrderProduct'))
      if (directOrderProduct.value) {
        products.value = [JSON.parse(directOrderProduct.value)]
        cart.directOrderProduct = JSON.parse(directOrderProduct.value)
        return
      }
      // 直接下单和购物车二选一
      if (cart.directOrderProduct.id) {
        products.value = [cart.directOrderProduct]
      } else {
        products.value = cart.cart.products
      }
    })
    
    onUnmounted(() => {
      // 清除直接下单的商品
      localStorage.removeItem('directOrderProduct')
    })
    
    return {
      products
    }
  }
})
</script>

<template>
  <div
    class="checkout-container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-center p-2 max-w-6xl mx-auto">
    <product-summary :data="products" class="max-w-96 mx-auto w-full sm:border-r-2 border-slate-100 " />
    <product-payment :data="products" class="col-span-2" />
  </div>
</template>

<style scoped>

</style>