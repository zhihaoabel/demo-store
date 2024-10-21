<script lang="ts">
import ProductSummary from '@/components/products/product-checkout/product-summary.vue'
import SdkCheckoutPayment from '@/components/payments/sdk-checkout-payment.vue'
import CommonToast from '@/components/common/common-toast.vue'
import CommonCopyButton from '@/components/common/common-copy-button.vue'
import {
  defineComponent,
  h,
  onBeforeMount,
  onUnmounted,
  ref,
  watch,
  type Ref,
  type UnwrapRef
} from 'vue'
import { Product } from '@/entities/Product'
import { useCartStore } from '@/stores/cart'
import { NAlert, useMessage } from 'naive-ui'
import type { MessageRenderMessage } from 'naive-ui'
import { getCurrentConfig, type PaymentConfig } from '@/utils/payment-request'
import { useCurrencyStore } from '@/stores/currency'

export default defineComponent({
  name: 'SDKSubscriptionView',
  components: {
    ProductSummary,
    SdkCheckoutPayment,
    CommonToast,
    CommonCopyButton
  },
  setup() {
    const cart = useCartStore()
    let products: Ref<UnwrapRef<Product[]>> = ref<Product[]>({} as Product[])
    const message = useMessage()
    const paymentType = ref('sdk-subscription')
    // sdk 默认使用800209测试商户
    const config = ref<PaymentConfig>({
      MERCHANT_NO: '800209',
      APP_ID: '1831944691027152896',
      APP_SECRET: '59c5b49a58c74340b28ecc68004e815a',
      prefix: 'api'
    })
    const currency = useCurrencyStore()
    const currentCountry = ref(currency.getCountry())
    const totalPrice = ref(0)

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
        // 更新配置（如果需要的话）
        // config.value = getCurrentConfig()
        // 重新计算总价
        totalPrice.value = products.value.reduce(
          (acc: number, item: any) => acc + item.price * item.quantity,
          0
        )
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
      paymentType,
      config,
      currency,
      currentCountry,
      totalPrice
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
    <sdk-checkout-payment
      :data="products"
      :payment-type="paymentType"
      :config="config"
      :current-country="currentCountry"
      class="col-span-2"
    />
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
