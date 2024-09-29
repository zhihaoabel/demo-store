<script lang="ts">
import { defineComponent, h, nextTick, onMounted, type Ref, ref, watch } from 'vue'
import { onGooglePayLoaded } from '@/utils/google-pay'
// import Pacypay from '@/utils/pacypay'
// import '@/utils/pacypay_old'
import '@/utils/onerway'
import { useCurrencyStore } from '@/stores/currency'
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
  placeDirectOrder,
  placeSubscriptionOrder,
  placeTokenOrder,
  poli,
  prefix,
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
  webpay
} from '@/utils/payment-request'
import api from '@/utils/api'
import type { MessageRenderMessage } from 'naive-ui'
import { NAlert, useMessage } from 'naive-ui'
import CommonToast from '@/components/common/common-toast.vue'
import CommonCopyButton from '@/components/common/common-copy-button.vue'
import CardPayment from '@/components/payments/card-payment.vue'
import type { Product } from '@/entities/Product'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ProductPayment',
  components: { CardPayment, CommonCopyButton, CommonToast, IconRedirect },

  setup(props) {
    const router = useRouter()
    const currentRoute = router.currentRoute.value.name
    const afterpayAvailable = currentRoute === 'afterpay'
    const currency = useCurrencyStore()
    const key = ref(0)
    const supportedPayments = afterpayAvailable
      ? ref(['Afterpay'])
      : ref(currency.getSupportedPayments())
    const currentCountry = ref('')
    const showSpin = ref(false)
    const qrCode = ref('')
    const selectedPayment = ref('')
    const showQrCode: Ref<boolean> = ref(false)
    const message = useMessage()
    const toast = ref({
      show: true,
      isCollapsed: false,
      defaultTitle: '我是Toast',
      title: 'Demo Card',
      defaultMessage: 'Below are the card numbers for testing.',
      message: ['4000020951595032', '2221008123677736'],
      animate: false,
      icon: ''
    } as { [key: string]: any })
    const copyButton = ref({
      copySuccess: false,
      isCopied: ref(false),
      tooltipContent: 'copy',
      showTooltip: false
    } as { [key: string]: any })
    const showGooglePayBtn = ref(false)
    const products = ref<Product[]>(props.data)
    // 根据products里的price以及quantity计算总价
    const totalPrice = products.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const pacypay = ref<any>(null)
    const googlePay = ref<any>(null)
    const isToken = ref(true)
    const iframeContentLoaded = ref(false)
    const iframeLoaded = ref(false)
    const applePay = ref<any>(null)
    const checkoutContainer = ref<HTMLElement | null>(null)

    // 信用卡支付
    const options: object = {
      container: 'pacypay_checkout',
      onPaymentCompleted: async (res: any) => {
        const respCode = res.respCode
        const respMsg = res.respMsg
        const txtInfo = res.data
        if (respCode === '20000') {
          switch (
            txtInfo.status // 交易状态判断
          ) {
            case 'S': // status 为 'S' 表示成功
              // 支付最终状态以异步通知结果为准
              console.log('支付成功')
              setTimeout(() => {
                router.push({ name: 'success', query: { status: '0' } })
              }, 1000)
              break
            case 'R': // status 为 'R' 表示需要3ds验证
              // 当交易状态为 R 时，商户需要重定向到该URL完成部分交易，包括3ds验证
              window.location.href = txtInfo.redirectUrl
              break
          }
        } else {
          message.error(respMsg, {
            closable: true,
            duration: 5000
          })
          await pullUpSDK()
        }
      },
      onError: async function (err: any) {
        message.error(err.respMsg, {
          closable: true,
          duration: 5000
        })
        //支付异常回调方法
        await pullUpSDK()
      },
      // locale: 'en',
      environment: 'sandbox',
      mode: 'CARD', // CARD、GooglePay、ApplePay
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
    }

    // google 支付
    const googleOptions = {
      container: 'ga_container', // 按钮嵌入的容器
      locale: 'zh', // 支持语言
      environment: 'sandbox', // sandbox、production
      mode: 'GooglePay', // GooglePay、ApplePay
      config: {
        googlePayButtonType: 'buy', // 'book' | 'buy' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe'
        googlePayButtonColor: 'black', // 'black' | 'white'
        googlePayEnvironment: 'TEST', // TEST PRODUCTION
        buttonWidth: '100%', // 按钮宽度
        buttonHeight: '40px', // 按钮高度
        buttonRadius: '4px' // 按钮圆角边框
      },
      onPaymentCompleted: async function (res: any) {
        // 成功支付后回调方法
        const txtInfo = res.data // 返回交易结果详情
        const respCode = res.respCode // 响应码
        const respMsg = res.respMsg // 响应信息
        if (respCode === '20000') {
          switch (
            txtInfo.status // 交易状态判断
          ) {
            case 'S': // status 为 'S' 表示成功
              // 支付最终状态以异步通知结果为准
              setTimeout(() => {
                router.push({ name: 'success', query: { status: '0' } })
              }, 1000)
              break
            case 'R': // status 为 'R' 表示需要3ds验证
              // 当交易状态为 R 时，商户需要重定向到该URL完成部分交易，包括3ds验证
              window.location.href = txtInfo.redirectUrl
              break
          }
        } else {
          message.error(respMsg, {
            closable: true,
            duration: 5000
          })
          await pullUpSDK()
        }
      },
      onError: async function (err: any) {
        //支付异常回调方法
        message.error(err.respMsg, {
          closable: true,
          duration: 5000
        })
      }
    }
    // apple pay
    const appleOptions = {
      container: 'apple_container', // 按钮嵌入的容器
      locale: 'zh', // 支持语言
      environment: 'sandbox', // sandbox、production
      mode: 'ApplePay', // GooglePay、ApplePay
      config: {
        applePayButtonType: 'buy', // 'add-money' | 'book' | 'buy' | 'check-out' | 'continue' | 'contribute' | 'donate' | 'order' | 'plain' | 'reload' | 'rent' | 'subscribe' | 'support' | 'tip' | 'top-up' | 'pay'
        applePayButtonColor: 'black', // 'black' | 'white' | 'white-outline'
        buttonWidth: '100px', // 按钮宽度
        buttonHeight: '40px', // 按钮高度
        buttonRadius: '4px' // 按钮圆角边框
      },
      onPaymentCompleted: async function (res: any) {
        // 成功支付后回调方法
        const txtInfo = res.data // 返回交易结果详情
        const respCode = res.respCode // 响应码
        const respMsg = res.respMsg // 响应信息
        if (respCode === '20000') {
          // respCode 为 20000 表示交易正常
          switch (
            txtInfo.status // 交易状态判断
          ) {
            case 'S': // status 为 'S' 表示成功
              // 支付最终状态以异步通知结果为准
              setTimeout(() => {
                router.push({ name: 'success', query: { status: '0' } })
              }, 1000)
              break
            case 'F': // status 为 'F' 表示失败
              message.error(respMsg, {
                closable: true,
                duration: 5000
              })
              break
          }
        } else {
          // 交易失败
          message.error(respMsg, {
            closable: true,
            duration: 5000
          })
          await pullUpSDK()
        }
      },
      onError: async function (err: any) {
        //支付异常回调方法
        message.error(err.respMsg, {
          closable: true,
          duration: 5000
        })
      }
    }

    // 信用卡下单
    const order = async () => {
      // 判断是否是token支付
      const req: object = isToken.value
        ? await placeTokenOrder(totalPrice.toString())
        : await placeDirectOrder(totalPrice.toString())
      return api
        .post(`${prefix}/v1/sdkTxn/doTransaction`, req)
        .then((res: any) => {
          const { data, respCode, respMsg } = res
          if (respCode === '20000' && respMsg === 'Success') {
            return data['transactionId']
          } else {
            console.log('Payment failed', respMsg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    // Google/Apple 下单
    const googleAppleOrder = async () => {
      const req: object = await placeSubscriptionOrder(totalPrice.toString())
      return api
        .post(`${prefix}/v1/sdkTxn/doTransaction`, req)
        .then((res: any) => {
          const { data, respCode, respMsg } = res
          if (respCode === '20000' && respMsg === 'Success') {
            return data['transactionId']
          } else {
            console.log('Payment failed', respMsg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    const createMessage = () => {
      message.error('Failed to place an order. Please contact support for assistance.', {
        closable: true,
        duration: 5000
      })
    }

    const pullUpSDK = async () => {
      const cardTxnId = await order()
      const googleAppleTxnId = await googleAppleOrder()
      // const txnId = '1829398755775221760'
      if (!cardTxnId || !googleAppleTxnId) {
        createMessage()
        return
      }
      // Onerway 收银台
      pacypay.value = new Pacypay(cardTxnId, options)
      googlePay.value = new Pacypay(googleAppleTxnId, googleOptions)
      applePay.value = new Pacypay(googleAppleTxnId, appleOptions)
    }

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

    onMounted(async () => {
      // 渲染自己的 Google pay按钮
      const script = document.createElement('script')
      script.src = 'https://pay.google.com/gp/p/js/pay.js'
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        // onGooglePayLoaded()
      }

      // todo: 1.Onerway js-sdk收银台
      if (!afterpayAvailable) {
        await pullUpSDK()
      }
    })

    // sdk加载之后再渲染checkbox
    onMounted(() => {
      const checkIframeLoaded = () => {
        const iframe = document.querySelector('#pacypay_checkout iframe') as HTMLIFrameElement
        if (iframe) {
          if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            nextTick(() => {
              iframeContentLoaded.value = true
            })
          } else {
            iframe.onload = () => {
              nextTick(() => {
                iframeContentLoaded.value = true
              })
            }
          }
          return true
        }
        return false
      }

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            if (checkIframeLoaded()) {
              observer.disconnect()
            }
          }
        })
      })

      observer.observe(document.getElementById('pacypay_checkout'), {
        childList: true,
        subtree: true
      })

      // 以防 iframe 已经存在但还没有加载完成
      checkIframeLoaded()
    })

    function handleSubmit() {
      console.log('执行自定义支付方法')
      pacypay.value.submit()
    }

    watch(
      () => currency.currency,
      () => {
        supportedPayments.value = afterpayAvailable ? ['Afterpay'] : currency.getSupportedPayments()
        currentCountry.value = currency.getCountry()
      }
    )

    // 监控isToken，如果isToken改变，则重新拉起SDK
    watch(
      () => isToken.value,
      async () => {
        await pullUpSDK()
      }
    )

    return {
      options,
      supportedPayments,
      key,
      showSpin,
      qrCode,
      selectedPayment,
      showQrCode,
      message,
      toast,
      copyButton,
      renderMessage,
      showGooglePayBtn,
      products,
      totalPrice,
      pacypay,
      handleSubmit,
      currentRoute,
      afterpayAvailable,
      isToken,
      iframeLoaded,
      iframeContentLoaded
    }
  },

  props: {
    data: {
      type: Object as () => Product[],
      required: true
    }
  },

  methods: {
    alipayHandler() {
      return alipay_plus(this.totalPrice.toString())
    },
    kakaoHandler() {
      return kakao_pay(this.totalPrice.toString())
    },
    boletoHandler() {
      return boleto(this.totalPrice.toString())
    },
    bankTransferHandler() {
      return bankTransfer(this.totalPrice.toString())
    },
    mercadoPagoHandler() {
      return mercadoPago(this.totalPrice.toString())
    },
    pixHandler() {
      return pix(this.totalPrice.toString())
    },
    servipagHandler() {
      return servipag(this.totalPrice.toString())
    },
    sencillitoHandler() {
      return sencillito(this.totalPrice.toString())
    },
    webpayHandler() {
      return webpay(this.totalPrice.toString())
    },
    multicajaHandler() {
      return multicaja(this.totalPrice.toString())
    },
    efectyHandler() {
      return efecty(this.totalPrice.toString())
    },
    speiHandler() {
      return spei(this.totalPrice.toString())
    },
    oxxoHandler() {
      return oxxo(this.totalPrice.toString())
    },
    oxxopayHandler() {
      return oxxopay(this.totalPrice.toString())
    },
    pagoEfectivoHandler() {
      return pagoEfectivo(this.totalPrice.toString())
    },
    safetypay_cashHandler() {
      return safetypay_cash(this.totalPrice.toString())
    },
    safetypay_onlineHandler() {
      return safetypay_online(this.totalPrice.toString())
    },
    pagosnetHandler() {
      return pagosnet(this.totalPrice.toString())
    },
    idealHandler() {
      return ideal(this.totalPrice.toString())
    },
    skrillHandler() {
      return skrill(this.totalPrice.toString())
    },
    poliHandler() {
      return poli(this.totalPrice.toString())
    },
    sofortHandler() {
      return sofort(this.totalPrice.toString())
    },
    payUHandler() {
      return payU(this.totalPrice.toString())
    },
    trustlyHandler() {
      return trustly(this.totalPrice.toString())
    },
    sepaddHandler() {
      return sepadd(this.totalPrice.toString())
    },
    giropayHandler() {
      return giropay(this.totalPrice.toString())
    },
    bancontactHandler() {
      return bancontact(this.totalPrice.toString())
    },
    myBankHandler() {
      return myBank(this.totalPrice.toString())
    },
    ovoHandler() {
      return ovo(this.totalPrice.toString())
    },
    maybankHandler() {
      return maybank(this.totalPrice.toString())
    },
    permataHandler() {
      return permata(this.totalPrice.toString())
    },
    danaHandler() {
      return dana(this.totalPrice.toString())
    },
    qrisHandler() {
      return qris(this.totalPrice.toString())
    },
    shopeePayHandler() {
      return shopeePay(this.totalPrice.toString())
    },
    konbiniHandler() {
      return konbini(this.totalPrice.toString())
    },
    payEasyHandler() {
      return payEasy(this.totalPrice.toString())
    },
    mcashHandler() {
      return mcash(this.totalPrice.toString())
    },
    boostHandler() {
      return boost(this.totalPrice.toString())
    },
    gCashHandler() {
      return gCash(this.totalPrice.toString())
    },
    grabPayHandler() {
      return grabPay(this.totalPrice.toString())
    },
    payMayaHandler() {
      return payMaya(this.totalPrice.toString())
    },
    elevenHandler() {
      return eleven(this.totalPrice.toString())
    },
    przelewy24Handler() {
      return przelewy24(this.totalPrice.toString())
    },
    blikSeamlessHandler() {
      return blikSeamless(this.totalPrice.toString())
    },
    payNowHandler() {
      return payNow(this.totalPrice.toString())
    },
    afterpayHandler() {
      return afterpay(this.totalPrice.toString())
    },

    getPaymentHandler(payment: string) {
      const handlers: { [key: string]: any } = {
        'Alipay+': this.alipayHandler,
        Kakao_Pay: this.kakaoHandler,
        Boleto: this.boletoHandler,
        'Bank Transfer': this.bankTransferHandler,
        MercadoPago: this.mercadoPagoHandler,
        PIX: this.pixHandler,
        Servipag: this.servipagHandler,
        Sencillito: this.sencillitoHandler,
        Webpay: this.webpayHandler,
        Multicaja: this.multicajaHandler,
        Efecty: this.efectyHandler,
        SPEI: this.speiHandler,
        OXXO: this.oxxoHandler,
        OXXOPAY: this.oxxopayHandler,
        PagoEfectivo: this.pagoEfectivoHandler,
        'safetypay-cash': this.safetypay_cashHandler,
        'safetypay-online': this.safetypay_onlineHandler,
        Pagosnet: this.pagosnetHandler,
        iDEAL: this.idealHandler,
        Skrill: this.skrillHandler,
        POLi: this.poliHandler,
        Sofort: this.sofortHandler,
        PayU: this.payUHandler,
        Trustly: this.trustlyHandler,
        SEPADD: this.sepaddHandler,
        Giropay: this.giropayHandler,
        Bancontact: this.bancontactHandler,
        MyBank: this.myBankHandler,
        OVO: this.ovoHandler,
        Maybank: this.maybankHandler,
        PERMATA: this.permataHandler,
        DANA: this.danaHandler,
        QRIS: this.qrisHandler,
        ShopeePay: this.shopeePayHandler,
        Konbini: this.konbiniHandler,
        PayEasy: this.payEasyHandler,
        MCASH: this.mcashHandler,
        Boost: this.boostHandler,
        GCash: this.gCashHandler,
        GrabPay: this.grabPayHandler,
        PayMaya: this.payMayaHandler,
        Eleven: this.elevenHandler,
        Przelewy24: this.przelewy24Handler,
        BLIK_SEAMLESS: this.blikSeamlessHandler,
        PayNow: this.payNowHandler,
        Afterpay: this.afterpayHandler
      }
      return handlers[payment] ? handlers[payment] : console.log('No handler found')
    },

    /**
     * 本地支付
     * @param payment 本地支付方式
     */
    async doPayment(payment: string) {
      this.showSpin = true
      this.selectedPayment = payment
      this.showQrCode = (payment === 'PayNow') as boolean

      const handler = this.getPaymentHandler(payment)
      const data = await handler()

      // 发起支付请求
      api
        .post(`${prefix}/v1/txn/doTransaction`, data)
        .then((res: any) => {
          const { data, respCode, respMsg } = res
          this.showSpin = false

          if (respCode === '20000' && respMsg === 'Success') {
            // 根据redirectUrl跳转
            const redirectUrl = data.redirectUrl
            const codeForm = data.codeForm
            if (codeForm && payment == 'PayNow') {
              this.qrCode = codeForm['codeDetails'][1]['codeValue']
            } else if (redirectUrl) {
              window.open(redirectUrl, '_blank')
            }
          } else {
            console.log('Payment failed', respMsg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * 复制卡号到剪切板
     * @param cardValue 卡号
     */
    copyContent(cardValue: string) {
      navigator.clipboard.writeText(cardValue).then(
        () => {
          this.message.success('Card number copied to clipboard', {
            render: this.renderMessage,
            closable: true,
            duration: 3000,
            keepAliveOnHover: true
          })
          setTimeout(() => {
            this.copyButton.isCopied = false
            this.toast.isCollapsed = true
          }, 250)
        },
        err => {
          console.error('Could not copy text: ', err)
        }
      )
    }
  }
})
</script>

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
      title=" "
    >
      <template v-if="!afterpayAvailable" #header-extra>
        <div class="flex-col w-full mt-4 google-pay-button-container">
          <div id="google-container" class="google-apple-pay-container"></div>
        </div>
      </template>
      <!--   todo:  2.js-sdk收银台渲染-->
      <div class="flex-col items-center onerway-payments-container">
        <div id="ga_container" style="height: 40px"></div>
        <div id="apple_container" style="height: 40px"></div>
        <n-divider> Or pay with </n-divider>
        <div class="payment-form-wrapper">
          <div v-if="iframeContentLoaded" class="-translate-y-4 checkbox-wrapper">
            <n-checkbox v-model:checked="isToken"> Save card for future payments </n-checkbox>
          </div>
          <div id="pacypay_checkout"></div>
        </div>
        <n-button
          v-if="!options.config.showPayButton"
          class="w-full rounded bg-slate-950 text-gray-50"
          @click="handleSubmit"
          >Submit
        </n-button>
      </div>
      <!--            两方支付-->
      <card-payment v-if="!afterpayAvailable" :data="products" />
      <!--      本地支付-->
      <n-collapse accordion class="mt-4">
        <n-collapse-item
          v-for="payment in supportedPayments"
          :key="payment"
          :name="payment.toLowerCase()"
          :title="payment"
        >
          <template #header-extra>
            <!--              todo: 支付icon-->
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
    </n-card>
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
.payment-form-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

pacypay_checkout_container :deep(.pacypay-checkout__payment-method) {
  border: none;
}

.checkbox-wrapper {
  width: 100%;
  padding: 10px;
  border-top: none;
  background-color: #fff;
}
</style>
