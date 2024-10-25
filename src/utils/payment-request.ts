import { useCurrencyStore } from '@/stores/currency'
import { fakerEN_CA, fakerEN_US, fakerZH_CN } from '@faker-js/faker'
import PaymentRequestBuilder from '@/entities/PaymentRequestBuilder'
import { generateSign } from '@/utils/sign'
import { generateCurrentTime, generateCustId } from '@/utils/util'
import { QueryBuilder } from '@/entities/QueryBuilder'
import { RefundBuilder } from '@/entities/RefundBuilder'

const isProd = import.meta.env.PROD
const devPrefix = import.meta.env.VITE_DEV_PREFIX

export const prefix = isProd ? 'prod' : devPrefix === 'prod' ? 'prod' : 'api'

const currency = useCurrencyStore()

export const CUST_ID = '730850210551402496'

export interface PaymentConfig {
  MERCHANT_NO: string
  APP_ID: string
  APP_SECRET: string
  prefix: string // 添加 prefix 到 PaymentConfig 接口
}

export function getCurrentConfig (): PaymentConfig {
  return {
    MERCHANT_NO: prefix === 'prod' ? '777777' : '800209',
    APP_ID: prefix === 'prod' ? '1839538258499215360' : '1831944691027152896',
    APP_SECRET:
      prefix === 'prod'
        ? import.meta.env.VITE_DEV_APP_SECRET_PROD || import.meta.env.VITE_PROD_APP_SECRET
        : import.meta.env.VITE_DEV_APP_SECRET,
    prefix: prefix
  }
}

export function buildBillingInformation (
  country: string = currency.getCountry(),
  phone: string = '177' + fakerEN_US.string.numeric(8),
  identityNumber: string = '12345678'
) {
  const billingInformation = {} as { [key: string]: string }
  billingInformation['country'] = country
  if (country === 'US') {
    billingInformation['province'] = fakerEN_US.location.state()
  } else if (country === 'CA') {
    billingInformation['province'] = fakerEN_CA.location.state()
  } else if (country === 'CN') {
    billingInformation['province'] = fakerZH_CN.location.state()
  }
  billingInformation['email'] = fakerEN_US.internet.email({ firstName: 'test', lastName: 'user' })
  billingInformation['firstName'] = fakerEN_US.person.firstName()
  billingInformation['lastName'] = fakerEN_US.person.lastName()
  billingInformation['phone'] = phone
  billingInformation['address'] = fakerEN_US.location.streetAddress(true)
  billingInformation['city'] = fakerEN_US.location.city()
  billingInformation['postalCode'] = fakerEN_US.location.zipCode('#####')
  billingInformation['identityNumber'] = identityNumber

  return JSON.stringify(billingInformation)
}

export function buildCardInfo (
  cardNumber: string,
  cvv: string,
  month: string,
  year: string,
  cardHolder: string
) {
  const cardInfo = {} as { [key: string]: string | number }
  cardInfo['cardNumber'] = cardNumber
  cardInfo['cvv'] = cvv
  cardInfo['month'] = month
  cardInfo['year'] = year
  cardInfo['holderName'] = cardHolder

  return JSON.stringify(cardInfo)
}

export function buildLpmsInfo (lpmsType: string, iban: string = '', walletAccountId: string = '') {
  const lpmsInfo: { [key: string]: string } = {}
  lpmsInfo['lpmsType'] = lpmsType
  lpmsInfo['iban'] = iban
  lpmsInfo['walletAccountId'] = walletAccountId

  return JSON.stringify(lpmsInfo)
}

export function buildMerchantTxnId () {
  return Date.parse(new Date().toString()).toString()
}

export function buildMerchantTxnTime () {
  return new Date().toISOString().split('.')[0].replace('T', ' ')
}

export function buildShippingInformation (
  country: string = currency.getCountry(),
  phone: string = '177' + fakerEN_US.string.numeric(8),
  identityNumber: string = '12345678'
) {
  const shippingInformation = {} as { [key: string]: string }
  shippingInformation['country'] = country
  shippingInformation['province'] = shippingInformation['email'] = fakerEN_US.internet.email({
    firstName: 'test',
    lastName: 'user'
  })
  shippingInformation['firstName'] = fakerEN_US.person.firstName()
  shippingInformation['lastName'] = fakerEN_US.person.lastName()
  shippingInformation['phone'] = phone
  shippingInformation['address'] = fakerEN_US.location.streetAddress(true)
  shippingInformation['city'] = fakerEN_US.location.city()
  shippingInformation['postalCode'] = fakerEN_US.location.zipCode('#####')
  shippingInformation['identityNumber'] = identityNumber

  return JSON.stringify(shippingInformation)
}

