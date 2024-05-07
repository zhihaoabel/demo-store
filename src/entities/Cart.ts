import type { Product } from '@/entities/Product'

export class Cart {
  id: number
  products: Product[]
  amount: number
  price: number

  constructor(id: number, products: Product[], amount: number = 0, price: number = 0) {
    this.id = id
    this.products = products
    this.amount = amount
    this.price = price
  }
}