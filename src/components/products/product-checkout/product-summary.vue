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
    const products: Ref<UnwrapRef<Product[]>> = ref<Product[]>({} as Product[])
    
    onBeforeMount(() => {
      products.value = props.data as Product[]
    })
    
    return { currency, products, cart }
  },
  
  props: {
    data: {
      type: Object as () => Product[]
    }
  }
})
</script>


<template>
  <n-card :bordered="false" class="ml-8" title="Summary">
    <!--    header，title旁边的内容 -->
    <template #header-extra>
    
    </template>
    
    <div v-if="products" class="card-content-container flex flex-col items-start justify-between">
      <div v-for="item in products" :key="item.id" class="product-container mt-4 w-full">
        <div class="image-desc flex items-center w-full ">
          <img :src="item.image" alt="product image" class="product-image max-w-24 mr-8 rounded-xl" />
          <div class="product-info self-start translate-y-2 flex flex-col w-full">
            <div class="product-description font-semibold">
              {{ item.description }}
            </div>
            <div class="justify-self-start flex items-start justify-between">
              <span class="currency">
                {{ currency.sign }} {{ item.price }}
              </span>
              <span class="justify-self-end self-end">
                x {{ item.quantity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!--    total 的内容-->
    <div class="sub-total flex items-center justify-between mt-4">
      <span>Subtotal</span>
      <span>{{ currency.sign }} {{ cart.getPaymentAmount() }}</span>
    </div>
    <div class="total flex items-center justify-between border-t py-2 mt-4">
      <span class="font-bold">Total</span>
      <span class="font-semibold text-lg text-red-600">{{ currency.sign }} {{ cart.getPaymentAmount() }}</span>
    </div>
  
  </n-card>
</template>


<style scoped>
</style>