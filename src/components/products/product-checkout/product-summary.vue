<script lang="ts">
import { defineComponent, onBeforeMount, ref, type Ref, type UnwrapRef } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import type { Product } from '@/entities/Product'
import { useCartStore } from '@/stores/cart'

export default defineComponent({
  name: 'ProductSummary',
  
  setup(props) {
    const currency = useCurrencyStore()
    const cart = useCartStore()
    const product: Ref<UnwrapRef<Product>> = ref<Product>({} as Product)
    
    onBeforeMount(() => {
      product.value = props.data
    })
    
    return { currency, product, cart }
  },
  
  props: {
    data: {
      type: Object as () => Product,
      required: true
    }
  }
})
</script>


<template>
  <n-card :bordered="false" class="ml-8" title="Summary">
    <!--    header，title旁边的内容 -->
    <template #header-extra>
    
    </template>
    
    <div class="card-content-container flex items-center justify-between">
      <img :src="product.image" alt="product image" class="product-image max-w-24 mr-8 rounded-xl" />
      <div class="product-info self-start ">
        <div class="product-description min-w-24 font-semibold">{{ product.description }}</div>
      </div>
    </div>
    
    <!--    total 的内容-->
    <div class="sub-total flex items-center justify-between mt-4">
      <span>Subtotal</span>
      <span>{{ currency.sign }} 0</span>
    </div>
    <div class="shipping flex items-center justify-between mt-4">
      <span>Shipping</span>
      <span>{{ currency.sign }} 0</span>
    </div>
    <div class="total flex items-center justify-between border-t py-2 mt-4">
      <span class="font-bold">Total</span>
      <span class="font-semibold text-lg text-red-600">{{ currency.sign }} 0</span>
    </div>
  
  </n-card>
</template>


<style scoped>
</style>