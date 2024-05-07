<script lang="ts">
import { defineComponent, type Ref, ref, type UnwrapRef } from 'vue'
import type { Product } from '@/entities/Product'
import ProductCartHeader from '@/components/products/product-cart/product-cart-header.vue'
import ProductCartBody from '@/components/products/product-cart/product-cart-body.vue'
import ProductCartAction from '@/components/products/product-cart/product-cart-action.vue'
import { useShowStore } from '@/stores/show'

export default defineComponent(
  {
    name: 'ProductCart',
    components: { ProductCartAction, ProductCartBody, ProductCartHeader },
    
    setup(props, ctx) {
      const show = useShowStore()
      const products: Ref<UnwrapRef<Product[]>> = ref<Product[]>([] as Product[])
      
      products.value = props.product
      
      return {
        props, ctx, products, show
      }
    },
    props: {
      product: {
        type: Object as () => Product[],
        required: true
      },
    }
  }
)
</script>

<template>
  <div class="cart-container">
    <product-cart-header />
    <product-cart-body :product="products" class=""/>
    <product-cart-action />
  </div>
</template>

<style scoped>

</style>