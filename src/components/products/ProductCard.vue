<template>
  <router-link :to="{name: 'product-detail', query: productQuery, params: {id: productQuery.id}}">
    <n-card :title="product.name" class="flex-col justify-center hover:bg-slate-400 hover:text-white" hoverable
            size="small">
      <template #cover>
        <img :alt="product.name" :src="product.image">
      </template>
      <p v-html="product.description"></p>
      <template #footer>
        <div class="flex items-center justify-between">
          <span>{{ currency.sign }} {{ product.price }}</span>
        </div>
      </template>
    </n-card>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue'
import { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'

export default defineComponent({
  name: 'ProductCard',
  setup(props) {
    const currency = useCurrencyStore()
    const productQuery = computed(() => {
      return {
        id: props.product.id,
        name: props.product.name,
        price: props.product.price,
        currency: props.product.currency,
        image: props.product.image,
        description: props.product.description,
        stock: props.product.quantity,
        link: props.product.link
      }
    })
    return { currency, productQuery }
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      default: () => ({
        id: 1,
        name: 'Apple',
        price: 1.5,
        currency: '$',
        image: 'https://demo-pacheckoutdemo.airwallex.com/assets/img/book1.png',
        description: 'An apple is an edible fruit produced by an apple tree.',
        stock: 99,
        link: 'https://www.apple.com/'
      })
    }
  }
})
</script>

<style scoped>

</style>