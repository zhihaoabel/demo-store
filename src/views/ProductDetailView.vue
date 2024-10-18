<script lang="ts">
import { defineComponent, onBeforeMount, type Ref, ref, type UnwrapRef } from 'vue'
import { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'
import { useRoute } from 'vue-router'
import ProductDetailHeader from '@/components/products/product-detail/product-detail-header.vue'
import ProductDetailDescription from '@/components/products/product-detail/product-detail-description.vue'
import ProductDetailRecommendations from '@/components/products/product-detail/product-detail-recommendations.vue'

export default defineComponent({
  name: 'ProductDetailView',
  components: { ProductDetailRecommendations, ProductDetailDescription, ProductDetailHeader },
  
  setup() {
    const currency = useCurrencyStore()
    const route = useRoute()
    let product: Ref<UnwrapRef<Product>> = ref<Product>({} as Product)
    
    onBeforeMount(() => {
      product.value = {
        id: Number(route.query.id),
        name: String(route.query.name),
        price: Number(route.query.price),
        currency: String(route.query.currency),
        image: String(route.query.image),
        description: String(route.query.description),
        quantity: Number(route.query.stock),
        link: String(route.query.link),
        paymentMethod: String(route.query.paymentMethod)
      }
    })
    
    return { currency, product }
  },
  
  props: {}
})

</script>

<template>
  <div class="flex-col justify-center max-w-6xl p-8 mx-auto product-detail-container">
    <!--    header-->
    <product-detail-header />
    <!--    描述-->
    <product-detail-description :product="product" />
    <!--    推荐-->
    <product-detail-recommendations />
  </div>
</template>

<style scoped>

</style>