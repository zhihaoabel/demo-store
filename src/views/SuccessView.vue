<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { OrderStatus } from '@/enums/OrderStatus'

export default defineComponent({
  name: 'SuccessView',
  methods: {},
  components: {},
  
  setup() {
    // 从 url 获取响应参数
    const route = useRoute()
    const status = route.query.status
    let buttonTxt = ''
    
    let msg = ''
    if (status === OrderStatus.Success) {
      buttonTxt = 'Back Home'
      msg = 'You have successfully placed your order'
    } else if (status === OrderStatus.BindCard) {
      // 成功绑卡
      buttonTxt = 'Back'
      msg = 'You have successfully bound your card'
    } else {
      buttonTxt = 'Back Home'
      msg = 'Sorry, your order failed'
    }
    
    function handleClick() {
      if (status === '0') {
        router.push('/')
      } else if (status === '1') {
        router.go(-1)
      } else {
        router.push('/')
      }
    }
    
    return { msg, buttonTxt, handleClick }
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="rounded-lg bg-gray-50 px-16 py-14">
      <div class="flex justify-center">
        <div class="rounded-full bg-green-200 p-6">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <h3 class="my-4 text-center text-3xl font-semibold text-gray-700">Congratuation!!!</h3>
      <p class="w-[230px] text-center font-normal text-gray-600">
        {{ msg }}
      </p>
      <button
        class="mx-auto mt-6 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300"
        @click="handleClick"
      >
        {{ buttonTxt }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>