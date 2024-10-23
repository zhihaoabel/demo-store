<template>
  <div class="flex-col items-center onerway-payments-container">
    <div id="ga_container" style="height: 40px"></div>
    <div id="apple_container" class="my-3" style="height: 40px"></div>
    <n-divider> Or pay with </n-divider>
    <div class="payment-form-wrapper">
      <div v-if="localIframeContentLoaded" class="-translate-y-4 checkbox-wrapper">
        <n-checkbox v-show="isSubscription" v-model:checked="bindCard">
          Save card for future payments
        </n-checkbox>
      </div>
      <div id="pacypay_checkout"></div>
    </div>
    <n-button
      v-if="!options.config.showPayButton"
      class="w-full rounded bg-slate-950 text-gray-50"
      @click="handleSubmit"
    >
      Submit
    </n-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { NButton, NCheckbox, NDivider } from 'naive-ui'

export default defineComponent({
  name: 'SdkPayment',
  components: { NButton, NCheckbox, NDivider },
  props: {
    options: {
      type: Object,
      required: true
    },
    iframeContentLoaded: {
      type: Boolean,
      required: true
    },
    pacypay: {
      type: Object,
      required: true
    },
    isSubscription: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:isSubscription', 'update:bindCard'],
  setup(props, { emit }) {
    const bindCard = ref(props.isSubscription)
    const localIframeContentLoaded = ref(false)

    function handleSubmit() {
      console.log('执行自定义支付方法')
      props.pacypay.submit()
    }

    watch(
      () => props.iframeContentLoaded,
      newValue => {
        localIframeContentLoaded.value = newValue
      }
    )

    watch(bindCard, (newValue) => {
      bindCard.value = newValue
      emit('update:bindCard', newValue)
    })

    onMounted(() => {
      const checkIframeLoaded = () => {
        const iframe = document.querySelector('#pacypay_checkout iframe') as HTMLIFrameElement
        if (iframe) {
          if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            localIframeContentLoaded.value = true
          } else {
            iframe.onload = () => {
              localIframeContentLoaded.value = true
            }
          }
          return true
        }
        return false
      }

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            if (checkIframeLoaded()) {
              observer.disconnect()
            }
          }
        })
      })

      observer.observe(document.getElementById('pacypay_checkout') as Node, {
        childList: true,
        subtree: true
      })

      // 以防 iframe 已经存在但还没有加载完成
      checkIframeLoaded()
    })

    return {
      bindCard,
      localIframeContentLoaded,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.payment-form-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

pacypay_checkout_container :deep(.pacypay-checkout__payment-method) {
  border: none;
}

.checkbox-wrapper {
  width: 100%;
  padding: 10px;
  border-top: none;
  background-color: #fff;
}
</style>
