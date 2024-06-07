<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import '../utils/pacypay-ga.js'
import { placeOrder, placeOrder2 } from '@/utils/payment-request.js'
import api from '@/utils/api.js'

export default defineComponent({
  name: 'GoogleApplePay',
  components: {},
  
  setup() {
    // google apple pay options
    const options = {
      container: 'pacypay_checkout_btns', // 按钮嵌入的容器
      locale: 'zh', // 支持语言
      environment: 'sandbox', // sandbox、production
      mode: ['GooglePay', 'ApplePay'], // GooglePay、ApplePay
      config: {
        googlePayButtonType: 'buy', // 'book' | 'buy' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe'
        googlePayButtonColor: 'black', // 'black' | 'white'
        applePayButtonType: 'buy', // 'add-money' | 'book' | 'buy' | 'check-out' | 'continue' | 'contribute' | 'donate' | 'order' | 'plain' | 'reload' | 'rent' | 'subscribe' | 'support' | 'tip' | 'top-up' | 'pay'
        applePayButtonColor: 'black',  // 'black' | 'white' | 'white-outline'
        googlePayEnvironment: 'TEST', // TEST PRODUCTION
        buttonWidth: '200px', // 按钮宽度
        buttonHeight: '40px', // 按钮高度
        buttonRadius: '4px' // 按钮圆角边框
      },
      onPaymentCompleted: function(res:any) { // 成功支付后回调方法
        const txtInfo = res.data // 返回交易结果详情
        const respCode = res.respCode // 响应码
        const respMsg = res.respMsg // 响应信息
        if (respCode === '20000') { // respCode 为 20000 表示交易正常
          switch (txtInfo.status) { // 交易状态判断
            case 'S': // status 为 'S' 表示成功
              // 支付最终状态以异步通知结果为准
              break
            case 'F': // status 为 'F' 表示失败
              break
          }
        } else {
          // 交易失败
          console.log(respMsg, '交易失败')
        }
      },
      onError: function(err: any) {
        //支付异常回调方法
        console.log('res', err)
      }
    }
    
    const order = async () => {
      const req: object = await placeOrder2('10')
      return api.post('api/v1/sdkTxn/doTransaction', req).then((res: any) => {
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
    
    const pullUpSDK = async () => {
      const txnId = await order()
      // Onerway Google Apple Pay
      new Pacypay(txnId, options)
    }
    
    onMounted(() => {
      pullUpSDK()
    })
    
    return {}
  }
})
</script>

<template>
  <div class="onerway-google-apple-pay-container flex items-center justify-between">
    <div id='pacypay_checkout_btns'></div>
  </div>
</template>

<style scoped>

</style>