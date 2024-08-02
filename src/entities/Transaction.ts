export class Transaction {
  txnId: string
  amount: string
  currency: string
  originTransactionId: string
  paymentMethod: string
  status: string
  txnType: string
  remark: string
  createdAt: string

  constructor(txnId: string, amount: string, currency: string, originTransactionId: string, paymentMethod: string, status: string, txnType: string, remark: string, createdAt: string) {
    this.txnId = txnId
    this.amount = amount
    this.currency = currency
    this.originTransactionId = originTransactionId
    this.paymentMethod = paymentMethod
    this.status = status
    this.txnType = txnType
    this.remark = remark
    this.createdAt = createdAt
  }
}