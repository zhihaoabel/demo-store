import { useCurrencyStore } from '@/stores/currency'
import { fakerEN_CA, fakerEN_US, fakerZH_CN } from '@faker-js/faker'
import PaymentRequestBuilder from '@/entities/PaymentRequestBuilder'
import { generateSign } from '@/utils/sign'
import { generateCustId } from '@/utils/util'

const APP_ID = '1727880846378401792'
const MERCHANT_NO = '800209'
const CUST_ID = '730850210551402496'
const currency = useCurrencyStore()

/**
 * 构建账单信息
 * @param country 国家，默认为当前货币对应的国家
 * @param phone 手机号
 * @param identityNumber 身份证号
 */
export function buildBillingInformation(country: string = currency.getCountry(), phone: string = '177' + fakerEN_US.string.numeric(8), identityNumber: string = '12345678') {
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

export function buildCardInfo(cardNumber: string, cvv: string, month: string, year: string, cardHolder: string) {
  const cardInfo = {} as { [key: string]: string | number }
  cardInfo['cardNumber'] = cardNumber
  cardInfo['cvv'] = cvv
  cardInfo['month'] = month
  cardInfo['year'] = year
  cardInfo['holderName'] = cardHolder

  return JSON.stringify(cardInfo)

}

export function buildLpmsInfo(lpmsType: string, iban: string = '', walletAccountId: string = '') {
  const lpmsInfo: { [key: string]: string } = {}
  lpmsInfo['lpmsType'] = lpmsType
  lpmsInfo['iban'] = iban
  lpmsInfo['walletAccountId'] = walletAccountId

  return JSON.stringify(lpmsInfo)
}

export function buildMerchantTxnId() {
  return Date.parse(new Date().toString()).toString()
}

export function buildMerchantTxnTime() {
  return new Date().toISOString().split('.')[0].replace('T', ' ')
}

/**
 * 构建收货信息
 * @param country 国家，默认为当前货币对应的国家
 * @param phone 手机号
 * @param identityNumber 身份证号
 */
export function buildShippingInformation(country: string = currency.getCountry(), phone: string = '177' + fakerEN_US.string.numeric(8), identityNumber: string = '12345678') {
  const shippingInformation = {} as { [key: string]: string }
  shippingInformation['country'] = country
  // 如果国家是US， 则 province 用
  shippingInformation['province'] =
    shippingInformation['email'] = fakerEN_US.internet.email({ firstName: 'test', lastName: 'user' })
  shippingInformation['firstName'] = fakerEN_US.person.firstName()
  shippingInformation['lastName'] = fakerEN_US.person.lastName()
  shippingInformation['phone'] = phone
  shippingInformation['address'] = fakerEN_US.location.streetAddress(true)
  shippingInformation['city'] = fakerEN_US.location.city()
  shippingInformation['postalCode'] = fakerEN_US.location.zipCode('#####')
  shippingInformation['identityNumber'] = identityNumber

  return JSON.stringify(shippingInformation)
}

export function buildTokenInfo(tokenId: string) {
  const tokenInfo = {} as { [key: string]: string }
  tokenInfo['tokenId'] = tokenId

  return JSON.stringify(tokenInfo)
}

/**
 * 构建交易订单信息
 * @param productCurrency 商品货币，默认为当前货币
 * @param price 商品价格，默认为 20
 */
export function buildTxnOrderMsg(price: string = '20', productCurrency: string = currency.getCurrency()) {
  const txnOrderMsg: { [key: string]: any } = {}
  txnOrderMsg['returnUrl'] = 'https://demo.onerway.com/'
  txnOrderMsg['products'] = `[{"price": "${price}","num":"1","name":"iphone11","currency":"${productCurrency}"}]`
  txnOrderMsg['transactionIp'] = fakerEN_US.internet.ip()
  txnOrderMsg['appId'] = APP_ID
  txnOrderMsg['javaEnabled'] = false
  txnOrderMsg['colorDepth'] = '24'
  txnOrderMsg['screenHeight'] = '1080'
  txnOrderMsg['screenWidth'] = '1920'
  txnOrderMsg['timeZoneOffset'] = '-480'
  txnOrderMsg['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  txnOrderMsg['userAgent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  txnOrderMsg['contentLength'] = '340'
  txnOrderMsg['language'] = 'en-USen-US'

  return JSON.stringify(txnOrderMsg)
}

/**
 * 构建订阅信息
 * @param merchantCustId
 * @param requestType
 * @param expireDate
 * @param frequencyType
 * @param frequencyPoint
 */
export async function buildSubscriptionInfo(merchantCustId: string = '', requestType: number = 0, expireDate: string = '2030-12-31', frequencyType: string = 'D', frequencyPoint: number = 1) {
  const subscriptionInfo = {} as { [key: string]: string | number }
  subscriptionInfo['merchantCustId'] = merchantCustId ? merchantCustId : await generateCustId()
  subscriptionInfo['requestType'] = requestType
  subscriptionInfo['expireDate'] = expireDate
  subscriptionInfo['frequencyType'] = frequencyType
  subscriptionInfo['frequencyPoint'] = frequencyPoint

  return JSON.stringify(subscriptionInfo)
}

async function createSubscriptionRequestBuilder(lpmsInfo: string, country: string, phone: string, amount: string, currency: string, identityNumber: string = '12345678', iban: string = '', walletAccountId: string = '', productType: string = 'LPMS') {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setLpmsInfo(buildLpmsInfo(lpmsInfo, iban, walletAccountId))
    .setMerchantNo(MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('SUBSCRIBE')
    .setSubscription(await buildSubscriptionInfo())
    .setTxnType('SALE')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency)).build()

  request['sign'] = await generateSign(request, [])
  return request
}

async function createPaymentRequestBuilder(lpmsInfo: string, country: string, phone: string, amount: string, currency: string, identityNumber: string = '12345678', iban: string = '', walletAccountId: string = '', productType: string = 'LPMS') {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setLpmsInfo(buildLpmsInfo(lpmsInfo, iban, walletAccountId))
    .setMerchantNo(MERCHANT_NO)
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
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency)).build()

  request['sign'] = await generateSign(request, [])
  return request
}

