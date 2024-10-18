<template>
  <card-payment :data="products" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CardPayment from '@/components/payments/card-payment.vue'
import type { Product } from '@/entities/Product'

export default defineComponent({
  name: 'DirectPayment',
  components: { CardPayment },
  props: {
    products: {
      type: Array as () => Product[],
      required: true
    }
  }
})
</script>

