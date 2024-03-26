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
    <n-float-button position="relative" class="ml-4">
      <n-badge :value="cartAmount" :offset="[6, -8]">
        <n-icon>
          <icon-cart />
        </n-icon>
      </n-badge>
    </n-float-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IconCart from '@/components/icons/IconCart.vue'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'

export default defineComponent({
  name: 'PageHeaderRight',
  components: { IconCart },
  setup() {
    const currency = useCurrencyStore()
    const cart = useCartStore()
    let cartAmount = cart.getCartAmount()
    console.log('cartAmount', cartAmount)
    
    return {
      currency, cart, cartAmount
    }
  },
  watch: {
    'currency.currency': {
      handler() {
        this.currency.setSign()
      },
    },
    'cart': {
      handler() {
        this.cartAmount = this.cart.getCartAmount()
      },
      deep: true,
    },
  }
})
</script>

<style scoped>

</style>