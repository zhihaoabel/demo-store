<script lang="ts">
import { defineComponent, ref } from 'vue'
import IconCopy from '@/components/icons/IconCopy.vue'


export default defineComponent({
  name: 'CommonCopyButton',
  components: { IconCopy },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          copySuccess: false,
          isCopied: ref(false),
          tooltipContent: 'Copied',
          showTooltip: false
        }
      }
    }
  },
  
  data() {
    return {
      copySuccess: false,
      isCopied: false,
      tooltipContent: 'Copied',
      showTooltip: false
    }
  },
  
  methods: {
    onCopy() {
      this.isCopied = true
      this.tooltipContent = 'Copied'
      this.showTooltip = true
      setTimeout(() => {
        this.isCopied = false
        this.tooltipContent = ''
        this.showTooltip = false
      }, 2200)
      // After the copy action, emit an event to the parent
      this.$emit('copied')
    }
  }
})
</script>

<template>
  <div class="copy-button-wrapper flex justify-content-end">
    <n-tooltip class="" placement="bottom" trigger="hover">
      <template #trigger>
        <n-button quaternary circle :class="{ 'copy-button': true, 'copied': data.isCopied }"
                class="flex align-items-center justify-content-center" @click="onCopy">
          <span v-show="data.showTooltip"
                class="tooltip-text text-sm text-white bg-black border-1 rounded-lg py-1 px-2 shadow-lg opacity-75 scale-75">
            {{ data.tooltipContent }}
          </span>
          <n-icon>
            <icon-copy v-if="!data.isCopied" />
          </n-icon>
        </n-button>
      </template>
      copy
    </n-tooltip>
  </div>
</template>

<style scoped>
</style>