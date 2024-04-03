<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'
import IconShoppingCart from '@/components/icons/IconShoppingCart.vue'
import router from '@/router'

export default defineComponent({
  name: 'ProductDetailDescription',
  components: { IconShoppingCart },
  
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  
  setup(props) {
    const currency = useCurrencyStore()
    
    function clickHandler() {
      // 将 product 传给路由
      router.push({
        path: '/checkout',
        query: {
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
    }
    
    return {
      currency, clickHandler
    }
  }
})
</script>

<template>
  <div class="detail-description flex items-center justify-between mb-10">
    <div class="detail-image max-w-md mr-4">
      <img :src="product.image" alt="product-image" class="shadow-2xl shadow-slate-400">
    </div>
    <div class="detail-info flex flex-col justify-between items-start self-start ">
      <h1 class="text-2xl font-bold mt-12">{{ product.name }}</h1>
      <p class="text-lg mt-6">{{ product.description }}</p>
      <div class="detail-price mt-8">
        <span class="text-2xl">{{ currency.sign }} {{ product.price }}</span>
      </div>
      <div class="detail-action mt-6 w-full">
        <n-button
          class="flex items-center bg-slate-900 text-white px-4 py-2 rounded-md w-full "
          icon-placement="right"
          @click="clickHandler">
          <span class="cart-btn">Buy Now</span>
          <template #icon>
            <icon-shopping-cart class="cart-icon" />
          </template>
        </n-button>
      </div>
      <div class="comment-container mt-10 flex items-center">
        <img alt="" class="icon" src="/comment.svg">
        <span class="actual-rating font-bold ml-6">
          4.0
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>