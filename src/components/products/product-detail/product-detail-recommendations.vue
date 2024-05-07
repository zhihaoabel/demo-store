<script lang="ts">
import ProductCard from '@/components/products/ProductCard.vue'
import { defineComponent, ref } from 'vue'
import type { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'
import iphone13 from '@/assets/products/iphone13.jpg'
import samsung from '@/assets/products/samsung_S21.jpg'
import pixel6 from '@/assets/products/pixel6.jpg'
import macbook from '@/assets/products/macbook.jpg'
import dell from '@/assets/products/dell.jpg'
import sony from '@/assets/products/sony.jpg'
import bose from '@/assets/products/bose.jpg'
import watch from '@/assets/products/watch.jpg'
import fitbit from '@/assets/products/fitbit.jpg'

export default defineComponent({
  name: 'ProductDetailRecommendations',
  components: { ProductCard },
  
  setup() {
    const currency = useCurrencyStore()
    // 推荐商品
    const recommendations = ref<Product[]>([
      {
        id: 1,
        name: 'Apple iPhone 13',
        price: 10,
        currency: currency.getCurrency(),
        quantity: 0,
        image: iphone13,
        description: 'Latest model with A15 Bionic chip.',
        link: '/detail'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S21',
        price: 20,
        currency: currency.getCurrency(),
        quantity: 0,
        image: samsung,
        description: 'High-resolution cameras and a vibrant display.',
        link: '/detail'
      },
      {
        id: 3,
        name: 'Google Pixel 6',
        price: 30,
        currency: currency.getCurrency(),
        quantity: 0,
        image: pixel6,
        description: 'Smartest and fastest Pixel yet.',
        link: '/detail'
      },
      {
        id: 4,
        name: 'Apple MacBook Air',
        price: 40,
        currency: currency.getCurrency(),
        quantity: 0,
        image: macbook,
        description: 'With the new M1 chip, it’s our most powerful 13-inch MacBook Air.',
        link: '/detail'
      },
      {
        id: 5,
        name: 'Dell XPS 13',
        price: 50,
        currency: currency.getCurrency(),
        quantity: 0,
        image: dell,
        description: 'Stunning inside and out. The most powerful 13-inch in its class.',
        link: '/detail'
      },
      {
        id: 6,
        name: 'Sony WH-1000XM4',
        price: 60,
        currency: currency.getCurrency(),
        quantity: 0,
        image: sony,
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology.',
        link: '/detail'
      },
      {
        id: 7,
        name: 'Bose QuietComfort 35 II',
        price: 45,
        currency: currency.getCurrency(),
        quantity: 0,
        image: bose,
        description: 'Acoustic Noise Cancelling headphones.',
        link: '/detail'
      },
      {
        id: 8,
        name: 'Apple Watch Series 7',
        price: 75,
        currency: currency.getCurrency(),
        quantity: 0,
        image: watch,
        description: 'The future of health is on your wrist.',
        link: '/detail'
      },
      {
        id: 9,
        name: 'Fitbit Charge 5',
        price: 300,
        currency: currency.getCurrency(),
        quantity: 0,
        image: fitbit,
        description: 'Optimize your workout routine with a built-in GPS.',
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