export function buildTokenInfo (tokenId: string) {
  const tokenInfo = {} as { [key: string]: string }
  tokenInfo['tokenId'] = tokenId

  return JSON.stringify(tokenInfo)
}

export function buildTxnOrderMsg (
  price: string = '20',
  productCurrency: string = currency.getCurrency(),
  config: PaymentConfig
) {
  const txnOrderMsg: { [key: string]: any } = {}
  txnOrderMsg['returnUrl'] = 'https://demo.onerway.com/'
  txnOrderMsg[
    'products'
  ] = `[{"price": "${price}","num":"1","name":"pro1","currency":"${productCurrency}"}]`
  txnOrderMsg['transactionIp'] = fakerEN_US.internet.ip()
  txnOrderMsg['appId'] = config.APP_ID
  txnOrderMsg['javaEnabled'] = false
  txnOrderMsg['colorDepth'] = '24'
  txnOrderMsg['screenHeight'] = '1080'
  txnOrderMsg['screenWidth'] = '1920'
  txnOrderMsg['timeZoneOffset'] = '-480'
  txnOrderMsg['accept'] =
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  txnOrderMsg['userAgent'] =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  txnOrderMsg['contentLength'] = '340'
  txnOrderMsg['language'] = 'en-US'
  txnOrderMsg['notifyUrl'] = 'https://www.merchant-store-notify.com'

  return JSON.stringify(txnOrderMsg)
}

export async function buildSubscriptionInfo (
  merchantCustId: string = '',
  requestType: number = 0,
  expireDate: string = '2030-12-31',
  frequencyType: string = 'D',
  frequencyPoint: number = 1,
  bindCard: boolean = false,
  productName: string
) {
  const subscriptionInfo = {} as { [key: string]: string | number | boolean }
  subscriptionInfo['merchantCustId'] = merchantCustId ? merchantCustId : await generateCustId()
  subscriptionInfo['requestType'] = requestType
  subscriptionInfo['expireDate'] = expireDate
  subscriptionInfo['frequencyType'] = frequencyType
  subscriptionInfo['frequencyPoint'] = frequencyPoint
  subscriptionInfo['bindCard'] = bindCard
  subscriptionInfo['productName'] = productName ? productName : Date.parse(new Date().toString()).toString()

  return JSON.stringify(subscriptionInfo)
}

