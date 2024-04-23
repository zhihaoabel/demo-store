<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import CommonImage from '@/components/common/common-image.vue'
import type { Image } from '@/entities/Image'
import { getClientIp, uniqueId } from '@/utils/util'
import IconCreditCard from '@/components/icons/IconCreditCard.vue'
import visa from '@/assets/cards/visa.svg'
import mastercard from '@/assets/cards/mastercard.svg'
import amex from '@/assets/cards/american-express.svg'
import discover from '@/assets/cards/discover.svg'
import diner from '@/assets/cards/diners.png'
import { bindToken, directCard, queryToken } from '@/utils/payment-request'
import api from '@/utils/api'
import { useDialog, useMessage } from 'naive-ui'
import router from '@/router'
import type { TokenInfo } from '@/entities/TokenInfo'


export default defineComponent({
  name: 'CardPayment',
  components: { IconCreditCard, CommonImage },
  setup() {
    // 信用卡icons
    const cards = [
      {
        id: uniqueId(),
        src: visa,
        alt: 'Visa',
        height: '25',
        width: '25'
      },
      {
        id: uniqueId(),
        src: mastercard,
        alt: 'Mastercard',
        height: '25',
        width: '25'
      },
      {
        id: uniqueId(),
        src: amex,
        alt: 'American Express',
        height: '25',
        width: '25'
      },
      {
        id: uniqueId(),
        src: discover,
        alt: 'Discover',
        height: '25',
        width: '25'
      },
      {
        id: uniqueId(),
        src: diner,
        alt: 'Diners Club',
        height: '25',
        width: '25'
      }
    ] as Image[]
    
    // 表单 labels
    const labels = {
      cardNumber: 'Card Number',
      expirationDate: 'Expiration Date',
      cvv: 'CVV',
      cardHolderName: 'Card Holder Name',
      payNow: 'Pay Now'
    }
    
    // 表单 placeholders
    const placeholders = {
      cardNumber: 'Enter card number',
      expirationDate: 'MM/YY',
      cvv: 'Enter CVV',
      cardHolderName: 'Enter card holder name'
    }
    
    // 表单项value
    const fields = ref({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      cardHolderName: '',
      formattedCardNumber: ''
    })
    
    // 表单错误信息
    const errorMessages = ref({
      cardNumber: {
        text: '',
        empty: 'Card number cannot be empty',
        invalid: 'Invalid card number'
      },
      expirationDate: {
        text: '',
        empty: 'Expiration date cannot be empty',
        invalid: 'The date format should be MM/YY',
        expired: 'Card has expired'
      },
      cvv: {
        text: '',
        empty: 'Security code cannot be empty',
        invalid: 'Invalid security code'
      },
      cardHolderName: {
        text: '',
        empty: 'Cardholder name cannot be empty',
        invalid: 'Please enter the full name'
      }
    })
    
    const isCardNumberValid = ref(true)
    const isExpirationDateValid = ref(true)
    const isCvcValid = ref(true)
    const isCardHolderNameValid = ref(true)
    const showSpin = ref(false)
    const checkBindCard = ref(false)
    const checkInstallment = ref(false)
    
    const dialog = useDialog()
    const message = useMessage()
    
    const hasCards = ref(false)
    let tokens = ref<TokenInfo[]>([])
    const selectedCard = ref('')
    
    // 调用查询绑卡接口
    async function queryCardList() {
      const request = await queryToken()
      
      return api.post('/api/v1/txn/queryTokenList', request).then((res: any) => {
        const { respCode, respMsg, data } = res
        if (respCode === '20000' && respMsg === 'Success') {
          return data['tokenInfos']
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    
    onMounted(async () => {
      // 根据ip查询当前用户是否绑卡，没有绑卡则显示信用卡表单，否则显示绑卡的列表
      const res = await queryCardList()
      
      if (res.length > 0) {
        hasCards.value = true
        tokens.value = res
      }
      console.log(tokens, 'tokens')
    })
    
    return {
      cards,
      labels,
      placeholders,
      fields,
      errorMessages,
      isCardNumberValid,
      isExpirationDateValid,
      isCvcValid,
      isCardHolderNameValid,
      showSpin,
      checkBindCard,
      checkInstallment,
      dialog,
      message,
      tokens,
      hasCards,
      visa,
      mastercard,
      amex,
      diner,
      discover,
      selectedCard
    }
  },
  
  computed: {
    formattedCardNumber: {
      get() {
        // 显示时添加空格
        return this.fields.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
      },
      set(value: string) {
        // 更新时去除空格
        value.replace(/\s+/g, '')
      }
    },
    
    formattedExpirationDate: {
      get() {
        // 显示时添加斜杠
        return this.fields.expirationDate.replace(/(\d{2})(?=\d)/g, '$1/')
      },
      set(value: string) {
        // 更新时去除斜杠
        this.fields.expirationDate = value.replace(/\//g, '')
      }
    }
  },
  
  methods: {
    validateCardNumber() {
      this.isCardNumberValid = this.fields.cardNumber.length === 19
      if (!this.isCardNumberValid) {
        this.fields.formattedCardNumber = JSON.parse(JSON.stringify(this.fields.cardNumber))
        this.errorMessages.cardNumber.text = this.fields.formattedCardNumber.trim() === '' ? this.errorMessages.cardNumber.empty : this.errorMessages.cardNumber.invalid
      }
      this.fields.formattedCardNumber = this.fields.cardNumber
    },
    validateExpirationDate() {
      const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
      this.isExpirationDateValid = regex.test(this.fields.expirationDate)
      if (!this.isExpirationDateValid) {
        this.errorMessages.expirationDate.text = this.fields.expirationDate.trim() === '' ? this.errorMessages.expirationDate.empty : this.errorMessages.expirationDate.invalid
      }
    },
    validateCvv() {
      this.isCvcValid = this.fields.cvv.length >= 3
      if (!this.isCvcValid) {
        this.errorMessages.cvv.text = this.fields.cvv.trim() === '' ? this.errorMessages.cvv.empty : this.errorMessages.cvv.invalid
      }
    },
    validateCardHolderName() {
      const regex = /^([\u4e00-\u9fa5]{2,4}(·[\u4e00-\u9fa5]{2,4})?|[A-Za-z]+(['-]?[A-Za-z]+)*(\s[A-Za-z]+(['-]?[A-Za-z]+)*)*)$/
      
      this.isCardHolderNameValid = this.fields.cardHolderName.trim() !== '' && regex.test(this.fields.cardHolderName.trim())
      if (!this.isCardHolderNameValid) {
        this.errorMessages.cardHolderName.text = this.fields.cardHolderName.trim() === '' ? this.errorMessages.cardHolderName.empty : this.errorMessages.cardHolderName.invalid
      }
    },
    
    formatCardNumber(event: any) {
      let input = event.target.value
      // 移除输入中的所有非数字字符
      let numbers = input.replace(/\D/g, '')
      
      // 检查是否有非数字字符被移除
      if (numbers !== input) {
        // 如果有，阻止输入框更新至非数字的值
        event.target.value = numbers
      }
      
      // 格式化数字，每四位添加一个空格
      this.fields.cardNumber = numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    
    formatExpirationDate(event: any) {
      // 获取当前输入值，移除所有非数字字符和斜杠
      let input = event.target.value.replace(/\D/g, '')
      
      // 格式化为MM/YY，只有在长度为2且不包含斜线的情况下才添加斜线
      if (input.length <= 2) {
        this.fields.expirationDate = input
      } else {
        // 在月份后添加斜线（假设已经输入了两位月份数字）
        this.fields.expirationDate = input.slice(0, 2) + '/' + input.slice(2, 4)
      }
      
      // 判断是否已经过期
      let expirationDate = this.fields.expirationDate.split('/')
      let month = parseInt(expirationDate[0])
      let year = parseInt(expirationDate[1])
      let currentDate = new Date()
      let currentMonth = currentDate.getMonth() + 1
      let currentYear = parseInt(currentDate.getFullYear().toString().substr(-2))
      
      // 如果输入的年份小于当前年份，或者输入的年份等于当前年份但是月份小于当前月份，则认为已经过期
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        this.isExpirationDateValid = false
        this.errorMessages.expirationDate.text = this.errorMessages.expirationDate.expired
      } else {
        this.isExpirationDateValid = true
        this.errorMessages.expirationDate.text = ''
      }
    },
    
    validateFields() {
      this.validateCardNumber()
      this.validateExpirationDate()
      this.validateCvv()
      this.validateCardHolderName()
    },
    
    async submitForm() {
      // 校验参数
      this.validateFields()
      if (!this.isCardHolderNameValid || !this.isCvcValid || !this.isCardNumberValid || !this.isExpirationDateValid)
        return
      // 显示loading按钮
      this.showSpin = true
      
      // 去掉空格
      this.fields.formattedCardNumber = this.fields.formattedCardNumber.replace(/\s+/g, '')
      // 将expirationDate 拆分成month 和 year
      const res = this.fields.expirationDate.split('/')
      const month = res[0]
      const year = res[1]
      // 卡信息
      const cardInfo = {
        cardNumber: this.fields.formattedCardNumber,
        cvv: this.fields.cvv,
        month: month,
        year: year,
        cardHolder: this.fields.cardHolderName
      }
      
      // todo: 根据是否绑卡，分期，还是直接信用卡支付构建请求参数
      if (this.checkBindCard) { // 绑卡
        const request = await this.buildBindCard(cardInfo)
        
        // 调用绑卡接口 /v1/txn/bindCard
        api.post('/api/v1/txn/bindCard', request).then((res: any) => {
          const { respCode, respMsg } = res
          if (respCode === '20000' && respMsg === 'Success') {
            router.push({ name: 'success', query: { status: '1' } })
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.showSpin = false
        })
        
      } else if (this.checkInstallment) { // 分期
        this.buildInstallment()
      } else { // 信用卡支付
        const request = await this.buildDirectPayment(cardInfo)
        
        // 调用信用卡支付接口 /v1/txn/doTransaction
        api.post('/api/v1/txn/doTransaction', request).then((res: any) => {
          const { respCode, respMsg } = res
          if (respCode === '20000' && respMsg === 'Success') {
            router.push({ name: 'success', query: { status: '0' } })
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.showSpin = false
        })
      }
    },
    
    handleBindCard(checked: boolean) {
      this.checkBindCard = checked
    },
    
    handleInstallment(checked: boolean) {
      this.checkInstallment = checked
    },
    
    async buildDirectPayment(cardInfo: any) {
      return await directCard('20', cardInfo)
    },
    
    async buildBindCard(cardInfo: any) {
      const ip = await getClientIp()
      const { month, year } = cardInfo
      return await bindToken(this.fields.formattedCardNumber, this.fields.cvv, month, year, this.fields.cardHolderName, ip)
    },
    
    // todo: 构建分期请求参数
    buildInstallment() {
    
    }
  }
})
</script>

<template>
  <div class="py-4 rounded-lg  bg-card text-card-foreground shadow-sm w-full max-w-7xl">
    <!--    信用卡支付表单-->
    <div v-if="!hasCards" class="credit-card-form bg-white p-8 border border-gray-300 rounded-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center text-2xl">
          <n-icon>
            <icon-credit-card />
          </n-icon>
          <h2 class="text-lg font-semibold text-gray-700 ml-2">
            Credit Card
          </h2>
        </div>
        <!-- 信用卡 icons -->
        <div v-if="cards" class="flex items-center justify-center">
          <!--          添加 card-->
          <common-image :images="cards" />
        </div>
      </div>
      <!-- Form fields -->
      <form>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="cardNumber">
            <span class="text-red-500">* </span>{{ labels.cardNumber }}
          </label>
          <input id="cardNumber"
                 :placeholder="placeholders.cardNumber"
                 :value="formattedCardNumber"
                 class="card-number text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight"
                 maxlength="19"
                 type="text"
                 @blur="validateCardNumber"
                 @input="formatCardNumber" />
          <p v-if="!isCardNumberValid" class="text-[#35864c] font-semibold mt-1 pl-1 md:text-sm lg:text-sm">
            {{ errorMessages.cardNumber.text }}
          </p>
        </div>
        <div class="mb-4 -mx-2 flex ">
          <div class="px-2 w-1/2 flex-col">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="expirationDate">
              <span class="text-red-500">* </span>{{ labels.expirationDate }}
            </label>
            <input id="expirationDate"
                   :placeholder="placeholders.expirationDate"
                   :value="formattedExpirationDate"
                   class=" text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight"
                   maxlength="5"
                   type="text"
                   @blur="validateExpirationDate"
                   @input="formatExpirationDate">
            <p v-if="!isExpirationDateValid" class="text-[#35864c] font-semibold pt-1 pl-1 md:text-sm lg:text-sm">
              {{ errorMessages.expirationDate.text }}
            </p>
          </div>
          <div class="px-2 w-1/2 flex-col">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="cvc">
              <span class="text-red-500">* </span>{{ labels.cvv }}
            </label>
            <input id="cvc"
                   v-model="fields.cvv"
                   :placeholder="placeholders.cvv"
                   class="text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight"
                   type="text"
                   @blur="validateCvv">
            <p v-if="!isCvcValid" class="text-[#35864c] font-semibold pt-1 pl-1 md:text-sm lg:text-sm">
              {{ errorMessages.cvv.text }}
            </p>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="cardHolderName">
            <span class="text-red-500">* </span>{{ labels.cardHolderName }}
          </label>
          <input id="cardHolderName"
                 v-model="fields.cardHolderName"
                 :placeholder="placeholders.cardHolderName"
                 class="text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight"
                 type="text"
                 @blur="validateCardHolderName">
          <p v-if="!isCardHolderNameValid" class="text-[#35864c] font-semibold mt-1 pl-1 md:text-sm lg:text-sm">
            {{ errorMessages.cardHolderName.text }}
          </p>
        </div>
        <!-- 绑卡 -->
        <n-checkbox v-model:checked="checkBindCard" class="my-4"
                    label="Save card for future payments"
                    @update:checked="handleBindCard">
        </n-checkbox>
        <div class="flex items-center justify-between">
          <button
            class="bg-black w-full font-semibold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="submitForm"
          >
            <n-spin :show="showSpin">
              {{ labels.payNow }}
            </n-spin>
          </button>
        </div>
      </form>
    </div>
    <!--    卡列表-->
    <div v-else class="card-list mb-4 border-gray-200 border p-4 rounded-lg hover:border-gray-300">
      <n-radio
        v-for="card in tokens"
        :key="card.id"
        class="translate-y-1"
        name="basic-demo" value="Definitely Maybe"
      >
        <div class="card-info flex items-center justify-between -translate-y-1.5">
          <n-icon class="card-icon mr-2 text-4xl">
            <!-- todo: 更换src, alt-->
            <img :src="visa" alt="Visa" class="translate-y-1.5">
          </n-icon>
          <span
            class="expire text-sm text-gray-500 border rounded-lg bg-slate-200 font-semibold sm:block hidden">{{ card.month
            }}/{{ card.year
            }}</span>
          <span
            class="expire text-sm text-gray-500 border rounded-lg bg-slate-200 font-semibold sm:hidden">{{ card.month
            }}/{{ card.year.slice(-2)
            }}</span>
          <!-- Full card number for large screens -->
          <span class="card-number text-sm px-2 ml-32 font-semibold sm:block hidden">
            {{ card.cardNumber }}
          </span>
          <!-- Last 4 digits for small screens -->
          <span class="card-number-short text-sm px-1 ml-8 font-semibold sm:hidden">
            {{ card.cardNumber.slice(-4) }}
          </span>
        </div>
      </n-radio>
      <button class="w-full mt-3 p-2 border rounded-lg text-lg font-medium text-white bg-slate-900" @click="hasCards = !hasCards">
        Add Card
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>