<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { onGooglePayLoaded } from '@/utils/google-pay'
import Pacypay from '@/utils/pacypay'


export default defineComponent({
  name: 'ProductPayment',
  components: {},
  
  setup() {
    
    const transactionId = '1775342394028724224'
    const options: object = {
      container: 'pacypay_checkout',
      onPaymentCompleted: (res: any) => {
        const txnInfo = res.data
        const respCode = res.respCode
        const respMsg = res.respMsg
        console.log('Payment completed', txnInfo, respCode, respMsg)
      },
      onError: async function() {
        //支付异常回调方法
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
    
    onMounted(() => {
      const script = document.createElement('script')
      script.src = 'https://pay.google.com/gp/p/js/pay.js'
      script.async = true
      document.head.appendChild(script)
      
      script.onload = () => {
        onGooglePayLoaded()
      }
      
      const pacypay = new Pacypay(transactionId, options)
    })
    
    return {}
  },
  
  methods: {}
  
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
      <n-collapse class="mt-4">
        <n-collapse-item title="Skrill" name="1">
          <div>good</div>
        </n-collapse-item>
        <n-collapse-item title="Pix" name="2">
          <div>nice</div>
        </n-collapse-item>
        <n-collapse-item title="right" name="3">
          <div>very good</div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<style scoped>

</style>