async function createDirectPaymentBuilder(country: string, phone: string, amount: string, currency: string, identityNumber: string = '12345678', productType: string = 'CARD', cardInfo: any) {
  const { cardNumber, cvv, month, year, cardHolder } = cardInfo
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setCardInfo(buildCardInfo(cardNumber, cvv, month, year, cardHolder))
    .setMerchantNo(MERCHANT_NO)
    .setMerchantTxnId(buildMerchantTxnId())
    .setMerchantTxnTime(buildMerchantTxnTime())
    .setMerchantTxnTimeZone('+08:00')
    .setOrderAmount(amount)
    .setOrderCurrency(currency)
    .setProductType(productType)
    .setShippingInformation(buildShippingInformation(country, phone, identityNumber))
    .setSign('')
    .setSubProductType('DIRECT')
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency))
    .setTxnType('SALE')
    .build()

  request['sign'] = await generateSign(request, [])
  return request
}

async function createTokenPaymentBuilder(country: string, phone: string, amount: string, currency: string, identityNumber: string = '12345678', productType: string = 'CARD', tokenId: string) {
  const request = new PaymentRequestBuilder()
    .setBillingInformation(buildBillingInformation(country, phone, identityNumber))
    .setMerchantNo(MERCHANT_NO)
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
    .setTxnOrderMsg(buildTxnOrderMsg(amount, currency))
    .setTxnType('SALE')
    .build()

  request['sign'] = await generateSign(request, [])
  return request
}

/**
 * 下单接口 —— 直接支付
 * @param amount 金额
 */
export function placeDirectOrder(amount: string) {
  return createPaymentRequestBuilder('', 'CN', '177' + fakerEN_US.string.numeric(8), amount, 'CNY', '86258406122', '', '', 'CARD')
}

/**
 * 下单接口 —— 订阅支付
 * @param amount 金额
 */
export function placeSubscriptionOrder(amount: string) {
  return createSubscriptionRequestBuilder('', 'US', '177' + fakerEN_US.string.numeric(8), amount, 'USD', '86258406122', '', '', 'CARD')
}

/**
 * Google Apple Pay 下单
 */
export function placeGoogleAppleOrder(amount: string) {
  return createPaymentRequestBuilder('', 'US', '177' + fakerEN_US.string.numeric(8), amount, 'USD', '86258406122', '', '', 'CARD')
}

/**
 * alipay+
 * @param amount 金额
 */
export async function alipay_plus(amount: string) {
  return createPaymentRequestBuilder('Alipay+', 'CN', '177' + fakerEN_US.string.numeric(8), amount, 'CNY')
}

/**
 * kakao_pay
 * @param amount 金额
 */
