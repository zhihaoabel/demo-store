export class Product {
  id: number
  name: string
  price: number
  currency: string
  quantity: number
  image: string
  description: string
  link: string

  constructor(id: number, name: string, price: number, currency: string, quantity: number, image: string, description: string, link: string) {
    this.id = id
    this.name = name
    this.price = price
    this.currency = currency
    this.quantity = quantity
    this.image = image
    this.description = description
    this.link = link
  }
}
