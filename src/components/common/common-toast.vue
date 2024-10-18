<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import IconHoldCard from '../icons/IconHoldCard.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconCustomerService from '@/components/icons/IconCustomerService.vue'

export default defineComponent({
  name: 'CommonToast',
  components: { IconCustomerService, IconClose, IconHoldCard },
  
  props: {
    data: {
      type: Object,
      default: () => null
    }
  },
  
  data() {
    return {
      isCollapsed: false,
      content: {
        isCollapsed: false,
        show: true,
        defaultTitle: 'Demo card',
        title: '',
        defaultMessage: 'Hello, world! This is a toast message.',
        message: '',
        animate: false,
        icon: '',
        closeText: '测试卡号'
      }
    } as { [key: string]: any }
  },
  
  methods: {
    toggleToast() {
      this.$props.data.isCollapsed = !this.$props.data.isCollapsed
    }
  }
})
</script>

<template>
  <div v-if="data.show"
       class="fixed bottom-0 m-6 sm:m-8 md:m-10 md:right-0 lg:right-0 lg:m-12 xl:m-14 2xl:m-16">
    <div v-if="!data.isCollapsed"
         class="px-4 py-2 text-gray-800 bg-white rounded-md shadow-md sm:text-xs md:text-xs lg:text-xs xl:text-sm 2xl:text-sm w-72">
      <button aria-label="Close" class="fill-amber-700 float-end" data-bs-dismiss="toast" type="button"
              @click="toggleToast">
        <n-icon>
          <icon-close class="text-lg" />
        </n-icon>
      </button>
      <div class="mb-2 font-bold toast-head">
        <slot name="icon">
          <div class="flex items-center justify-center">
            <IconHoldCard v-if="!$slots.icon" class="flex justify-center" />
          </div>
        </slot>
        <div class="mt-4 toast-header">
          <p class="font-extrabold toast-head-title text-md">{{ data.title || data.defaultTitle }}</p>
        </div>
      </div>
      <div class="toast-body">
        <slot name="message">
          <p v-if="!data.message" class="text-sm" v-html="data.defaultMessage"></p>
        </slot>
      </div>
    </div>
    <div v-else class="close-icon">
      <button aria-label="Close" class="flex fill-amber-700" data-bs-dismiss="toast" type="button"
              @click="toggleToast">
        <n-icon>
          <icon-customer-service />
        </n-icon>
        <span class="ml-1 text-xs">
          {{ data.closeText || 'Test Card' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>