async function createCheckoutRequestBuilder (
  lpmsInfo: string,
  country: string,
  phone: string,
  amount: string,
  currency: string,
  identityNumber: string = '12345678',
  iban: string = '',
  walletAccountId: string = '',
  productType: string = 'LPMS',
  config: PaymentConfig
) {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setLpmsInfo(buildLpmsInfo(lpmsInfo, iban, walletAccountId))
    .setMerchantCustId(await generateCustId())
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('DIRECT')
    .setTxnType('SALE')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency, config))
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createSubscriptionRequestBuilder (
  lpmsInfo: string,
  country: string,
  phone: string,
  amount: string,
  currency: string,
  identityNumber: string = '12345678',
  iban: string = '',
  walletAccountId: string = '',
  productType: string = 'LPMS',
  config: PaymentConfig,
  bindCard: boolean = false,
  productName: string = ''
) {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setLpmsInfo(buildLpmsInfo(lpmsInfo, iban, walletAccountId))
    .setMerchantCustId(await generateCustId())
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('SUBSCRIBE')
    .setSubscription(await buildSubscriptionInfo(undefined, undefined, undefined, undefined, undefined, bindCard, productName))
    .setTxnType('SALE')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency, config))
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createSDKTokenRequestBuilder (
  lpmsInfo: string,
  country: string,
  phone: string,
  amount: string,
  currency: string,
  identityNumber: string = '12345678',
  iban: string = '',
  walletAccountId: string = '',
  productType: string = 'LPMS',
  config: PaymentConfig,
  bindCard: boolean = false,
  productName: string = ''
) {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setMerchantCustId(await generateCustId())
    .setLpmsInfo(buildLpmsInfo(lpmsInfo, iban, walletAccountId))
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('TOKEN')
    .setSubscription(await buildSubscriptionInfo(undefined, undefined, undefined, undefined, undefined, bindCard, productName))
    .setTxnType('SALE')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency, config))
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createPaymentRequestBuilder (
  lpmsInfo: string,
  country: string,
  phone: string,
  amount: string,
  currency: string,
  identityNumber: string = '12345678',
  iban: string = '',
  walletAccountId: string = '',
  productType: string = 'LPMS',
  config: PaymentConfig
) {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setLpmsInfo(buildLpmsInfo(lpmsInfo, iban, walletAccountId))
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('DIRECT')
    .setTxnType('SALE')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency, config))
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createDirectPaymentBuilder (
  country: string,
  phone: string,
  amount: string,
  currency: string,
  identityNumber: string = '12345678',
  productType: string = 'CARD',
  cardInfo: any,
  config: PaymentConfig
) {
  const { cardNumber, cvv, month, year, cardHolder } = cardInfo
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setCardInfo(buildCardInfo(cardNumber, cvv, month, year, cardHolder))
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('DIRECT')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency, config))
    .setTxnType('SALE')
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createTokenPaymentBuilder (
  country: string,
  phone: string,
  amount: string,
  currency: string,
  identityNumber: string = '12345678',
  productType: string = 'CARD',
  tokenId: string,
  config: PaymentConfig
) {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('TOKEN')
    .setTokenInfo(buildTokenInfo(tokenId))
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency, config))
    .setTxnType('SALE')
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createQueryBuilder (
  current: string = '1',
  merchantTxnIds: string[] = [],
  startTime: string = '',
  transactionIds: string[] = [],
  txnTypes: string[] = [],
  config: PaymentConfig
) {
  const request = new QueryBuilder()
    .setCurrent(current)
    .setEndTime(generateCurrentTime())
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantTxnIds(merchantTxnIds)
    .setSign('')
    .setStartTime(startTime)
    .setTransactionIds(transactionIds)
    .setTxnTypes(txnTypes)
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

async function createRefundBuilder (
  merchantNo: string,
  refundType: string,
  merchantTxnId: string,
  originTransactionId: string,
  refundAmount: string,
  config: PaymentConfig
) {
  const request = new RefundBuilder()
    .setMerchantNo(merchantNo)
    .setRefundType(refundType)
    .setMerchantTxnId(merchantTxnId)
    .setOriginTransactionId(originTransactionId)
    .setRefundAmount(refundAmount)
    .setSign('')
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

export async function refund (
  merchantNo: string,
  refundType: string = '0',
  merchantTxnId: string,
  originTransactionId: string,
  refundAmount: string,
  config: PaymentConfig
) {
  return await createRefundBuilder(
    merchantNo,
    refundType,
    merchantTxnId,
    originTransactionId,
    refundAmount,
    config
  )
}

export async function queryTransaction (
  current: string = '1',
  merchantTxnIds: string[] = [],
  startTime: string = '',
  transactionIds: string[] = [],
  txnTypes: string[] = [],
  config: PaymentConfig
) {
  return await createQueryBuilder(
    current,
    merchantTxnIds,
    startTime,
    transactionIds,
    txnTypes,
    config
  )
}

export async function unbindCard (
  id: string,
  config: PaymentConfig
) {
  const request = new PaymentRequestBuilder()
    .setId(id)
    .setMerchantNo(config.MERCHANT_NO)
    .setSign('')
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

export function placeCheckoutOrder (amount: string, config: PaymentConfig) {
  return createCheckoutRequestBuilder(
    '',
    'US',
    '177' + fakerEN_US.string.numeric(8),
    amount,
    'USD',
    '86258406122',
    '',
    '',
    'CARD',
    config
  )
}

export function placeDirectOrder (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    '',
    'GB',
    '177' + fakerEN_US.string.numeric(8),
    amount,
    'GBP',
    '86258406122',
    '',
    '',
    'CARD',
    config
  )
}

export function placeTokenOrder (amount: string, config: PaymentConfig) {
  return createSDKTokenRequestBuilder(
    '',
    'US',
    '177' + fakerEN_US.string.numeric(8),
    amount,
    'USD',
    '86258406122',
    '',
    '',
    'CARD',
    config
  )
}

export function placeSubscriptionOrder (amount: string, config: PaymentConfig, bindCard: boolean, productName: string) {
  return createSubscriptionRequestBuilder(
    '',
    'US',
    '177' + fakerEN_US.string.numeric(8),
    amount,
    'USD',
    '86258406122',
    '',
    '',
    'CARD',
    config,
    bindCard,
    productName
  )
}


export function placeGoogleAppleOrder (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    '',
    'US',
    '177' + fakerEN_US.string.numeric(8),
    amount,
    'USD',
    '86258406122',
    '',
    '',
    'CARD',
    config
  )
}

export async function alipay_plus (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Alipay+',
    'GB',
    '177' + fakerEN_US.string.numeric(8),
    amount,
    'GBP',
    '',
    '',
    '',
    'LPMS',
    config
  )
}

