export class RefundBuilder {

  private readonly refundParams: any

  constructor() {
    this.refundParams = {}
  }

  setMerchantNo(merchantNo: string) {
    this.refundParams.merchantNo = merchantNo
    return this
  }

  setRefundType(refundType: string) {
    this.refundParams.refundType = refundType
    return this
  }

  setMerchantTxnId(merchantTxnId: string) {
    this.refundParams.merchantTxnId = merchantTxnId
    return this
  }

  setOriginTransactionId(originTransactionId: string) {
    this.refundParams.originTransactionId = originTransactionId
    return this
  }

  setRefundAmount(refundAmount: string) {
    this.refundParams.refundAmount = refundAmount
    return this
  }

  setSign(sign: string) {
    this.refundParams.sign = sign
    return this
  }

  build() {
    return this.refundParams
  }
}