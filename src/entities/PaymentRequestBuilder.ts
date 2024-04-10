class PaymentRequestBuilder {
  private readonly requestParams: any

  constructor() {
    this.requestParams = {}
  }

  setBillingInformation(billingInformation: any) {
    this.requestParams.billingInformation = billingInformation
    return this
  }

  setLpmsInfo(lpmsInfo: any) {
    this.requestParams.lpmsInfo = lpmsInfo
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

  setTxnType(txnType: string) {
    this.requestParams.txnType = txnType
    return this
  }

  setTxnOrderMsg(txnOrderMsg: any) {
    this.requestParams.txnOrderMsg = txnOrderMsg
    return this
  }

  build() {
    return this.requestParams
  }
}

export default PaymentRequestBuilder