<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue'
import { Product } from '@/entities/Product'
import { useCurrencyStore } from '@/stores/currency'
import IconShoppingCart from '@/components/icons/IconShoppingCart.vue'
import IconPriceTag from '@/components/icons/IconPriceTag.vue'
import { useCartStore } from '@/stores/cart'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NInput, NModal } from 'naive-ui'

export default defineComponent({
  name: 'ProductDetailDescription',
  components: { IconShoppingCart, NButton, NInput, NModal },

  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props) {
    const currency = useCurrencyStore()
    const cart = useCartStore()
    const route = useRoute()
    const router = useRouter()

    function handleAddProduct(product: Product) {
      cart.addProduct(product)
    }

    const showPriceModal = ref(false)
    const newPrice = ref('')

    function openPriceModal() {
      showPriceModal.value = true
      newPrice.value = props.product.price.toString()
    }

    function updatePrice() {
      if (newPrice.value && !isNaN(Number(newPrice.value))) {
        props.product.price = Number(newPrice.value)
        showPriceModal.value = false
      }
    }

    return {
      cart,
      currency,
      handleAddProduct,
      route,
      router,
      showPriceModal,
      newPrice,
      openPriceModal,
      updatePrice
    }
  },

  methods: {
    // 点击支付
    handlePayment() {
      // 直接下单需要给这个 directOrderProduct 赋值
      this.cart.directOrderProduct = this.product
      this.cart.directOrderProduct.quantity = 1
      // 保存 directOrderProduct 到 localStorage
      localStorage.setItem('directOrderProduct', JSON.stringify(this.cart.directOrderProduct))

      // 根据产品的 paymentMethod 决定跳转到哪个页面
      switch (this.product.paymentMethod) {
        case 'checkout':
          this.router.push({ name: 'standard-checkout'})
          break
        case 'sdk-checkout':
          this.router.push({ name: 'sdk-checkout'})
          break
        case 'sdk-token':
          this.router.push({ name: 'sdk-token'})
          break
        case 'sdk-subscription':
          this.router.push({ name: 'sdk-subscription'})
          break
        case 'afterpay':
          this.router.push({ name: 'afterpay'})
          break
        case 'local-payment':
          this.router.push({ name: 'local-payment'})
          break
        case 'other':
          // 可以添加其他支付方式的路由
          console.log('Other payment method')
          break
        default:
          console.error('Unknown payment method:', this.product.paymentMethod)
          // 可以在这里设置一个默认的跳转页面
          this.router.push({ name: 'standard-checkout'})
      }
    }
  }
})
</script>

<template>
  <div
    class="flex items-center justify-around mb-10 detail-description max-sm:flex-col max-sm:px-2"
  >
    <div class="max-w-md detail-image sm:mr-4 max-sm:self-start">
      <img
        :src="product.image"
        alt="product-image"
        class="rounded-lg shadow-2xl shadow-slate-400"
      />
    </div>
    <div class="flex flex-col items-start self-start justify-between detail-info max-sm:w-full">
      <h1 class="text-2xl font-bold sm:mt-8 max-sm:mt-6">{{ product.name }}</h1>
      <p class="mt-6 text-lg">{{ product.description }}</p>
      <div class="flex items-center detail-price sm:mt-8 max-sm:mt-4">
        <span class="text-xl font-semibold">{{ currency.sign }} {{ product.price }}</span>
        <n-button quaternary class="px-2 ml-2" size="small" @click="openPriceModal">
          <template #icon>
            <n-icon>
              <icon-price-tag />
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="flex flex-col items-center w-full detail-action sm:my-6 max-sm:my-3">
        <n-button
          class="flex items-center w-full px-4 py-2 text-white bg-red-600"
          icon-placement="right"
          round
          @click="handleAddProduct(product)"
        >
          <span class="cart-btn">Add To Cart</span>
          <template #icon>
            <icon-shopping-cart class="cart-icon" />
          </template>
        </n-button>
        <n-button
          class="flex items-center w-full px-4 py-2 mt-4 text-white bg-slate-900"
          round
          @click="handlePayment"
        >
          <span class="cart-btn">Buy Now</span>
        </n-button>
      </div>
      <div class="flex items-center mt-5 comment-container max-md:w-full">
        <img alt="" class="icon" src="/comment.svg" />
        <span class="ml-6 font-bold actual-rating"> 4.0 </span>
      </div>
    </div>
  </div>

  <n-modal v-model:show="showPriceModal" preset="dialog" title="Edit Price">
    <template #default>
      <n-input v-model:value="newPrice" placeholder="Enter new price" />
    </template>
    <template #action>
      <n-button id="update-price-btn" type="primary" @click="updatePrice"> Confirm </n-button>
    </template>
  </n-modal>
</template>

<style scoped>
#update-price-btn {
  background-color: var(--n-color);
}

#update-price-btn:hover {
  background-color: var(--n-color-hover);
}
</style>