export function kakao_pay(amount: string) {
  return createPaymentRequestBuilder('Kakao_Pay', 'KR', '8522847035', amount, 'KRW', '86258406122')
}

export function boleto(amount: string) {
  return createPaymentRequestBuilder('Boleto', 'BR', '8522847035', amount, 'BRL', '86258406122')
}

export function bankTransfer(amount: string) {
  return createPaymentRequestBuilder('BankTransfer', 'BR', '8522847035', amount, 'BRL', '86258406122')
}

export function mercadoPago(amount: string) {
  return createPaymentRequestBuilder('MercadoPago', 'BR', '8522847035', amount, 'BRL', '86258406122')
}

export function pix(amount: string) {
  return createPaymentRequestBuilder('PIX', 'BR', '8522847035', amount, 'BRL', '86258406122')
}

export function servipag(amount: string = '50') {
  return createPaymentRequestBuilder('Servipag', 'CL', '8522847035', amount, 'CLP', '12345678')
}

export function sencillito(amount: string = '50') {
  return createPaymentRequestBuilder('Sencillito', 'CL', '8522847035', amount, 'CLP', '12345678')
}

export function webpay(amount: string = '50') {
  return createPaymentRequestBuilder('Webpay', 'CL', '8522847035', amount, 'CLP', '12345678')
}

export function multicaja(amount: string = '350') {
  return createPaymentRequestBuilder('Multicaja', 'CL', '8522847035', amount, 'CLP', '86258406122')
}

export function efecty(amount: string = '10000') {
  return createPaymentRequestBuilder('Efecty', 'CO', '8522847035', amount, 'COP', '86258406122')
}

export function spei(amount: string) {
  return createPaymentRequestBuilder('SPEI', 'MX', '8522847035', amount, 'MXN', '86258406122')
}

export function oxxo(amount: string) {
  return createPaymentRequestBuilder('OXXO', 'MX', '8522847035', amount, 'MXN', '86258406122')
}

export function oxxopay(amount: string) {
  return createPaymentRequestBuilder('OXXOPAY', 'MX', '8522847035', amount, 'MXN', '86258406122')
}

export function pagoEfectivo(amount: string) {
  return createPaymentRequestBuilder('PagoEfectivo', 'PE', '8522847035', amount, 'PEN', '86258406122')
}

export function safetypay_cash(amount: string) {
  return createPaymentRequestBuilder('safetypay-cash', 'PE', '8522847035', amount, 'PEN', '86258406122')
}

export function safetypay_online(amount: string) {
  return createPaymentRequestBuilder('safetypay-online', 'PE', '8522847035', amount, 'PEN', '86258406122')
}

export function pagosnet(amount: string) {
  return createPaymentRequestBuilder('Pagosnet', 'BO', '8522847035', amount, 'BOB', '86258406122')
}

export function ideal(amount: string) {
  return createPaymentRequestBuilder('iDEAL', 'NL', '8522847035', amount, 'EUR', '86258406122')
}

export function skrill(amount: string) {
  return createPaymentRequestBuilder('Skrill', 'GB', '8522847035', amount, 'GBP', '86258406122')
}

export function poli(amount: string) {
  return createPaymentRequestBuilder('POLi', 'AU', '8522847035', amount, 'AUD', '86258406122')
}

export function sofort(amount: string) {
  return createPaymentRequestBuilder('Sofort', 'DE', '8522847035', amount, 'EUR', '86258406122')
}

export function payU(amount: string) {
  return createPaymentRequestBuilder('PayU', 'PL', '8522847035', amount, 'PLN', '86258406122')
}

export function trustly(amount: string) {
  return createPaymentRequestBuilder('Trustly', 'SE', '8522847035', amount, 'SEK', '86258406122')
}

export function sepadd(amount: string) {
  return createPaymentRequestBuilder('SEPADD', 'DE', '8522847035', amount, 'EUR', '86258406122', 'DE89370400440532013000')
}

export function giropay(amount: string) {
  return createPaymentRequestBuilder('Giropay', 'DE', '8522847035', amount, 'EUR', '86258406122')
}

export function bancontact(amount: string) {
  return createPaymentRequestBuilder('Bancontact', 'BE', '8522847035', amount, 'EUR', '86258406122')
}

export function myBank(amount: string) {
  return createPaymentRequestBuilder('MyBank', 'IT', '8522847035', amount, 'EUR', '86258406122')
}

export function payconiq(amount: string) {
  return createPaymentRequestBuilder('Payconiq', 'NL', '8522847035', amount, 'EUR', '86258406122')
}

