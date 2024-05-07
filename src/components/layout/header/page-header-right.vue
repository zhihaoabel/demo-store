<template>
  <div class="header-right-container flex items-center justify-around ">
    <n-popselect
      id="currency"
      v-model:value="currency.currency"
      :options="currency.options"
      scrollable
      size="large"
    >
      <n-button icon-placement="right" text>
        {{ currency.currency || 'Select currency' }}
      </n-button>
    </n-popselect>
    <n-float-button v-show="products" class="ml-4" position="relative">
      <n-popselect :options="[]" :show="show.showCart" class="p-8 " trigger="click" @update-show="handleSelect">
        <n-badge :offset="[6, -8]" :value="cartAmount">
          <n-icon>
            <icon-cart />
          </n-icon>
        </n-badge>
        <template #empty>
          <product-cart :product="products" />
        </template>
      </n-popselect>
    </n-float-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import IconCart from '@/components/icons/IconCart.vue'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/entities/Product'
import ProductCart from '@/components/products/product-cart/product-cart.vue'
import { useShowStore } from '@/stores/show'

export default defineComponent({
  name: 'PageHeaderRight',
  components: { ProductCart, IconCart },
  setup(props, ctx) {
    const currency = useCurrencyStore()
    const cart = useCartStore()
    const show = useShowStore()
    const cartAmount = ref(cart.getCartAmount())
    const products = ref<Product[]>([] as Product[])
    
    products.value = cart.cart.products
    
    return {
      props, ctx, currency, cart, cartAmount, products, show
    }
  },
  
  props: {},
  
  methods: {
    handleSelect() {
      this.show.toggleShowCart()
    }
  },
  
  watch: {
    'currency.currency': {
      handler() {
        this.currency.setSign()
        this.currency.setCurrency(this.currency.currency)
      }
    },
    'cart': {
      handler() {
        this.cartAmount = this.cart.getCartAmount()
      },
      deep: true
    }
  }
})
</script>

<style scoped>

</style>