<script lang="ts" setup>

import IconGooglePay from '@/components/icons/IconGooglePay.vue'
</script>

<template>
  <n-card :bordered="false"
          :hoverable="true"
          :segmented="{
      content: true,
    }"
          class="p-12"
          header-class="flex-col border-b"
          header-extra-class="w-full"
          size="large"
          title="Payments"
  >
    <template #header-extra>
      <div class="google-apple-pay-container flex-col w-full ">
        <n-button class="google-pay flex items-center w-full hover:bg-slate-700 mt-6" icon-placement="right"
                  size="large" strong>
          Buy with Google Pay
          <template #icon>
            <n-icon>
              <icon-google-pay />
            </n-icon>
          </template>
        </n-button>
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