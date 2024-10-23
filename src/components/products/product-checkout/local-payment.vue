<template>
  <n-collapse accordion class="mt-4">
    <n-collapse-item
      v-for="payment in supportedPayments"
      :key="payment"
      :name="payment.toLowerCase()"
      :title="payment"
      class="px-4"
    >
      <template #header-extra>
        <!--  todo: 支付icon  -->
      </template>
      <div class="flex flex-col items-center justify-center px-6 redirect-payment-container">
        <n-spin :show="showSpin">
          <div v-if="!showQrCode" class="flex flex-col items-center icon-description">
            <icon-redirect class="bg-transparent opacity-50 max-w-24 md:w-1/12" />
            <span class="ml-2 opacity-80"
              >You will be redirected to complete your payment upon confirmation.</span
            >
          </div>
        </n-spin>
        <img v-if="showQrCode" :src="qrCode" alt="QR Code" />
        <n-button
          v-else
          class="w-full mt-4 rounded"
          size="large"
          type="default"
          @click="doPayment(payment)"
        >
          Confirm
        </n-button>
      </div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NCollapse, NCollapseItem, NSpin, NButton, useMessage } from 'naive-ui'
import IconRedirect from '@/components/icons/IconRedirect.vue'
import {
  afterpay,
  alipay_plus,
  bancontact,
  bankTransfer,
  blikSeamless,
  boleto,
  boost,
  dana,
  efecty,
  eleven,
  gCash,
  giropay,
  grabPay,
  ideal,
  kakao_pay,
  konbini,
  maybank,
  mcash,
  mercadoPago,
  multicaja,
  myBank,
  ovo,
  oxxo,
  oxxopay,
  pagoEfectivo,
  pagosnet,
  payEasy,
  payMaya,
  payNow,
  payU,
  permata,
  pix,
  poli,
  przelewy24,
  qris,
  safetypay_cash,
  safetypay_online,
  sencillito,
  sepadd,
  servipag,
  shopeePay,
  skrill,
  sofort,
  spei,
  trustly,
  webpay,
  type PaymentConfig
} from '@/utils/payment-request'

export default defineComponent({
  name: 'LocalPayment',
  components: {
    NCollapse,
    NCollapseItem,
    NSpin,
    NButton,
    IconRedirect
  },
  props: {
    supportedPayments: {
      type: Array as () => string[],
      required: true
    },
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
    },
    totalPrice: {
      type: Number,
      required: true
    },
    config: {
      type: Object as () => PaymentConfig,
      required: true
    }
  },
  emits: ['do-payment'],
  setup(props, { emit }) {
    const message = useMessage()
    const getPaymentHandler = (payment: string) => {
      const handlers: { [key: string]: any } = {
        'Alipay+': alipay_plus,
        Kakao_Pay: kakao_pay,
        Boleto: boleto,
        'Bank Transfer': bankTransfer,
        MercadoPago: mercadoPago,
        PIX: pix,
        Servipag: servipag,
        Sencillito: sencillito,
        Webpay: webpay,
        Multicaja: multicaja,
        Efecty: efecty,
        SPEI: spei,
        OXXO: oxxo,
        OXXOPAY: oxxopay,
        PagoEfectivo: pagoEfectivo,
        'safetypay-cash': safetypay_cash,
        'safetypay-online': safetypay_online,
        Pagosnet: pagosnet,
        iDEAL: ideal,
        Skrill: skrill,
        POLi: poli,
        Sofort: sofort,
        PayU: payU,
        Trustly: trustly,
        SEPADD: sepadd,
        Giropay: giropay,
        Bancontact: bancontact,
        MyBank: myBank,
        OVO: ovo,
        Maybank: maybank,
        PERMATA: permata,
        DANA: dana,
        QRIS: qris,
        ShopeePay: shopeePay,
        Konbini: konbini,
        PayEasy: payEasy,
        MCASH: mcash,
        Boost: boost,
        GCash: gCash,
        GrabPay: grabPay,
        PayMaya: payMaya,
        Eleven: eleven,
        Przelewy24: przelewy24,
        BLIK_SEAMLESS: blikSeamless,
        PayNow: payNow,
        Afterpay: afterpay
      }
      return handlers[payment] ? handlers[payment] : null
    }

    const doPayment = async (payment: string) => {
      const handler = getPaymentHandler(payment)
      if (handler) {
        const data = await handler(props.totalPrice.toString(), props.config)
        emit('do-payment', { payment, data })
      } else {
        message.error('No handler found for ' + payment)
      }
    }

    return {
      doPayment,
      message
    }
  }
})
</script>
