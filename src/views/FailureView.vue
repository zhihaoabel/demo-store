<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

export default defineComponent({
  name: 'FailureView',
  setup() {
    // 从 url 获取响应参数
    const route = useRoute()
    const msg = route.query.msg
    
    let errorMessage = ''
    
    errorMessage = msg as string
    
    const handleRetry = () => {
      router.go(-1)
    }
    return {
      errorMessage,
      handleRetry
    }
  }
})

</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="rounded-lg bg-red-50 px-16 py-14">
      <div class="flex justify-center">
        <div class="rounded-full bg-red-200 p-6">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 p-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="1.5"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <h3 class="my-4 text-center text-3xl font-semibold text-gray-700">Transaction Failed</h3>
      <p class="text-center text-gray-600">
        {{errorMessage}}
      </p>
      <button
        class="mx-auto mt-6 block rounded-xl border-4 border-transparent bg-red-400 px-6 py-3 text-center text-base font-medium text-white hover:bg-red-500"
        @click="handleRetry"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>