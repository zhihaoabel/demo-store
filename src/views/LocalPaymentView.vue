<script lang="ts">
import ProductSummary from '@/components/products/product-checkout/product-summary.vue'
import DirectPayment from '@/components/products/product-checkout/direct-payment.vue'
import LocalPayment from '@/components/products/product-checkout/local-payment.vue'
import CommonToast from '@/components/common/common-toast.vue'
import CommonCopyButton from '@/components/common/common-copy-button.vue'
import {
  defineComponent,
  h,
  onBeforeMount,
  onUnmounted,
  onMounted,
  ref,
  watch,
  type Ref,
  type UnwrapRef
} from 'vue'
import { Product } from '@/entities/Product'
import { useCartStore } from '@/stores/cart'
import { NAlert, useMessage } from 'naive-ui'
import type { MessageRenderMessage } from 'naive-ui'
import { useCurrencyStore } from '@/stores/currency'
import api from '@/utils/api'
import { prefix, getCurrentConfig, type PaymentConfig } from '@/utils/payment-request'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LocalPaymentView',
  components: {
    ProductSummary,
    DirectPayment,
    LocalPayment,
    CommonToast,
    CommonCopyButton
  },
  setup() {
    const cart = useCartStore()
    const currency = useCurrencyStore()
    const router = useRouter()
    let products: Ref<UnwrapRef<Product[]>> = ref<Product[]>({} as Product[])
    const message = useMessage()
    const currentCountry = ref('')
    const showSpin = ref(false)
    const qrCode = ref('')
    const selectedPayment = ref('')
    const showQrCode = ref(false)
    const supportedPayments = ref(currency.getSupportedPayments())
    const totalPrice = ref(0)
    const config = ref<PaymentConfig>(getCurrentConfig())

    const toast = ref({
      show: true,
      isCollapsed: false,
      defaultTitle: '我是Toast',
      title: 'Demo Card',
      defaultMessage: 'Below are the card numbers for testing.',
      message: ['4000020951595032', '2221008123677736'],
      animate: false,
      icon: ''
    })
    const copyButton = ref({
      copySuccess: false,
      isCopied: ref(false),
      tooltipContent: 'copy',
      showTooltip: false
    })

    const renderMessage: MessageRenderMessage = props => {
      const { type } = props
      return h(
        NAlert,
        {
          closable: props.closable,
          type: type === 'loading' ? 'default' : type,
          title: '',
          style: {
            borderRadius: 'var(--n-border-radius)',
            boxShadow: 'var(--n-box-shadow)',
            maxWidth: 'calc(100vw - 32px)',
            width: '480px'
          }
        },
        {
          default: () => props.content
        }
      )
    }

    const copyContent = (cardValue: string) => {
      navigator.clipboard.writeText(cardValue).then(
        () => {
          message.success('Card number copied to clipboard', {
            render: renderMessage,
            closable: true,
            duration: 3000,
            keepAliveOnHover: true
          })
          setTimeout(() => {
            copyButton.value.isCopied = false
            toast.value.isCollapsed = true
          }, 250)
        },
        err => {
          console.error('Could not copy text: ', err)
        }
      )
    }

    const doPayment = async ({ payment, data }: { payment: string; data: any }) => {
      showSpin.value = true
      selectedPayment.value = payment
      showQrCode.value = payment === 'PayNow'

      try {
        const res: any = await api.post(`${prefix}/v1/txn/doTransaction`, { ...data })
        const { data: responseData, respCode, respMsg } = res
        showSpin.value = false

        if (respCode === '20000' && respMsg === 'Success') {
          const redirectUrl = responseData.redirectUrl
          const codeForm = responseData.codeForm
          if (codeForm && payment == 'PayNow') {
            qrCode.value = codeForm['codeDetails'][1]['codeValue']
          } else if (redirectUrl) {
            window.open(redirectUrl, '_blank')
          }
        } else {
          console.log('Payment failed', respMsg)
          message.error(respMsg, {
            closable: true,
            duration: 5000
          })
        }
      } catch (err) {
        console.error('Payment error:', err)
        message.error('An error occurred during payment processing', {
          closable: true,
          duration: 5000
        })
      } finally {
        showSpin.value = false
      }
    }

    onBeforeMount(() => {
      // 优先从localStorage中获取直接下单的商品
      const directOrderProduct = ref(localStorage.getItem('directOrderProduct'))

      if (directOrderProduct.value) {
        products.value = [JSON.parse(directOrderProduct.value)]
        cart.directOrderProduct = JSON.parse(directOrderProduct.value)
        totalPrice.value = products.value.reduce(
          (acc: number, item: any) => acc + item.price * item.quantity,
          0
        )
        return
      }

      // 直接下单和购物车二选一
      if (cart.directOrderProduct.id) {
        products.value = [cart.directOrderProduct]
      } else {
        products.value = cart.cart.products
      }
      totalPrice.value = products.value.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      )
    })

    watch(
      () => currency.currency,
      () => {
        currentCountry.value = currency.getCountry()
        supportedPayments.value = currency.getSupportedPayments()
      }
    )

    onUnmounted(() => {
      // 清除直接下单的商品
      localStorage.removeItem('directOrderProduct')
    })

    return {
      products,
      toast,
      copyButton,
      copyContent,
      supportedPayments,
      showSpin,
      qrCode,
      selectedPayment,
      showQrCode,
      totalPrice,
      config,
      doPayment,
      currentCountry,
      router
    }
  }
})
</script>

<template>
  <div
    class="grid justify-center max-w-6xl gap-8 p-2 mx-auto checkout-container sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3"
  >
    <product-summary
      :data="products"
      class="w-full mx-auto max-w-96 sm:border-r-2 border-slate-100"
    />
    <div class="col-span-2">
      <direct-payment :products="products" :total-price="totalPrice" />
      <local-payment
        :supported-payments="supportedPayments"
        :show-spin="showSpin"
        :show-qr-code="showQrCode"
        :qr-code="qrCode"
        :total-price="totalPrice"
        :config="config"
        @do-payment="doPayment"
      />
    </div>
    <common-toast :data="toast">
      <template #message>
        <p class="text-sm" v-html="toast.defaultMessage"></p>
        <div v-if="toast.message" class="card-wrapper my-2.5">
          <p
            v-for="(card, index) in toast.message"
            :key="index"
            class="flex items-center justify-between card-info"
          >
            <span class="font-semibold card-number">
              {{ card }}
            </span>
            <common-copy-button :data="copyButton" class="ml-1.5" @copied="copyContent(card)" />
          </p>
        </div>
      </template>
    </common-toast>
  </div>
</template>

<style scoped>
/* 如果需要，可以添加特定的样式 */
</style>
