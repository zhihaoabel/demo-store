<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'CardPayment',
  setup() {
    const cards = [
      {
        src: require('@/assets/images/visa.png'),
        altText: 'Visa'
      },
      {
        src: require('@/assets/images/mastercard.png'),
        altText: 'Mastercard'
      },
      {
        src: require('@/assets/images/amex.png'),
        altText: 'American Express'
      },
      {
        src: require('@/assets/images/discover.png'),
        altText: 'Discover'
      }
    ]
    return {
      // data
    }
  }

})
</script>

<template>
  <div class="px-4 rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-7xl">
    <n-tabs type="line" animated>
      <n-tab-pane name="standard" tab="Standard">
        <div class="bg-white p-8 border border-gray-300 rounded-2xl">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
              <credit-card/>
              <h2 class="text-xl font-semibold text-gray-700 ml-1.5">
                {{ $t(`directPay.staticText.labels.bankCardPayment`) }}</h2>
            
            </div>
            <!-- Icons could be svg or font-awesome icons -->
            <div v-if="cards" class="flex items-center justify-content-end w-2/5">
              <!--          添加 card-->
              <local-image-viewer v-for="(card,index) in cards"
                                  :key="index"
                                  :alt-text="card.altText"
                                  :image-src="card.src"
                                  width="w-1/12"/>
            </div>
          </div>
          
          <!-- Form fields -->
          
        </div>
      </n-tab-pane>
      <n-tab-pane name="installment" tab="Installment">
        Hey Jude
      </n-tab-pane>
      <n-tab-pane name="binding card" tab="Binding Card">
        Qilixiang
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>