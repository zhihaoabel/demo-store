import { defineStore } from 'pinia'

export const useShowStore = defineStore('show', {
  state: () => ({
    showCart: false,
  }),

  actions: {
    toggleShowCart() {
      this.showCart = !this.showCart
    }
  }
})