<template>
  <n-collapse accordion class="mt-4" :default-expanded-names="['standard-checkout']">
    <n-collapse-item title="Credit Card" class="px-4" name="standard-checkout">
      <template #header class="">
        <span class="text-md font-semibold font-lato text-[#1e2b38]">Credit / Debit Card</span>
        <n-icon class="ml-3 text-2xl text-lime-800">
          <icon-credit-card />
        </n-icon>
      </template>
      <template #header-extra>
        <div>
          <n-icon class="text-4xl">
            <icon-visa />
          </n-icon>
          <n-icon class="ml-2 text-4xl">
            <icon-mastercard />
          </n-icon>
          <n-icon class="ml-2 text-4xl">
            <icon-discover />
          </n-icon>
          <n-icon class="ml-2 text-4xl">
            <icon-american-express />
          </n-icon>
        </div>
      </template>
      <div class="flex flex-col items-center justify-center px-6 redirect-payment-container">
        <n-spin :show="showSpin">
          <div v-if="!showQrCode" class="flex flex-col items-center icon-description">
            <icon-redirect class="bg-transparent opacity-50 max-w-24 md:w-1/6" />
            <span class="ml-2 opacity-80">
              You will be redirected to complete your payment upon confirmation.
            </span>
          </div>
        </n-spin>
        <img v-if="showQrCode" :src="qrCode" alt="QR Code" />
        <n-button
          v-else
          class="w-full mt-4 rounded-lg"
          size="large"
          type="default"
          @click="doPayment"
        >
          Confirm
        </n-button>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCollapse, NCollapseItem, NSpin, NButton, useMessage } from 'naive-ui'
import IconRedirect from '@/components/icons/IconRedirect.vue'
import { type PaymentConfig } from '@/utils/payment-request'

export default defineComponent({
  name: 'StandardCheckoutPayment',
  components: {
    NCollapse,
    NCollapseItem,
    NSpin,
    NButton,
    IconRedirect
  },
  props: {
    showSpin: {
      type: Boolean,
      required: true
    },
    showQrCode: {
      type: Boolean,
      required: true
    },
    qrCode: {
      type: String,
      required: true
    }
  },
  emits: ['do-payment'],
  setup(props, { emit }) {
    const message = useMessage()

    const doPayment = async () => {
      emit('do-payment')
    }

    return {
      doPayment,
      message
    }
  }
})
</script>