export function kakao_pay (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Kakao_Pay',
    'KR',
    '8522847035',
    amount,
    'KRW',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function boleto (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Boleto',
    'BR',
    '8522847035',
    amount,
    'BRL',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function bankTransfer (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'BankTransfer',
    'BR',
    '8522847035',
    amount,
    'BRL',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function mercadoPago (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'MercadoPago',
    'BR',
    '8522847035',
    amount,
    'BRL',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function pix (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'PIX',
    'BR',
    '8522847035',
    amount,
    'BRL',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function servipag (amount: string = '50', config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Servipag',
    'CL',
    '8522847035',
    amount,
    'CLP',
    '12345678',
    '',
    '',
    'LPMS',
    config
  )
}

export function sencillito (amount: string = '50', config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Sencillito',
    'CL',
    '8522847035',
    amount,
    'CLP',
    '12345678',
    '',
    '',
    'LPMS',
    config
  )
}

export function webpay (amount: string = '50', config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Webpay',
    'CL',
    '8522847035',
    amount,
    'CLP',
    '12345678',
    '',
    '',
    'LPMS',
    config
  )
}

export function multicaja (amount: string = '350', config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Multicaja',
    'CL',
    '8522847035',
    amount,
    'CLP',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function efecty (amount: string = '10000', config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Efecty',
    'CO',
    '8522847035',
    amount,
    'COP',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function spei (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'SPEI',
    'MX',
    '8522847035',
    amount,
    'MXN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function oxxo (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'OXXO',
    'MX',
    '8522847035',
    amount,
    'MXN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function oxxopay (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'OXXOPAY',
    'MX',
    '8522847035',
    amount,
    'MXN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function pagoEfectivo (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'PagoEfectivo',
    'PE',
    '8522847035',
    amount,
    'PEN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function safetypay_cash (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'safetypay-cash',
    'PE',
    '8522847035',
    amount,
    'PEN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function safetypay_online (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'safetypay-online',
    'PE',
    '8522847035',
    amount,
    'PEN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function pagosnet (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Pagosnet',
    'BO',
    '8522847035',
    amount,
    'BOB',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function ideal (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'iDEAL',
    'NL',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function skrill (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Skrill',
    'GB',
    '8522847035',
    amount,
    'GBP',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function poli (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'POLi',
    'AU',
    '8522847035',
    amount,
    'AUD',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function sofort (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Sofort',
    'DE',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function payU (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'PayU',
    'PL',
    '8522847035',
    amount,
    'PLN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function trustly (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Trustly',
    'SE',
    '8522847035',
    amount,
    'SEK',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function sepadd (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'SEPADD',
    'DE',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    'DE89370400440532013000',
    '',
    'LPMS',
    config
  )
}

export function giropay (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Giropay',
    'DE',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function bancontact (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Bancontact',
    'BE',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function myBank (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'MyBank',
    'IT',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function payconiq (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Payconiq',
    'NL',
    '8522847035',
    amount,
    'EUR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function ovo (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'OVO',
    'ID',
    '8522847035',
    amount,
    'IDR',
    '3174040609890002',
    '',
    '',
    'LPMS',
    config
  )
}

export function maybank (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Maybank',
    'ID',
    '8522847035',
    amount,
    'IDR',
    '3174040609890002',
    '',
    '',
    'LPMS',
    config
  )
}

export function permata (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'PERMATA',
    'ID',
    '8522847035',
    amount,
    'IDR',
    '3174040609890002',
    '',
    '',
    'LPMS',
    config
  )
}

export function dana (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'DANA',
    'ID',
    '8522847035',
    amount,
    'IDR',
    '3174040609890002',
    '',
    '',
    'LPMS',
    config
  )
}

export function qris (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'QRIS',
    'ID',
    '8522847035',
    amount,
    'IDR',
    '3174040609890002',
    '',
    '',
    'LPMS',
    config
  )
}

export function shopeePay (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'ShopeePay',
    'ID',
    '8522847035',
    amount,
    'IDR',
    '3174040609890002',
    '',
    '',
    'LPMS',
    config
  )
}

export function konbini (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Konbini',
    'JP',
    '8522847035',
    amount,
    'JPY',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function payEasy (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'PayEasy',
    'JP',
    '8522847035',
    amount,
    'JPY',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function mcash (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'MCASH',
    'MY',
    '8522847035',
    amount,
    'MYR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function boost (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Boost',
    'MY',
    '8522847035',
    amount,
    'MYR',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function gCash (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'GCash',
    'PH',
    '8522847035',
    amount,
    'PHP',
    '123456789012',
    '',
    '',
    'LPMS',
    config
  )
}

export function grabPay (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'GrabPay',
    'PH',
    '8522847035',
    amount,
    'PHP',
    '123456789012',
    '',
    '',
    'LPMS',
    config
  )
}

export function payMaya (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'PayMaya',
    'PH',
    '8522847035',
    amount,
    'PHP',
    '123456789012',
    '',
    '',
    'LPMS',
    config
  )
}

export function eleven (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'ELEVEN',
    'PH',
    '8522847035',
    amount,
    'PHP',
    '123456789012',
    '',
    '',
    'LPMS',
    config
  )
}

export function przelewy24 (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Przelewy24',
    'PL',
    '8522847035',
    amount,
    'PLN',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function blikSeamless (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'BLIK_SEAMLESS',
    'PL',
    '8522847035',
    amount,
    'PLN',
    '86258406122',
    '',
    '777123',
    'LPMS',
    config
  )
}

export function payNow (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'SG_PAYNOW',
    'SG',
    '8522847035',
    amount,
    'SGD',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export function afterpay (amount: string, config: PaymentConfig) {
  return createPaymentRequestBuilder(
    'Afterpay',
    'US',
    '8522847035',
    amount,
    'USD',
    '86258406122',
    '',
    '',
    'LPMS',
    config
  )
}

export async function bindToken (
  cardNumber: string,
  cvv: string,
  month: string,
  year: string,
  cardHolder: string,
  ip: any,
  config: PaymentConfig
) {
  const cardInfo = buildCardInfo(cardNumber, cvv, month, year, cardHolder)
  const request = new PaymentRequestBuilder()
    .setAppId(config.APP_ID)
    .setCardInfo(cardInfo)
    .setCountry(currency.getCountry())
    .setEmail(fakerEN_US.internet.email({ firstName: 'test', lastName: 'user' }))
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantCustId(await generateCustId())
    .setTransactionIp(ip)
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

export async function directCard (amount: string, cardInfo: any, config: PaymentConfig) {
  return createDirectPaymentBuilder(
    currency.getCountry(),
    '177' + fakerEN_US.string.numeric(8),
    amount,
    currency.getCurrency(),
    '86258406122',
    'CARD',
    cardInfo,
    config
  )
}

export async function queryToken (config: PaymentConfig) {
  const request = new PaymentRequestBuilder()
    .setAppId(config.APP_ID)
    .setMerchantNo(config.MERCHANT_NO)
    .setMerchantCustId(await generateCustId())
    .setSign('')
    .build()

  request['sign'] = await generateSign(request, [], config.APP_SECRET)
  return request
}

export async function payByTokenId (tokenId: string, amount: string, config: PaymentConfig) {
  return createTokenPaymentBuilder(
    currency.getCountry(),
    '177' + fakerEN_US.string.numeric(8),
    amount,
    currency.getCurrency(),
    '86258406122',
    'CARD',
    tokenId,
    config
  )
}