export function ovo(amount: string) {
  return createPaymentRequestBuilder('OVO', 'ID', '8522847035', amount, 'IDR', '3174040609890002')
}

export function maybank(amount: string) {
  return createPaymentRequestBuilder('Maybank', 'ID', '8522847035', amount, 'IDR', '3174040609890002')
}

export function permata(amount: string) {
  return createPaymentRequestBuilder('PERMATA', 'ID', '8522847035', amount, 'IDR', '3174040609890002')
}

export function dana(amount: string) {
  return createPaymentRequestBuilder('dana', 'ID', '8522847035', amount, 'IDR', '3174040609890002')
}

export function qris(amount: string) {
  return createPaymentRequestBuilder('QRIS', 'ID', '8522847035', amount, 'IDR', '3174040609890002')
}

export function shopeePay(amount: string) {
  return createPaymentRequestBuilder('ShopeePay', 'ID', '8522847035', amount, 'IDR', '3174040609890002')
}

export function konbini(amount: string) {
  return createPaymentRequestBuilder('Konbini', 'JP', '8522847035', amount, 'JPY', '86258406122')
}

export function payEasy(amount: string) {
  return createPaymentRequestBuilder('PayEasy', 'JP', '8522847035', amount, 'JPY', '86258406122')
}

export function mcash(amount: string) {
  return createPaymentRequestBuilder('MCASH', 'MY', '8522847035', amount, 'MYR', '86258406122')
}

export function boost(amount: string) {
  return createPaymentRequestBuilder('Boost', 'MY', '8522847035', amount, 'MYR', '86258406122')
}

export function gCash(amount: string) {
  return createPaymentRequestBuilder('GCash', 'PH', '8522847035', amount, 'PHP', '123456789012')
}

export function grabPay(amount: string) {
  return createPaymentRequestBuilder('GrabPay', 'PH', '8522847035', amount, 'PHP', '123456789012')
}

export function payMaya(amount: string) {
  return createPaymentRequestBuilder('PayMaya', 'PH', '8522847035', amount, 'PHP', '123456789012')
}

export function eleven(amount: string) {
  return createPaymentRequestBuilder('ELEVEN', 'PH', '8522847035', amount, 'PHP', '123456789012')
}

export function przelewy24(amount: string) {
  return createPaymentRequestBuilder('Przelewy24', 'PL', '8522847035', amount, 'PLN', '86258406122')
}

export function blikSeamless(amount: string) {
  return createPaymentRequestBuilder('BLIK_SEAMLESS', 'PL', '8522847035', amount, 'PLN', '86258406122', '', '777123')
}

export function payNow(amount: string) {
  return createPaymentRequestBuilder('SG_PAYNOW', 'SG', '8522847035', amount, 'SGD', '86258406122')
}

export function afterpay(amount: string) {
  return createPaymentRequestBuilder('Afterpay', 'US', '8522847035', amount, 'USD', '86258406122')
}

export async function bindToken(cardNumber: string, cvv: string, month: string, year: string, cardHolder: string, ip: any) {
  const cardInfo = buildCardInfo(cardNumber, cvv, month, year, cardHolder)
  const request = new PaymentRequestBuilder()
    .setAppId(APP_ID)
    .setCardInfo(cardInfo)
    .setCountry(currency.getCountry())
    .setEmail(fakerEN_US.internet.email({ firstName: 'test', lastName: 'user' }))
    .setMerchantNo(MERCHANT_NO)
    .setMerchantCustId(await generateCustId())
    .setTransactionIp(ip).build()

  request['sign'] = await generateSign(request, [])
  return request
}

export async function directCard(amount: string, cardInfo: any) {
  return createDirectPaymentBuilder(currency.getCountry(), '177' + fakerEN_US.string.numeric(8), amount, currency.getCurrency(), '86258406122', 'CARD', cardInfo)
}

export async function queryToken() {
  const request = new PaymentRequestBuilder()
    .setAppId(APP_ID)
    .setMerchantNo(MERCHANT_NO)
    // .setMerchantCustId(CUST_ID)
    .setMerchantCustId(await generateCustId())
    .setSign('').build()

  request['sign'] = await generateSign(request, [])
  return request
}

export async function payByTokenId(tokenId: string, amount: string) {
  return createTokenPaymentBuilder(currency.getCountry(), '177' + fakerEN_US.string.numeric(8), amount, currency.getCurrency(), '86258406122', 'CARD', tokenId)
}

