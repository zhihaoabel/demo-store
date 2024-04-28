<script lang="ts">

import ProductSummary from '@/components/products/product-checkout/product-summary.vue'
import ProductPayment from '@/components/products/product-checkout/product-payment.vue'
import { defineComponent, onBeforeMount, ref, type Ref, type UnwrapRef } from 'vue'
import { useRoute } from 'vue-router'
import { Product } from '@/entities/Product'

export default defineComponent({
  name: 'CheckoutView',
  components: {
    ProductSummary,
    ProductPayment
  },
  setup() {
    const route = useRoute()
    let product: Ref<UnwrapRef<Product>> = ref<Product>({} as Product)
    
    onBeforeMount(() => {
      product.value = {
        id: Number(route.query.id),
        name: String(route.query.name),
        price: Number(route.query.price),
        currency: String(route.query.currency),
        image: String(route.query.image),
        description: String(route.query.description),
        quantity: Number(route.query.stock),
        link: String(route.query.link)
      }
    })
    
    return {
      product
    }
  }
})
</script>

<template>
  <div
    class="checkout-container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-center p-2 max-w-6xl mx-auto">
    <product-summary :data="product" class=" max-w-96 mx-auto w-full" />
    <product-payment :data="product" class="col-span-2" />
  </div>
</template>

<style scoped>

</style>