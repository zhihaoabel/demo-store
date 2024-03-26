<script lang="ts">
import ProductCard from '@/components/products/ProductCard.vue'
import { defineComponent, ref } from 'vue'
import type { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'

export default defineComponent({
  name: 'ProductDetailRecommendations',
  components: { ProductCard },
  
  setup() {
    const currency = useCurrencyStore()
    // 推荐商品
    const recommendations = ref<Product[]>([
      {
        id: 1,
        name: 'Apple1',
        price: 1.5,
        currency: currency.sign,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 2,
        name: 'Apple2',
        price: 1.5,
        currency: currency.sign,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 3,
        name: 'Apple3',
        price: 1.5,
        currency: currency.sign,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      }
    ])
    
    return { recommendations }
  }
})
</script>

<template>
  <div class="recommendations-container flex-col items-center justify-center text-center mt-6">
    <n-divider class="text-2xl font-bold self-center">Recommendations</n-divider>
    <div class="recommendations grid gap-8 py-8 max-w-6xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      <product-card v-for="product in recommendations" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<style scoped>

</style>