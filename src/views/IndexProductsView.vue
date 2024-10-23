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
        id: 5,
        name: 'Checkout(Onerway-hosted)',
        price: 50,
        currency: currency.getCurrency(),
        quantity: 0,
        image: dell,
        description: 'Customer will be redirected to Onerway payment page',
        link: '/detail',
        paymentMethod: 'checkout'
      },
      {
        id: 6,
        name: 'Direct Payment',
        price: 60,
        currency: currency.getCurrency(),
        quantity: 0,
        image: sony,
        description: 'It supports local wallets and card payment',
        link: '/detail',
        paymentMethod: 'local-payment'
      },
      {
        id: 7,
        name: 'SDK-Checkout(embedded form)',
        price: 45,
        currency: currency.getCurrency(),
        quantity: 0,
        image: bose,
        description: 'Standard checkout form that does not require redirect',
        link: '/detail',
        paymentMethod: 'sdk-checkout'
      },
      {
        id: 8,
        name: 'SDK-Token(embedded form)',
        price: 75,
        currency: currency.getCurrency(),
        quantity: 0,
        image: watch,
        description: 'Standard token form that does not require redirect',
        link: '/detail',
        paymentMethod: 'sdk-token'
      },
      {
        id: 9,
        name: 'SDK-Subscription(embedded form)',
        price: 300,
        currency: currency.getCurrency(),
        quantity: 0,
        image: fitbit,
        description: 'Standard subscription form that does not require redirect',
        link: '/detail',
        paymentMethod: 'sdk-subscription'
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
    class="grid max-w-6xl gap-8 p-8 mx-auto products-container sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 scroll-auto">
    <product-card v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>

<style scoped>

</style>