<script lang="ts">
import { defineComponent, h, onMounted, type Ref, ref, watch } from 'vue'
import { onGooglePayLoaded } from '@/utils/google-pay'
import Pacypay from '@/utils/pacypay'
import { useCurrencyStore } from '@/stores/currency'
import IconRedirect from '@/components/icons/IconRedirect.vue'
import {
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
  placeOrder,
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
  webpay
} from '@/utils/payment-request'
import request from '@/utils/request'
import type { MessageRenderMessage } from 'naive-ui'
import { NAlert, useMessage } from 'naive-ui'
import router from '@/router'
import CommonToast from '@/components/common/common-toast.vue'
import CommonCopyButton from '@/components/common/common-copy-button.vue'


export default defineComponent({
  name: 'ProductPayment',
  components: { CommonCopyButton, CommonToast, IconRedirect },
  
  setup() {
    const currency = useCurrencyStore()
    const key = ref(0)
    const supportedPayments = ref(currency.getSupportedPayments())
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
      message: [
        '4000020951595032',
        '2221008123677736'
      ],
      animate: false,
      icon: ''
    } as { [key: string]: any })
    const copyButton = ref({
      copySuccess: false,
      isCopied: ref(false),
      tooltipContent: 'copy',
      showTooltip: false
    } as { [key: string]: any })
    
    const options: object = {
      container: 'pacypay_checkout',
      onPaymentCompleted: async (res: any) => {
        const respCode = res.respCode
        const respMsg = res.respMsg
        if (respCode === '20000') {
          setTimeout(() => {
            router.push('/success')
          }, 1000)
        } else {
          message.error(respMsg, {
            closable: true,
            duration: 5000
          })
          await pullUpSDK()
        }
      },
      onError: async function() {
        //支付异常回调方法
        await pullUpSDK()
      },
      onFinished: async function() {
        // 支付完成（不管成功或失败）回调方法
      },
      locale: 'en',
      environment: 'sandbox',
      config: {
        subProductType: 'DIRECT', // DIRECT-直接支付，TOKEN-token绑卡并支付（必须和下单接口中subProductType值保持一致）
        checkoutTheme: 'light', // light、dark
        customCssURL: '', // 自定义样式链接地址，配置该值后，checkoutTheme 则无效
        buttonSeparation: false,
        variables: {
          'colorBackground': 'white', // 主题背景色
          'colorPrimary': '#727272', // 主题色，如输入框高亮、光标颜色
          'colorText': 'colorText', // 字体颜色
          'colorDanger': '#ff144b', // 错误提示颜色
          'borderRadius': '5px', // 输入框角度
          'fontSizeBase': '16px', // 基础字体大小，会按照该基
          'fontFamily': 'Arial' // 字体
        },
        // 如果想自定义所有样式则只用配置styles. checkoutTheme,customCssURL,variables都可以不传
        // 详情请看styles属性说明
        styles: {
          '#pacypay_checkout_container': { //输入框容器样式
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
          },
          '.pacypay-checkout__button': {
            'font-size': '16px',
            'font-weight': '600'
          },
          '.pacypay-checkout__button--pay': { // 支付按钮样式
            'background': '#000000'
          },
          '.pacypay-checkout__button__text': { // 支付按钮文本样式
            'font-size': '16px',
            'font-weight': '600'
          },
          '.pacypay-checkout__error-text': { // 错误信息样式
            'color': '#35864c',
            'font-weight': '600',
            'margin-top': '0.5rem',
            'padding-left': '0.2rem'
          },
          '.pacypay-checkout__label-text': {
            'font-weight': '600',
            'margin-bottom': '0.5rem'
          },
          '.pacypay-checkout__payment-method__details': {
            'padding': '0 1rem'
          },
          '.pacypay-checkout__payment-method__name': {
            'font-weight': '600'
          },
          '.pacypay-checkout__input': {
            'font-size': '0.75rem'
          },
          '.pacypay-checkout__modal__buttons--left': {
            'color': '#fff',
            'background': '#000000'
          },
          '.pacypay-checkout__modal__buttons--right': {
            'color': '#fff',
            'background': '#000000'
          },
          '.pacypay-checkout__button--edit': {
            'color': '#000'
          },
          '.pacypay-checkout__button--save': {
            'border': ' 1px solid var(--colorPrimary)',
            'color': '#fff',
            'background': '#000000'
          },
          '.pacypay-checkout__button--cancel': {
            'background-color': '#000000 !important'
          },
          '.pacypay-checkout__modal__close': {
            'background-color': '#000',
            'color': '#fff'
          },
          '.pacypay-checkout__btn-wrap .pacypay-checkout__button.pacypay-checkout__button--cancel .pacypay-checkout__button__text': {
            'color': '#fff'
          }
        }
      }
    }
    
    const order = async () => {
      const req: object = await placeOrder('20')
      return request.post('/api/v1/sdkTxn/doTransaction', req).then((res: any) => {
        const { data, respCode, respMsg } = res
        if (respCode === '20000' && respMsg === 'Success') {
          return data['transactionId']
        } else {
          console.log('Payment failed', respMsg)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    
    const createMessage = () => {
      message.error('Failed to place an order. Please contact support for assistance.',
        {
          closable: true,
          duration: 5000
        })
    }
    
    const pullUpSDK = async () => {
      const txnId = await order()
      if (!txnId) {
        createMessage()
        return
      }
      // Onerway 收银台
      new Pacypay(txnId, options)
    }
    
    const renderMessage: MessageRenderMessage = (props) => {
      const { type } = props
      return h(NAlert, {
        closable: props.closable,
        type: type === 'loading' ? 'default' : type,
        title: '',
        style: {
          borderRadius: 'var(--n-border-radius)',
          boxShadow: 'var(--n-box-shadow)',
          maxWidth: 'calc(100vw - 32px)',
          width: '480px'
        }
      }, {
        default: () => props.content
      })
    }
    
    onMounted(async () => {
      // 渲染 Google pay按钮
      const script = document.createElement('script')
      script.src = 'https://pay.google.com/gp/p/js/pay.js'
      script.async = true
      document.head.appendChild(script)
      
      script.onload = () => {
        onGooglePayLoaded()
      }
      
      await pullUpSDK()
    })
    
    watch(() => currency.currency, () => {
      supportedPayments.value = currency.getSupportedPayments()
      currentCountry.value = currency.getCountry()
    })
    
    return {
      supportedPayments,
      key,
      showSpin,
      qrCode,
      selectedPayment,
      showQrCode,
      message,
      toast,
      copyButton,
      renderMessage
    }
  },
  
  methods: {
    alipayHandler() {
      return alipay_plus('20')
    },
    kakaoHandler() {
      return kakao_pay('20')
    },
    boletoHandler() {
      return boleto('20')
    },
    bankTransferHandler() {
      return bankTransfer('20')
    },
    mercadoPagoHandler() {
      return mercadoPago('20')
    },
    pixHandler() {
      return pix('20')
    },
    servipagHandler() {
      return servipag('20')
    },
    sencillitoHandler() {
      return sencillito('20')
    },
    webpayHandler() {
      return webpay('50')
    },
    multicajaHandler() {
      return multicaja('350')
    },
    efectyHandler() {
      return efecty('10000')
    },
    speiHandler() {
      return spei('20')
    },
    oxxoHandler() {
      return oxxo('20')
    },
    oxxopayHandler() {
      return oxxopay('20')
    },
    pagoEfectivoHandler() {
      return pagoEfectivo('20')
    },
    safetypay_cashHandler() {
      return safetypay_cash('20')
    },
    safetypay_onlineHandler() {
      return safetypay_online('20')
    },
    pagosnetHandler() {
      return pagosnet('20')
    },
    idealHandler() {
      return ideal('20')
    },
    skrillHandler() {
      return skrill('20')
    },
    poliHandler() {
      return poli('20')
    },
    sofortHandler() {
      return sofort('20')
    },
    payUHandler() {
      return payU('20')
    },
    trustlyHandler() {
      return trustly('20')
    },
    sepaddHandler() {
      return sepadd('20')
    },
    giropayHandler() {
      return giropay('20')
    },
    bancontactHandler() {
      return bancontact('20')
    },
    myBankHandler() {
      return myBank('20')
    },
    ovoHandler() {
      return ovo('1000')
    },
    maybankHandler() {
      return maybank('1000')
    },
    permataHandler() {
      return permata('1000')
    },
    danaHandler() {
      return dana('1000')
    },
    qrisHandler() {
      return qris('1000')
    },
    shopeePayHandler() {
      return shopeePay('1000')
    },
    konbiniHandler() {
      return konbini('20')
    },
    payEasyHandler() {
      return payEasy('20')
    },
    mcashHandler() {
      return mcash('20')
    },
    boostHandler() {
      return boost('20')
    },
    gCashHandler() {
      return gCash('20')
    },
    grabPayHandler() {
      return grabPay('20')
    },
    payMayaHandler() {
      return payMaya('20')
    },
    elevenHandler() {
      return eleven('20')
    },
    przelewy24Handler() {
      return przelewy24('20')
    },
    blikSeamlessHandler() {
      return blikSeamless('20')
    },
    payNowHandler() {
      return payNow('20')
    },
    
    getPaymentHandler(payment: string) {
      const handlers: { [key: string]: any } = {
        'Alipay+': this.alipayHandler,
        'Kakao_Pay': this.kakaoHandler,
        'Boleto': this.boletoHandler,
        'Bank Transfer': this.bankTransferHandler,
        'MercadoPago': this.mercadoPagoHandler,
        'PIX': this.pixHandler,
        'Servipag': this.servipagHandler,
        'Sencillito': this.sencillitoHandler,
        'Webpay': this.webpayHandler,
        'Multicaja': this.multicajaHandler,
        'Efecty': this.efectyHandler,
        'SPEI': this.speiHandler,
        'OXXO': this.oxxoHandler,
        'OXXOPAY': this.oxxopayHandler,
        'PagoEfectivo': this.pagoEfectivoHandler,
        'safetypay-cash': this.safetypay_cashHandler,
        'safetypay-online': this.safetypay_onlineHandler,
        'Pagosnet': this.pagosnetHandler,
        'iDEAL': this.idealHandler,
        'Skrill': this.skrillHandler,
        'POLi': this.poliHandler,
        'Sofort': this.sofortHandler,
        'PayU': this.payUHandler,
        'Trustly': this.trustlyHandler,
        'SEPADD': this.sepaddHandler,
        'Giropay': this.giropayHandler,
        'Bancontact': this.bancontactHandler,
        'MyBank': this.myBankHandler,
        'OVO': this.ovoHandler,
        'Maybank': this.maybankHandler,
        'PERMATA': this.permataHandler,
        'DANA': this.danaHandler,
        'QRIS': this.qrisHandler,
        'ShopeePay': this.shopeePayHandler,
        'Konbini': this.konbiniHandler,
        'PayEasy': this.payEasyHandler,
        'MCASH': this.mcashHandler,
        'Boost': this.boostHandler,
        'GCash': this.gCashHandler,
        'GrabPay': this.grabPayHandler,
        'PayMaya': this.payMayaHandler,
        'Eleven': this.elevenHandler,
        'Przelewy24': this.przelewy24Handler,
        'BLIK_SEAMLESS': this.blikSeamlessHandler,
        'PayNow': this.payNowHandler
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
      console.log(this.showQrCode, 'showQrCode')
      
      const handler = this.getPaymentHandler(payment)
      const data = await handler()
      
      // 发起支付请求
      request.post('/api/v1/txn/doTransaction', data).then((res: any) => {
        const { data, respCode, respMsg } = res
        this.showSpin = false
        console.log(this.showQrCode, 'showQrCode')
        
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
      }).catch((err) => {
        console.log(err)
      })
    },
    
    /**
     * 复制卡号到剪切板
     * @param cardValue 卡号
     */
    copyContent(cardValue: string) {
      console.log(cardValue, 'card')
      navigator.clipboard.writeText(cardValue)
        .then(() => {
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
        }, err => {
          console.error('Could not copy text: ', err)
        })
      
    }
  }
  
})
</script>

<template>
  <div class="payments-container flex-col">
    <n-card :bordered="false"
            :hoverable="true"
            :segmented="{}"
            class="px-8 py-2"
            header-class="flex-col"
            header-extra-class="w-full"
            size="large"
            title=" "
    >
      <template #header-extra>
        <div class="google-pay-button-container flex-col w-full mt-4">
          <div id="google-container" class="google-apple-pay-container ">
          </div>
          <n-divider>
            Or pay with
          </n-divider>
        </div>
      </template>
      <div class="onerway-payments-container flex-col items-center">
        <div id='pacypay_checkout'></div>
      </div>
      <n-collapse accordion class="mt-4">
        <n-collapse-item v-for="payment in supportedPayments" :key="payment" :name="payment.toLowerCase()"
                         :title="payment">
          <div class="redirect-payment-container px-6 flex flex-col justify-center items-center">
            <n-spin :show="showSpin">
              <div v-if="!(showQrCode)" class="icon-description flex flex-col items-center">
                <icon-redirect class="max-w-24 md:w-1/12 bg-transparent opacity-50" />
                <span class="opacity-80 ml-2">You will be redirected to complete your payment upon confirmation.</span>
              </div>
            </n-spin>
            <img v-if="showQrCode" :src="qrCode" alt="QR Code" />
            <n-button v-else class="w-full mt-4 rounded" size="large" type="default" @click="doPayment(payment)">
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
          <p v-for="(card,index) in toast.message" :key="index"
             class="card-info flex items-center justify-between">
            <span class="card-number font-semibold">
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

</style>