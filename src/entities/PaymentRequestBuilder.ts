class PaymentRequestBuilder {
  private readonly requestParams: any

  constructor() {
    this.requestParams = {}
  }

  setId(id: string) {
    this.requestParams.id = id
    return this
  }

  setAppId(appId: string) {
    this.requestParams.appId = appId
    return this
  }

  setBillingInformation(billingInformation: any) {
    this.requestParams.billingInformation = billingInformation
    return this
  }

  setCardInfo(cardInfo: any) {
    this.requestParams.cardInfo = cardInfo
    return this
  }

  setCountry(country: string) {
    this.requestParams.country = country
    return this
  }

  setEmail(email: string) {
    this.requestParams.email = email
    return this
  }

  setLpmsInfo(lpmsInfo: any) {
    this.requestParams.lpmsInfo = lpmsInfo
    return this
  }

  setMerchantCustId(merchantCustId: string) {
    this.requestParams.merchantCustId = merchantCustId
    return this
  }

  setMerchantNo(merchantNo: string) {
    this.requestParams.merchantNo = merchantNo
    return this
  }

  setMerchantTxnId(merchantTxnId: string) {
    this.requestParams.merchantTxnId = merchantTxnId
    return this
  }

  setMerchantTxnTime(merchantTxnTime: string) {
    this.requestParams.merchantTxnTime = merchantTxnTime
    return this
  }

  setMerchantTxnTimeZone(merchantTxnTimeZone: string) {
    this.requestParams.merchantTxnTimeZone = merchantTxnTimeZone
    return this
  }

  setOrderAmount(amount: string) {
    this.requestParams.orderAmount = amount
    return this
  }

  setOrderCurrency(orderCurrency: string) {
    this.requestParams.orderCurrency = orderCurrency
    return this
  }

  setProductType(productType: string) {
    this.requestParams.productType = productType
    return this
  }

  setShippingInformation(shippingInformation: any) {
    this.requestParams.shippingInformation = shippingInformation
    return this
  }

  setSign(sign: string) {
    this.requestParams.sign = sign
    return this
  }

  setSubProductType(subProductType: string) {
    this.requestParams.subProductType = subProductType
    return this
  }

  setTokenInfo(tokenInfo: string) {
    this.requestParams.tokenInfo = tokenInfo
    return this
  }

  setTransactionIp(transactionIp: string) {
    this.requestParams.transactionIp = transactionIp
    return this
  }

  setTxnType(txnType: string) {
    this.requestParams.txnType = txnType
    return this
  }

  setTxnOrderMsg(txnOrderMsg: any) {
    this.requestParams.txnOrderMsg = txnOrderMsg
    return this
  }

  setSubscription(subscription: any) {
    this.requestParams.subscription = subscription
    return this
  }

  build() {
    return this.requestParams
  }
}

export default PaymentRequestBuilder