<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'
import IconShoppingCart from '@/components/icons/IconShoppingCart.vue'
import { useCartStore } from '@/stores/cart'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ProductDetailDescription',
  components: { IconShoppingCart },
  
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  
  setup() {
    const currency = useCurrencyStore()
    const cart = useCartStore()
    const route = useRoute()
    const router = useRouter()
    
    function handleAddProduct(product: Product) {
      cart.addProduct(product)
    }
    
    return {
      cart, currency, handleAddProduct,route, router
    }
  },
  
  methods: {
    clickHandler() {
      // 直接下单需要给这个 directOrderProduct 赋值
      this.cart.directOrderProduct = this.product
      this.cart.directOrderProduct.quantity = 1
      // 保存 directOrderProduct 到 localStorage
      localStorage.setItem('directOrderProduct', JSON.stringify(this.cart.directOrderProduct))
      // 跳转到 checkout 页面
      this.router.push({ name: 'checkout', query: { date: new Date().getTime() } })
      // 跳到 afterpay 页面
      // this.router.push({ name: 'afterpay', query: { date: new Date().getTime() } })
    }
  }
})
</script>

<template>
  <div class="detail-description flex items-center justify-around mb-10 max-sm:flex-col max-sm:px-2">
    <div class="detail-image max-w-md sm:mr-4 max-sm:self-start">
      <img :src="product.image" alt="product-image" class="rounded-lg shadow-2xl shadow-slate-400">
    </div>
    <div class="detail-info flex flex-col justify-between items-start self-start max-sm:w-full ">
      <h1 class="text-2xl font-bold sm:mt-8 max-sm:mt-6">{{ product.name }}</h1>
      <p class="text-lg mt-6">{{ product.description }}</p>
      <div class="detail-price sm:mt-8 max-sm:mt-4">
        <span class="text-xl font-semibold">{{ currency.sign }} {{ product.price }}</span>
      </div>
      <div class="detail-action flex flex-col items-center sm:my-6 max-sm:my-3 w-full">
        <n-button
          class="flex items-center bg-red-600 text-white px-4 py-2 w-full"
          icon-placement="right"
          round
          @click="handleAddProduct(product)">
          <span class="cart-btn">Add To Cart</span>
          <template #icon>
            <icon-shopping-cart class="cart-icon" />
          </template>
        </n-button>
        <n-button
          class="flex items-center bg-slate-900 text-white px-4 py-2 w-full mt-4"
          round
          @click="clickHandler">
          <span class="cart-btn">Buy Now</span>
        </n-button>
      </div>
      <div class="comment-container mt-5 flex items-center max-md:w-full">
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