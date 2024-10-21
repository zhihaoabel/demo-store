<template>
  <div class="flex-col payments-container">
    <n-card
      :bordered="false"
      :hoverable="true"
      :segmented="{}"
      class="px-2 py-2"
      header-class="flex-col"
      header-extra-class="w-full"
      size="large"
      title=""
    >
      <template #header-extra>
        <div class="flex-col w-full mt-4 google-pay-button-container">
          <div id="google-container" class="google-apple-pay-container"></div>
        </div>
      </template>
      <!-- js-sdk收银台（含GooglePay和ApplePay）-->
      <sdk-payment
        :options="options"
        :iframe-content-loaded="iframeContentLoaded"
        :pacypay="pacypay"
        v-model:is-token="isToken"
      />
      <div id="ga_container" style="height: 40px"></div>
      <div id="apple_container" class="my-3" style="height: 40px"></div>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from 'vue'
import { NCard, useMessage } from 'naive-ui'
import SdkPayment from '@/components/products/product-checkout/sdk-payment.vue'
import '@/utils/onerway'
import {
  placeDirectOrder,
  placeSubscriptionOrder,
  placeTokenOrder,
  type PaymentConfig
} from '@/utils/payment-request'
import api from '@/utils/api'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SdkCheckoutPayment',
  components: {
    NCard,
    SdkPayment
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    paymentType: {
      type: String,
      default: 'sdk-checkout',
      validator: (value: string) =>
        ['sdk-checkout', 'sdk-token', 'sdk-subscription'].includes(value)
    },
    config: {
      type: Object as () => PaymentConfig,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const isToken = computed(() => props.paymentType === 'sdk-token')
    const iframeContentLoaded = ref(false)
    const pacypay = ref<any>({})
    const googlePay = ref<any>(null)
    const applePay = ref<any>(null)
    const products = ref(props.data)
    const totalPrice = ref(
      products.value.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
    )
    const message = useMessage()

    const handlePaymentCompleted = async (res: any) => {
      const { respCode, respMsg, data: txtInfo } = res
      if (respCode === '20000') {
        switch (txtInfo.status) {
          case 'S':
            console.log('Payment successful')
            setTimeout(() => {
              router.push({ name: 'success', query: { status: '0' } })
            }, 1000)
            break
          case 'R':
            window.location.href = txtInfo.redirectUrl
            break
          case 'F':
            message.error(respMsg, {
              closable: true,
              duration: 5000
            })
            break
        }
      } else {
        message.error(respMsg, {
          closable: true,
          duration: 5000
        })
        await pullUpSDK()
      }
    }

    const handlePaymentError = async (err: any) => {
      message.error(err.respMsg, {
        closable: true,
        duration: 5000
      })
      if (err.respMsg !== 'This device does not support ApplePay.') {
        await pullUpSDK()
      }
    }

    // Credit card payment options
    const options = computed(() => ({
      container: 'pacypay_checkout',
      onPaymentCompleted: handlePaymentCompleted,
      onError: handlePaymentError,
      environment: props.config.prefix === 'prod' ? 'production' : 'sandbox',
      mode: 'CARD',
      config: {
        subProductType: isToken.value ? 'TOKEN' : 'DIRECT', // DIRECT-直接支付，TOKEN-token绑卡并支付（必须和下单接口中subProductType值保持一致）
        checkoutTheme: 'light', // light、dark
        customCssURL: '', // 自定义样式链接地址，配置该值后，checkoutTheme 则无效
        buttonSeparation: false,
        showPayButton: true,
        hideTokenList: false,
        variables: {
          colorBackground: 'white', // 主题背景色
          colorPrimary: '#727272', // 主题色，如输入框高亮、光标颜色
          colorText: 'colorText', // 字体颜色
          colorDanger: '#ff144b', // 错误提示颜色
          borderRadius: '1px', // 输入框角度
          fontSizeBase: '16px', // 基础字体大小，会按照该基
          fontFamily: 'Arial' // 字体
        },
        // 如果想自定义所有样式则只用配置styles. checkoutTheme,customCssURL,variables都可以不传
        // 详情请看styles属性说明
        styles: {
          '#pacypay_checkout_container': {
            //输入框容器样式
            display: 'flex',
            'justify-content': 'center',
            'align-items': 'center'
          },
          '.pacypay-checkout__button': {
            'font-size': '16px',
            'font-weight': '600'
          },
          '.pacypay-checkout__button--pay': {
            // 支付按钮样式
            background: '#000000'
          },
          '.pacypay-checkout__button__text': {
            // 支付按钮文本样式
            'font-size': '16px',
            'font-weight': '600'
          },
          '.pacypay-checkout__error-text': {
            // 错误信息样式
            color: '#35864c',
            'font-weight': '600',
            'margin-top': '0.5rem',
            'padding-left': '0.2rem'
          },
          '.pacypay-checkout__label-text': {
            'font-weight': '600',
            'margin-bottom': '0.5rem'
          },
          '.pacypay-checkout__payment-method__details': {
            padding: '0 1rem'
          },
          '.pacypay-checkout__payment-method__name': {
            'font-weight': '600'
          },
          '.pacypay-checkout__input': {
            'font-size': '0.75rem'
          },
          '.pacypay-checkout__modal__buttons--left': {
            color: '#fff',
            background: '#000000'
          },
          '.pacypay-checkout__modal__buttons--right': {
            color: '#fff',
            background: '#000000'
          },
          '.pacypay-checkout__button--edit': {
            color: '#000'
          },
          '.pacypay-checkout__button--save': {
            border: ' 1px solid var(--colorPrimary)',
            color: '#fff',
            background: '#000000'
          },
          '.pacypay-checkout__button--cancel': {
            'background-color': '#000000 !important'
          },
          '.pacypay-checkout__modal__close': {
            'background-color': '#000',
            color: '#fff'
          },
          '.pacypay-checkout__btn-wrap .pacypay-checkout__button.pacypay-checkout__button--cancel .pacypay-checkout__button__text':
            {
              color: '#fff'
            },
          '.pacypay-checkout__modal-wrap': {
            overflow: 'auto'
          }
        }
      }
    }))

    // Google Pay options
    const googleOptions = {
      container: 'ga_container',
      locale: 'zh',
      environment: props.config.prefix === 'prod' ? 'production' : 'sandbox',
      mode: 'GooglePay',
      config: {
        googlePayButtonType: 'buy',
        googlePayButtonColor: 'black',
        googlePayEnvironment: props.config.prefix === 'prod' ? 'PRODUCTION' : 'TEST',
        buttonWidth: '100%',
        buttonHeight: '40px',
        buttonRadius: '16px'
      },
      onPaymentCompleted: handlePaymentCompleted,
      onError: handlePaymentError
    }

    // Apple Pay options
    const appleOptions = {
      container: 'apple_container',
      locale: 'zh',
      environment: props.config.prefix === 'prod' ? 'production' : 'sandbox',
      mode: 'ApplePay',
      config: {
        applePayButtonType: 'buy',
        applePayButtonColor: 'black',
        buttonWidth: '100%',
        buttonHeight: '40px',
        buttonRadius: '8px'
      },
      onPaymentCompleted: handlePaymentCompleted,
      onError: handlePaymentError
    }

    const pullUpSDK = async () => {
      const cardTxnId = await order()
      // 等待0.5秒，避免同时下单导致merchantTxnId重复
      await new Promise(resolve => setTimeout(resolve, 500))
      const googleTxnId = await googleAppleOrder()
      await new Promise(resolve => setTimeout(resolve, 1000))
      const appleTxnId = await googleAppleOrder()
      if (!cardTxnId || !googleTxnId || !appleTxnId) {
        message.error('Failed to place an order. Please contact support for assistance.', {
          closable: true,
          duration: 5000
        })
        return
      }
      pacypay.value = new (window as any).Pacypay(cardTxnId, options.value)
      googlePay.value = new (window as any).Pacypay(googleTxnId, googleOptions)
      applePay.value = new (window as any).Pacypay(appleTxnId, appleOptions)
    }

    const getOrderFunction = (type: string) => {
      switch (type) {
        case 'sdk-card':
          return placeDirectOrder
        case 'sdk-token':
          return isToken.value ? placeTokenOrder : placeDirectOrder
        case 'sdk-subscription':
          return placeSubscriptionOrder
        default:
          return placeDirectOrder
      }
    }

    // 信用卡下单
    const order = async () => {
      const orderFunction = getOrderFunction(props.paymentType)
      const req: object = await orderFunction(totalPrice.value.toString(), props.config)
      try {
        const res = await api.post(`${props.config.prefix}/v1/sdkTxn/doTransaction`, req)
        const { data, respCode, respMsg } = res as any
        if (respCode === '20000' && respMsg === 'Success') {
          return data['transactionId']
        } else {
          message.error('Initializing SDK - Card failed: ' + respMsg, {
            closable: true,
            duration: 5000
          })
        }
      } catch (err) {
        console.error(err)
      }
    }

    // Google/Apple 下单
    const googleAppleOrder = async () => {
      const orderFunction =
        props.paymentType === 'sdk-subscription' ? placeSubscriptionOrder : placeDirectOrder
      const req: object = await orderFunction(totalPrice.value.toString(), props.config)
      try {
        const res = await api.post(`${props.config.prefix}/v1/sdkTxn/doTransaction`, req)
        const { data, respCode, respMsg } = res as any
        if (respCode === '20000' && respMsg === 'Success') {
          return data['transactionId']
        } else {
          message.error('Initializing SDK - Google/Apple failed: ' + respMsg, {
            closable: true,
            duration: 5000
          })
          // 如果respMsg是 Repeated order transactions! 重新下单
          if (respMsg === 'Repeated order transactions!') {
            await pullUpSDK()
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    onMounted(async () => {
      await pullUpSDK()
    })

    watch(
      () => props.paymentType,
      async () => {
        await pullUpSDK()
      }
    )

    return {
      options,
      isToken,
      iframeContentLoaded,
      pacypay,
      message,
      googleOptions,
      appleOptions
    }
  }
})
</script>

<style scoped>
.payments-container {
  /* 添加必要的样式 */
}
</style>
