<script lang="ts">
import { defineComponent, h, onMounted, reactive, ref } from 'vue'
import type { Transaction } from '@/entities/Transaction'
import { type DataTableColumns, NButton, useMessage } from 'naive-ui'
import { queryTransaction, refund } from '@/utils/payment-request'
import api from '@/utils/api'
import { generateCurrentDate } from '@/utils/util'

export default defineComponent({
  name: 'OrderView',
  components: {},
  
  setup(_, { expose }) {
    const message = useMessage()
    const createColumns = (): DataTableColumns<Transaction> => {
      return [
        {
          title() {
            return h('span', {
              class: 'font-semibold text-center'
            }, { default: () => 'Transaction ID' })
          },
          className: 'font-semibold text-blue-500 text-center',
          key: 'txnId',
          render(rowData, _) {
            return h('span', {
              class: 'text-[#575fcf] font-semibold'
            }, { default: () => rowData.txnId })
          }
        },
        {
          title: 'Source Transaction ID',
          key: 'originTransactionId'
        },
        {
          title() {
            return h('span', {
              class: 'font-semibold text-center'
            }, { default: () => 'Amount' })
          },
          className: 'font-semibold',
          key: 'amount'
        },
        {
          title: 'Currency',
          key: 'currency'
        },
        {
          title: 'Payment Method',
          key: 'paymentMethod'
        },
        {
          title: 'Transaction Type',
          key: 'txnType',
          render(row) {
            return h('span', {
              class: 'text-[#575fcf] font-semibold'
            }, { default: () => row.txnType })
          }
        },
        {
          title: 'Status',
          key: 'status',
          render(row) {
            return h('span', {
              class: row.status === 'S' ? 'bg-green-100 p-2 text-green-500 rounded-lg' : 'bg-red-100 p-2 text-red-500 rounded-lg'
            }, { default: () => row.remark })
          }
        },
        {
          title: 'Transaction Time',
          key: 'createdAt',
          sorter(a, b) {
            // 根据最新时间排序
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          },
          sortOrder: 'ascend'
        },
        {
          title: 'Actions',
          key: 'actions',
          // refund button
          render(row) {
            return h(NButton, {
              tertiary: true,
              type: 'info',
              loading: refundLoading.value,
              onClick: () => {
                refundLoading.value = true
                transactionRefund(row)
              }
            }, { default: () => 'Refund' })
          }
        }
      ]
    }
    const transactions = ref([] as Transaction[])
    const refundLoading = ref(false)
    const currentPage = ref('1')
    const currentPageSize = ref(10)
    const count = ref(0)
    const size = ref(1)
    const pagination = reactive({
      pageSize: currentPageSize,
      pageCount: 100
    })
    
    // 查询订单
    const orderQuery = async () => {
      const req = await queryTransaction(currentPage.value, [], `${generateCurrentDate()} 00:00:00`)
      
      api.post('/api/v1/txn/list', req).then((res) => {
        const data: any[] = res.data.content
        count.value = res.data.totalElements
        size.value = res.data.totalPages
        
        transactions.value = data.map(mapToTransaction)
      }).catch((err) => {
        console.error(err)
      })
    }
    
    // 退款
    const transactionRefund = async (txn: Transaction) => {
      const request = await refund(undefined, '0', '', txn.txnId, txn.amount)
      
      api.post('/api/v1/txn/onlineRefund', request).then((res: any) => {
        const { respCode, respMsg } = res
        if (respCode === '20000') {
          message.success('Refund success')
          orderQuery()
        } else {
          message.error(respMsg)
          orderQuery()
        }
      }).catch((err: any) => {
        message.error('Refund failed')
        orderQuery()
      })
      
      refundLoading.value = false
    }
    
    const mapToTransaction = (data: any): Transaction => {
      const obj: { [key: string]: string } = {
        'S': 'Success',
        'F': 'Failed',
        'P': 'Pending',
        'R': 'Redirect',
        'N': 'Canceled',
        'I': 'Approval Pending',
        'U': 'Payment Pending'
      }
      
      return {
        txnId: data.transactionId,
        amount: data.orderAmount,
        currency: data.orderCurrency,
        paymentMethod: data.paymentMethod,
        status: data.status,
        originTransactionId: data.originTransactionId,
        txnType: data.txnType,
        remark: obj[data.status] || 'Canceled',
        createdAt: data.txnTime
      }
    }
    
    expose({
      orderQuery
    })
    
    onMounted(() => {
      orderQuery()
    })
    
    return {
      col: createColumns(),
      transactions,
      refund: transactionRefund,
      refundLoading,
      message,
      pagination
    }
  },
  
  methods: {}
})
</script>

<template>
  <div class="sm:px-32 sm:py-16 max-sm:px-6 max-sm:py-4 overflow-auto">
    <n-data-table :columns="col" :data="transactions" :pagination="pagination" :size="'large'"
                  bordered
                  class="rounded-2xl"
                  summary-placement="bottom">
    </n-data-table>
  </div>
</template>

<style scoped>

</style>