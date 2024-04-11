import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'USD - United States',
    options: [
      { label: 'AUD', value: 'AUD - Australia', sign: 'A$' },
      { label: 'BOB', value: 'BOB - Bolivia', sign: 'Bs' },
      { label: 'BRL', value: 'BRL - Brazil', sign: 'R$' },
      { label: 'CAD', value: 'CAD - Canada', sign: 'C$' },
      { label: 'CHF', value: 'CHF - Switzerland', sign: 'CHF' },
      { label: 'CLP', value: 'CLP - Chile', sign: '$' },
      { label: 'CNY', value: 'CNY - China', sign: '¥' },
      { label: 'COP', value: 'COP - Colombia', sign: '$' },
      { label: 'CZK', value: 'CZK - Czech Republic', sign: 'Kč' },
      { label: 'DKK', value: 'DKK - Denmark', sign: 'kr' },
      { label: 'EUR', value: 'EUR - European', sign: '€' },
      { label: 'GBP', value: 'GBP - United Kingdom', sign: '£' },
      { label: 'HKD', value: 'HKD - Hong Kong', sign: 'HK$' },
      { label: 'IDR', value: 'IDR - Indonesia', sign: 'Rp' },
      { label: 'JPY', value: 'JPY - Japan', sign: '¥' },
      { label: 'KRW', value: 'KRW - Korea', sign: '₩' },
      { label: 'MXN', value: 'MXN - Mexico Peso', sign: '$' },
      { label: 'MYR', value: 'MYR - Malaysia', sign: 'RM' },
      { label: 'NOK', value: 'NOK - Norway', sign: 'kr' },
      { label: 'PEN', value: 'PEN - Peru', sign: 'S/' },
      { label: 'PHP', value: 'PHP - Philippines', sign: '₱' },
      { label: 'PLN', value: 'PLN - Poland', sign: 'zł' },
      { label: 'RON', value: 'RON - Romania', sign: 'lei' },
      { label: 'SEK', value: 'SEK - Sweden', sign: 'kr' },
      { label: 'SGD', value: 'SGD - Singapore', sign: 'S$' },
      { label: 'THB', value: 'THB - Thailand', sign: '฿' },
      { label: 'USD', value: 'USD - United States', sign: '$' },
      { label: 'VND', value: 'VND - Vietnam', sign: '₫' }
    ],
    payments: {
      AUD: ['iDEAL', ],
      BOB: ['Pagosnet'],
      BRL: ['Boleto', 'Bank Transfer', 'MercadoPago', 'PIX'],
      CAD: ['iDEAL', ],
      CHF: ['Sofort',],
      CLP: ['Servipag', 'Sencillito', 'Webpay', 'Multicaja'],
      CNY: ['Kakao_Pay'],
      COP: ['Efecty'],
      CZK: ['PayU'],
      DKK: ['Trustly', 'iDEAL'],
      EUR: ['Alipay+', 'Kakao_Pay', 'Boleto', 'Bank Transfer', 'MercadoPago', 'PIX', 'Servipag', 'Sencillito', 'Webpay', 'Multicaja', 'Efecty', 'SEPADD', 'Sofort', 'Giropay', 'iDEAL', 'Bancontact', 'MyBank', 'Skrill', 'Trustly'],
      GBP: ['Alipay+', 'WeChat', 'Kakao_Pay', 'iDEAL', 'Skrill', 'Trustly'],
      HKD: ['iDEAL'],
      IDR: ['Kakao_Pay', 'OVO', 'Maybank', 'PERMATA', 'DANA', 'QRIS', 'ShopeePay'],
      JPY: ['Konbini', 'PayEasy', 'Konbini', 'Bank Transfer', 'PayEasy', 'Paypay', 'LINE_Pay', 'Merpay', 'Rakuten_Pay', 'BitCash', 'Net_Cash', 'WebMoney', 'au', 'SoftBank', 'NTT_Docomo', 'Paidy'],
      KRW: ['Kakao_Pay'],
      MXN: ['SPEI', 'OXXO', 'OXXOPAY', 'MercadoPago'],
      MYR: ['Kakao_Pay', 'MCASH', 'TOUCH_GO_EWALLET', 'ShopeePay', 'Boost'],
      NOK: ['iDEAL', 'Trustly'],
      PEN: ['PagoEfectivo', 'safetypay-cash', 'safetypay-online'],
      PHP: ['Kakao_Pay', 'Bank Transfer', 'Dragonpay', 'GCash', 'GrabPay', 'PayMaya', 'ELEVEN'],
      PLN: ['PayU', 'Przelewy24', 'Trustly', 'BLIK', 'BLIK_SEAMLESS'],
      RON: [],
      SEK: ['iDEAL', 'Trustly'],
      SG: ['eNETS', 'GrabPay'],
      THB: ['Kakao_Pay', 'TrueMoney Wallet', 'Rabbit_Line_pay', 'PromptPay', 'KRUNGSRI_ONLINE', 'BUALUANG_IBANKING', 'CITI_POINTS', 'K_PLUS'],
      USD: ['Alipay+', 'Kakao_Pay', 'Boleto', 'Bank Transfer', 'MercadoPago', 'PIX', 'Servipag', 'Sencillito', 'Webpay', 'Multicaja', 'Efecty', 'SPEI', 'OXXO', 'OXXOPAY', 'PagoEfectivo', 'safetypay-cash', 'safetypay-online', 'Pagosnet', 'iDEAL', 'Skrill', ],
      VND: ['VIET_QR', 'ATM_CARD', 'PAYME', 'MOMO']
    } as { [key: string]: string[] },
    country: {
      'AUD - Australia': 'AU',
      'BOB - Bolivia': 'BO',
      'BRL - Brazil': 'BR',
      'CAD - Canada': 'CA',
      'CHF - Switzerland': 'CH',
      'CLP - Chile': 'CL',
      'CNY - China': 'CN',
      'COP - Colombia': 'CO',
      'CZK - Czech Republic': 'CZ',
      'DKK - Denmark': 'DK',
      'EUR - European': 'EU',
      'GBP - United Kingdom': 'GB',
      'HKD - Hong Kong': 'HK',
      'IDR - Indonesia': 'ID',
      'JPY - Japan': 'JP',
      'KRW - Korea': 'KR',
      'MXN - Mexico Peso': 'MX',
      'MYR - Malaysia': 'MY',
      'NOK - Norway': 'NO',
      'PEN - Peru': 'PE',
      'PHP - Philippines': 'PH',
      'PLN - Poland': 'PL',
      'RON - Romania': 'RO',
      'SEK - Sweden': 'SE',
      'SGD - Singapore': 'SG',
      'THB - Thailand': 'TH',
      'USD - United States': 'US',
      'VND - Vietnam': 'VN'
    } as { [key: string]: string },
    sign: '$'
  }),

  actions: {
    setCurrency(currency: string) {
      this.currency = currency
    },

    setSign() {
      this.options.forEach(option => {
        if (option.value === this.currency) {
          this.sign = option.sign
        }
      })
    },

    getSupportedPayments() {
      // 根据 currency 选择支持的支付方式
      for (const currencyKey in this.payments) {
        if (this.currency.split(' - ')[0] === currencyKey) {
          return this.payments[currencyKey]
        }
      }
    },

    getCurrency() {
      return this.currency.split(' - ')[0]
    },

    getCountry() {
      return this.country[this.currency]
    }
  }
})



