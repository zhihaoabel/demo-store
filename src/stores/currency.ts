import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'USD - United States',
    options: [
      { label: 'USD', value: 'USD - United States', sign: '$' },
      { label: 'EUR', value: 'EUR - European', sign: '€'},
      { label: 'GBP', value: 'GBP - United Kingdom', sign: '£' },
      { label: 'CNY', value: 'CNY - China', sign: '¥'},
      { label: 'JPY', value: 'JPY - Japan', sign: '¥'},
      { label: 'KRW', value: 'KRW - Korea', sign: '₩'},
      { label: 'HKD', value: 'HKD - Hong Kong', sign: 'HK$' },
      { label: 'TWD', value: 'TWD - Taiwan', sign: 'NT$' },
      { label: 'SGD', value: 'SGD - Singapore', sign: 'S$' },
      { label: 'AUD', value: 'AUD - Australia', sign: 'A$'},
      { label: 'NZD', value: 'NZD - New Zealand', sign: 'NZ$'},
      { label: 'CAD', value: 'CAD - Canada', sign: 'C$' },
      { label: 'CHF', value: 'CHF - Switzerland', sign: 'CHF' },
      { label: 'SEK', value: 'SEK - Sweden', sign: 'kr' },
      { label: 'DKK', value: 'DKK - Denmark', sign: 'kr' },
      { label: 'NOK', value: 'NOK - Norway', sign: 'kr' },
      { label: 'RUB', value: 'RUB - Russia', sign: '₽' },
      { label: 'INR', value: 'INR - India', sign: '₹'},
      { label: 'IDR', value: 'IDR - Indonesia', sign: 'Rp' },
      { label: 'MYR', value: 'MYR - Malaysia', sign: 'RM' },
      { label: 'PHP', value: 'PHP - Philippines', sign: '₱'},
      { label: 'THB', value: 'THB - Thailand', sign: '฿' },
      { label: 'VND', value: 'VND - Vietnam', sign: '₫' },
      { label: 'PKR', value: 'PKR - Pakistan', sign: '₨' },
      { label: 'BDT', value: 'BDT - Bangladesh', sign: '৳' },
      { label: 'LKR', value: 'LKR - Sri Lanka', sign: 'Rs' },
      { label: 'MNT', value: 'MNT - Mongolia', sign: '₮' },
      { label: 'KZT', value: 'KZT - Kazakhstan', sign: '₸' },
      { label: 'UZS', value: 'UZS - Uzbekistan', sign: 'лв' },
      { label: "MXN", value: "MXN - Mexico Peso", sign: "$" },
      { label: "TRY", value: "TRY - Turkey Lira", sign: "₺" },
      { label: "BRL", value: "BRL - Brazil Real", sign: "R$" },
      { label: "ZAR", value: "ZAR - South Africa Rand", sign: "R" }
    ],
    sign: '$',
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
    }
  }
})