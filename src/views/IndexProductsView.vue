<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Product } from '@/entities/Product'
import ProductCard from '@/components/products/ProductCard.vue'
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
  name: 'IndexProductsView',
  components: { ProductCard },
  setup() {
    const currency = useCurrencyStore()
    let currencySign = ref(currency.sign)
    
    const products: Product[] = [
      {
        id: 1,
        name: 'Image 1',
        price: 10,
        currency: currency.getCurrency(),
        quantity: 0,
        image: iphone13,
        description: 'This is an image 1 description.',
        link: '/detail'
      },
      {
        id: 2,
        name: 'Image 2',
        price: 20,
        currency: currency.getCurrency(),
        quantity: 0,
        image: samsung,
        description: 'This is an image 2 description.',
        link: '/detail'
      },
      {
        id: 3,
        name: 'Image 3',
        price: 30,
        currency: currency.getCurrency(),
        quantity: 0,
        image: pixel6,
        description: 'This is an image 3 description.',
        link: '/detail'
      },
      {
        id: 4,
        name: 'Image 4',
        price: 40,
        currency: currency.getCurrency(),
        quantity: 0,
        image: macbook,
        description: 'This is an image 4 description.',
        link: '/detail'
      },
      {
        id: 5,
        name: 'Image 5',
        price: 50,
        currency: currency.getCurrency(),
        quantity: 0,
        image: dell,
        description: 'This is an image 5 description.',
        link: '/detail'
      },
      {
        id: 6,
        name: 'Image 6',
        price: 60,
        currency: currency.getCurrency(),
        quantity: 0,
        image: sony,
        description: 'This is an image 6 description.',
        link: '/detail'
      },
      {
        id: 7,
        name: 'Image 7',
        price: 45,
        currency: currency.getCurrency(),
        quantity: 0,
        image: bose,
        description: 'This is an image 7 description.',
        link: '/detail'
      },
      {
        id: 8,
        name: 'Image 8',
        price: 75,
        currency: currency.getCurrency(),
        quantity: 0,
        image: watch,
        description: 'This is an image 8 description.',
        link: '/detail'
      },
      {
        id: 9,
        name: 'Image 9',
        price: 300,
        currency: currency.getCurrency(),
        quantity: 0,
        image: fitbit,
        description: 'This is an image 9 description.',
        link: '/detail'
      }
    ]
    
    return {
      products, currency, currencySign
    }
  },
  watch: {
    'currency.sign': {
      handler() {
        this.currencySign = this.currency.sign
      }
    }
  }
})
</script>

<template>
  <div
    class="products-container grid gap-8 p-8 max-w-6xl mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 scroll-auto">
    <product-card v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>

<style scoped>

</style>