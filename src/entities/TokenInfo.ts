export class TokenInfo {
  id: string
  tokenId: string
  appId: string
  cardNumber: string
  paymentMethod: string
  year: string
  month: string


  constructor(id: string, tokenId: string, appId: string, cardNumber: string, paymentMethod: string, year: string, month: string) {
    this.id = id
    this.tokenId = tokenId
    this.appId = appId
    this.cardNumber = cardNumber
    this.paymentMethod = paymentMethod
    this.year = year
    this.month = month
  }
}