<script lang="ts">
import { defineComponent } from 'vue'
import router from '@/router'

export default defineComponent({
  name: 'SuccessView',
  methods: {
    router() {
      return router
    }
  },
  components: {},
  setup() {
    
    return {}
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
      <p class="w-[230px] text-center font-normal text-gray-600">You have successfully placed your order</p>
      <router-link to="/">
        <button
          class="mx-auto mt-6 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300"
        >
          Back Home
        </button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>

</style>