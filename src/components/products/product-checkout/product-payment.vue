<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { onGooglePayLoaded } from '@/utils/pay-utils'

export default defineComponent({
  name: 'ProductPayment',
  components: {},
  
  setup() {
    
    onMounted(() => {
      const script = document.createElement('script')
      script.src = 'https://pay.google.com/gp/p/js/pay.js'
      script.async = true
      document.head.appendChild(script)
      
      script.onload = () => {
        onGooglePayLoaded()
      }
    })
    
    return {}
  },
  
  methods: {}
  
})
</script>

<template>
  <n-card :bordered="false"
          :hoverable="true"
          :segmented="{
      content: true,
    }"
          class="p-8"
          header-class="flex-col border-b"
          header-extra-class="w-full"
          size="large"
          title="Payments"
  >
    <template #header-extra>
      <div id="google-container" class="google-apple-pay-container flex-col w-full mt-4">
      </div>
    </template>
    Card Content
    <template #footer>
      #footer
    </template>
    <template #action>
      #action
    </template>
  </n-card>
</template>

<style scoped>

</style>