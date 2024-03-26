<script lang="ts">
import { defineComponent, onBeforeMount, type Ref, ref, type UnwrapRef, watch } from 'vue'
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
        link: String(route.query.link)
      }
    })
    
    watch(() => route.query, (query) => {
      product.value = {
        id: Number(query.id),
        name: String(query.name),
        price: Number(query.price),
        currency: String(query.currency),
        image: String(query.image),
        description: String(query.description),
        quantity: Number(query.stock),
        link: String(query.link)
      }
    })
    
    return { currency, product }
  },
  
  props: {}
})

</script>

<template>
  <div class="product-detail-container p-8 max-w-6xl mx-auto flex-col justify-center">
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