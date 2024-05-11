import { defineStore } from 'pinia'
import type { Product } from '@/entities/Product'
import type { Cart } from '@/entities/Cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(<string>localStorage.getItem('cart')) || {
      id: 0,
      products: [],
      amount: 0,
      price: 0
    } as Cart,
    // 直接下单的商品
    directOrderProduct: {} as Product
  }),

  actions: {
    // 增加商品
    addProduct(product: Product) {
      const index = this.cart.products.findIndex((p: Product) => p.id === product.id)
      if (index === -1) {
        // 隔离购物车商品和直接下单商品数量
        const product_copy = JSON.parse(JSON.stringify(product))
        product_copy.quantity = 1
        this.cart.products.push(product_copy)
      } else {
        this.cart.products[index].quantity++
      }
      this.cart.amount++
      this.getTotalPrice()
    },

    // 减少商品
    removeProduct(product: Product) {
      const index = this.cart.products.findIndex((p: Product) => p.id === product.id)
      if (index !== -1) {
        if (this.cart.products[index].quantity === 1) {
          this.cart.products.splice(index, 1)
        } else {
          this.cart.products[index].quantity--
        }
        this.cart.amount--
      }
      this.getTotalPrice()
    },

    // 删除商品
    deleteProduct(product: Product) {
      const index = this.cart.products.findIndex((p: Product) => p.id === product.id)
      if (index !== -1) {
        this.cart.amount -= this.cart.products[index].quantity
        this.cart.products.splice(index, 1)
      }
      this.getTotalPrice()
    },

    // 清空购物车
    clearCart() {
      this.cart.products = []
      this.cart.amount = 0
      this.cart.price = 0
      localStorage.removeItem('cart')
    },

    // 购物车计算总价格
    getTotalPrice(): number {
      // 如果有直接下单的商品，则直接返回该商品价格
      this.cart.price = this.cart.products.reduce((total: number, product: Product) => total + product.price * product.quantity, 0)
      return this.cart.price
    },

    // 计算某个商品总价格
    getSubtotal(product: Product): number {
      return product.price * product.quantity
    },

    // 获取购物车商品数量
    getCartAmount(): number {
      return this.cart.amount
    },

    // 进入checkout页面后获取支付金额
    getPaymentAmount(): number {
      return this.directOrderProduct.price || this.getTotalPrice()
    },

    // 保存商品信息，价格和数量到本地存储
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },

    // 从本地存储中读取商品信息，价格和数量
    loadCart() {
      const cart = localStorage.getItem('cart')
      if (cart) {
        this.cart = JSON.parse(cart)
      }
    }
  }
})
