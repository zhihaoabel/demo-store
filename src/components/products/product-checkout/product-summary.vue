<script lang="ts">
import { defineComponent, onBeforeMount, ref, type Ref, type UnwrapRef } from 'vue'
import { useCurrencyStore } from '@/stores/currency'
import type { Product } from '@/entities/Product'

export default defineComponent({
  name: 'ProductSummary',
  
  setup(props) {
    const currency = useCurrencyStore()
    const product: Ref<UnwrapRef<Product>> = ref<Product>({} as Product)
    
    onBeforeMount(() => {
      product.value = props.data
    })
    
    return { currency, product }
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
  <n-card :bordered="false" class="p-8" title="Summary">
    <!--    header，title旁边的内容 -->
    <template #header-extra>
    
    </template>
    
    <div class="card-content-container flex items-center justify-between">
      <img :src="product.image" alt="product image" class="product-image max-w-20 mr-8" />
      <div class="product-info">
        <div class="product-price">{{ currency.sign }} {{ product.price }}</div>
        <div class="product-description min-w-20">{{ product.description }}</div>
      </div>
    </div>
    
    <!--    subtotal 和 shipping 内容-->
    <template #footer>
      <div class="price-container flex-col">
        <div class="sub-total flex items-center justify-between">
          <span>Subtotal</span>
          <span>{{ currency.sign }} {{ product.price }}</span>
        </div>
        <div class="shipping flex items-center justify-between mt-6">
          <span>Shipping</span>
          <span>0</span>
        </div>
      </div>
    </template>
    
    <!--    total 的内容-->
    <template #action>
      <div class="total flex items-center justify-between border-t pt-4">
        <span class="font-bold">Total</span>
        <span class="font-semibold">{{ currency.sign }} {{ product.price }}</span>
      </div>
    </template>
  </n-card>
</template>


<style scoped>

</style>