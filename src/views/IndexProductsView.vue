<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Product } from '@/entities/Product'
import ProductCard from '@/components/products/ProductCard.vue'
import { useCurrencyStore } from '@/stores/currency'

export default defineComponent({
  name: 'IndexProductsView',
  components: { ProductCard },
  setup() {
    const currencyStore = useCurrencyStore()
    let currencySign = ref(currencyStore.sign)
    
    let products: Product[] = [
      {
        id: 1,
        name: 'Apple1',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 2,
        name: 'Apple2',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 3,
        name: 'Apple3',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 4,
        name: 'Apple4',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 5,
        name: 'Apple5',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 6,
        name: 'Apple6',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 7,
        name: 'Apple7',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 8,
        name: 'Apple8',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      },
      {
        id: 9,
        name: 'Apple9',
        price: 1.5,
        currency: currencySign.value,
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        quantity: 0,
        link: '/detail'
      }
    ]
    
    return {
      products, currencyStore, currencySign
    }
  },
  watch: {
    'currencyStore.sign': {
      handler() {
        this.currencySign = this.currencyStore.sign
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