export class QueryBuilder {
  private readonly queryParams: any;

  constructor() {
    this.queryParams = {};
  }

  setCurrent(current: string) {
    this.queryParams.current = current;
    return this;
  }

  setEndTime(endTime: string) {
    this.queryParams.endTime = endTime;
    return this;
  }

  setMerchantNo(merchantNo: string) {
    this.queryParams.merchantNo = merchantNo;
    return this;
  }

  setMerchantTxnIds(merchantTxnIds: string[]) {
    this.queryParams.merchantTxnIds = merchantTxnIds.join(',');
    return this;
  }

  setSign(sign: string) {
    this.queryParams.sign = sign
    return this
  }

  setStartTime(startTime: string) {
    this.queryParams.startTime = startTime;
    return this;
  }

  // transactionId should be concatenated with comma. If no transactionId is provided, it should be an empty string.
  setTransactionIds(transactionIds: string[]) {
    this.queryParams.transactionIds = transactionIds.join(',');
    return this;
  }

  setTxnTypes(txnTypes: string[]) {
    this.queryParams.txnTypes = txnTypes.join(',');
    return this;
  }

  build() {
    return this.queryParams;
  }

}