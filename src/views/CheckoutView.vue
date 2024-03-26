<script lang="ts" setup>

import ProductSummary from '@/components/products/product-checkout/product-summary.vue'
import ProductPayment from '@/components/products/product-checkout/product-payment.vue'
</script>

<template>
  <div
    class="checkout-container grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-center p-8 max-w-6xl mx-auto">
    <product-summary class="mr-20 max-w-96" />
    <product-payment class="col-span-2"/>
  </div>
</template>

<style scoped>

</style>