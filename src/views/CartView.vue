<script lang="ts">
import { defineComponent, h, onMounted, ref } from 'vue'
import { type DataTableColumns, NButton, NImage } from 'naive-ui'
import { useCurrencyStore } from '@/stores/currency'
import type { Product } from '@/entities/Product'
import { useCartStore } from '@/stores/cart'
import { useShowStore } from '@/stores/show'
import router from '@/router'

export default defineComponent({
  name: 'CartView',
  components: {},
  
  setup(props, ctx) {
    const value = ref(1)
    const currency = useCurrencyStore()
    const show = useShowStore()
    const cart = useCartStore()
    
    const createColumns = (): DataTableColumns<Product> => {
      return [
        {
          key: 'image',
          align: 'center',
          className: 'text-nowrap',
          width: 100,
          title() {
            return h(
              'span',
              {
                class: 'text-lg font-semibold text-[#57606f]'
              },
              { default: () => 'Item' }
            )
          },
          fixed: 'left',
          render(row) {
            return h(
              NImage,
              {
                src: row.image,
                alt: row.image,
                class: 'max-sm:w-8 w-32',
                style: 'object-fit: cover; border-radius: 0.375rem;'
              }
            )
          }
        },
        {
          title: '',
          key: 'product',
          className: 'text-nowrap',
          width: 200,
          align: 'center',
          render(row) {
            return h('span',
              {
                class: 'font-semibold text-slate-[#a4b0be] text-nowrap'
              },
              { default: () => row.description }
            )
          }
        },
        {
          title() {
            return h(
              'span',
              {
                class: 'text-lg font-semibold text-[#57606f]'
              },
              { default: () => 'Quantity' }
            )
          },
          key: 'quantity',
          className: 'text-nowrap',
          width: 200,
          align: 'center',
          // 给商品数量增加+和-按钮, 数量不允许<0
          render(row) {
            return h('div', {
              class: 'flex items-center justify-center'
            }, [
              h(NButton, {
                size: 'small',
                circle: true,
                onClick: () => {
                  if (row.quantity > 0) {
                    cart.removeProduct(row)
                  }
                }
              }, {
                default: () => '-'
              }),
              h('span', {
                class: 'mx-2 text-lg font-bold'
              }, row.quantity),
              h(NButton, {
                circle: true,
                size: 'small',
                onClick: () => {
                  cart.addProduct(row)
                }
              }, {
                default: () => '+'
              })
            ])
          }
        },
        {
          title() {
            return h(
              'span',
              {
                class: 'text-lg font-semibold text-[#57606f]'
              },
              { default: () => 'Price' }
            )
          },
          key: 'price',
          className: 'text-nowrap',
          align: 'center',
          render(row) {
            return h('span', {
              class: 'text-slate-[#a4b0be]'
            }, currency.sign + ' ' + row.price)
          }
        },
        {
          title() {
            return h(
              'span',
              {
                class: 'text-lg font-semibold text-[#57606f] text-nowrap'
              },
              { default: () => 'Subtotal' }
            )
          },
          fixed: 'right',
          align: 'center',
          key: 'subtotal',
          render(row) {
            return h('span', {
              class: 'font-semibold text-slate-[#a4b0be]'
            }, currency.sign + ' ' + cart.getSubtotal(row))
          }
        }
      ]
    }
    const createSummary = (pageData: Product[]) => {
      return {
        image: {
          value: h(
            'div', {
              class: 'flex items-center sm:justify-between sm:px-64 max-sm:justify-start max-sm:px-64 w-full'
            },
            [
              h('span', {
                class: 'text-xl font-semibold text-[#57606f]'
              }, `Total: `),
              h('span', {
                class: 'text-xl font-semibold text-[#d63031] ml-4'
              }, currency.sign + ' ' + (pageData).reduce(
                (prevValue, row) => prevValue + row.price * row.quantity,
                0
              ))
            ]
          ),
          colSpan: 5
        }
      }
    }
    
    onMounted(() => {
      show.showCart = false
    })
    
    const checkout = () => {
      cart.directOrderProduct = {} as Product
      router.push({ name: 'checkout', query: { date: new Date().getTime() } })
    }
    
    return { props, ctx, value, cols: createColumns(), currency, createSummary, checkout, cart }
  },
  
  props: {
    product: {
      type: Object as () => Product[]
    }
  }
})

</script>

<template>
  <div class="sm:px-32 sm:py-16 max-sm:px-6 max-sm:py-4 font-pt-sans overflow-auto">
    <div class="cart-header flex items-center justify-between">
      <h2 class="text-3xl font-bold mb-8">Shopping Cart</h2>
      <div class="cart-button-group">
        <button
          class="font-medium px-5 py-2.5 border rounded-lg hover:text-gray-100 hover:bg-red-600 ring-red-900 active:ring-1 hover:shadow-lg hover:font-semibold shadow-red-500"
          @click="cart.clearCart">
          Clear Cart
        </button>
        <button
          class="ml-4 bg-slate-900 text-gray-50 px-5 py-2.5 border rounded-lg hover:bg-slate-700 hover:text-gray-100 ring-cyan-900 active:ring-1 hover:shadow-lg hover:font-semibold shadow-blue-500"
          @click="checkout">
          Proceed to Checkout
        </button>
      </div>
    </div>
    <n-data-table :columns="cols" :data="cart.cart.products" :size="'large'" :summary="createSummary" bordered
                  class="rounded-2xl"
                  summary-placement="bottom">
    </n-data-table>
  </div>
</template>

<style scoped>
</style>