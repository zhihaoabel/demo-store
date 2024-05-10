<script lang="ts">
import { defineComponent, ref } from 'vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'

export default defineComponent({
  name: 'CartView',
  components: { IconArrowDown },
  setup(props, ctx) {
    const value = ref(1)
    const options = ref([
      { label: '1', value: 1111 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
      { label: '10', value: 10 }
    ])
    return { props, ctx, options, value }
  }
})

</script>

<template>
  <div class="sm:px-32 sm:py-16 max-sm:px-6 max-sm:py-4">
    <h1 class="text-3xl font-bold mb-8">Your Cart</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="col-span-2 space-y-6">
        <div class="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b pb-4">
          <img
            alt="Product Image"
            class="rounded-md object-cover"
            height="80"
            src="https://cdn.britannica.com/14/162014-050-45C1FD13/warm-bloodedness-opah-results-heat-exchange-system-gills.jpg"
            style="aspect-ratio: 80 / 80; object-fit: cover;"
            width="80"
          />
          <div>
            <h3 class="font-medium">Acme Circles T-Shirt</h3>
            <p class="text-gray-500"></p>
          </div>
          <div class="flex items-center gap-2">
            <p class="font-medium">$99</p>
            <button
              aria-autocomplete="none"
              aria-controls="radix-:r44:"
              aria-expanded="false"
              class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2  disabled:cursor-not-allowed disabled:opacity-50"
              data-state="closed"
              dir="ltr"
              role="combobox"
              type="button"
            >
              <span style="pointer-events: none;"></span>
              <svg
                aria-hidden="true"
                class="h-4 w-4 opacity-50"
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <select
              aria-hidden="true"
              style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;"
              tabindex="-1"
            ></select>
          </div>
        </div>
        <div class="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b pb-4">
          <!--  todo: src 使用产品图-->
          <img
            alt="Product Image"
            class="rounded-md object-cover"
            height="80"
            src="https://cdn.britannica.com/14/162014-050-45C1FD13/warm-bloodedness-opah-results-heat-exchange-system-gills.jpg"
            style="aspect-ratio: 80 / 80; object-fit: cover;"
            width="80"
          />
          <!--  todo: 使用商品标题-->
          <div>
            <h3 class="font-medium">${商品标题}</h3>
            <p class="text-gray-500"></p>
          </div>
          <div class="flex items-center gap-2">
            <p class="font-medium text-nowrap">${商品价格}</p>
            <n-select v-model:value="value" :options="options" style="width: 60px" :consistent-menu-width="false">
              <n-icon>
                <icon-arrow-down />
              </n-icon>
            </n-select>
          </div>
        </div>
      </div>
      
      <!--      order summary-->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 class="text-xl font-bold">Order Summary</h2>
        <div class="flex justify-between">
          <p>Subtotal</p>
          <p>$297</p>
        </div>
        <div class="flex justify-between">
          <p>Shipping</p>
          <p>$0</p>
        </div>
        <div class="shrink-0 bg-gray-100 h-[1px] w-full" data-orientation="horizontal" role="none"></div>
        <div class="flex justify-between font-medium">
          <p>Total</p>
          <p>$297</p>
        </div>
        <div class="flex flex-col gap-2">
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Continue Shopping
          </button>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>