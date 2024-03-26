import { defineStore } from 'pinia'
import type { Product } from '@/entities/Product'
import type { Cart } from '@/entities/Cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      id: 0,
      products: [],
      amount: 1
    } as Cart
  }),

  actions: {
    // 增加商品
    addProduct(product: Product) {
      const index = this.cart.products.findIndex(p => p.id === product.id)
      if (index === -1) {
        product.quantity++
        this.cart.products.push(product)
      } else {
        this.cart.products[index].quantity++
      }
      this.cart.amount++
    },

    // 减少商品
    removeProduct(product: Product) {
      const index = this.cart.products.findIndex(p => p.id === product.id)
      if (index !== -1) {
        if (this.cart.products[index].quantity === 1) {
          this.cart.products.splice(index, 1)
        } else {
          this.cart.products[index].quantity--
        }
        this.cart.amount--
      }
    },

    // 删除商品
    deleteProduct(product: Product) {
      const index = this.cart.products.findIndex(p => p.id === product.id)
      if (index !== -1) {
        this.cart.amount -= this.cart.products[index].quantity
        this.cart.products.splice(index, 1)
      }
    },

    // 清空购物车
    clearCart() {
      this.cart.products = []
      this.cart.amount = 0
    },

    // 计算总价格
    getTotalPrice(): number {
      return this.cart.products.reduce((total, product) => total + product.price * product.quantity, 0)
    },

    // 计算某个商品价格
    getProductPrice(product: Product): number {
      return product.price * product.quantity
    },

    // 获取购物车商品数量
    getCartAmount(): number {
      return this.cart.amount
    }
  }
})
