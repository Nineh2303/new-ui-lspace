<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/src/stores/app.ts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/src/components/ui/dialog'
import { CircleAlert, CircleCheck, Info } from 'lucide-vue-next'

const appStore = useAppStore()

const isOpen = computed({
  get: () => appStore.isModal,
  set: (val: boolean) => {
    if (!val) appStore.closeModal()
  },
})

// Phân loại message để hiển thị icon + màu phù hợp
const messageType = computed(() => {
  const msg = (appStore.modalMessage || '').toLowerCase()
  if (msg.includes('thành công') || msg.includes('success')) return 'success'
  if (msg.includes('lỗi') || msg.includes('error') || msg.includes('thất bại')
    || msg.includes('không chính xác') || msg.includes('không có quyền')
    || msg.includes('không thể')) return 'error'
  return 'info'
})

const iconColor = computed(() => {
  switch (messageType.value) {
    case 'success': return 'text-emerald-500'
    case 'error': return 'text-red-500'
    default: return 'text-blue-500'
  }
})

const titleText = computed(() => {
  switch (messageType.value) {
    case 'success': return 'Thành công'
    case 'error': return 'Có lỗi xảy ra'
    default: return 'Thông báo'
  }
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-full"
            :class="{
              'bg-emerald-50 dark:bg-emerald-950': messageType === 'success',
              'bg-red-50 dark:bg-red-950': messageType === 'error',
              'bg-blue-50 dark:bg-blue-950': messageType === 'info',
            }"
          >
            <CircleCheck v-if="messageType === 'success'" class="size-5" :class="iconColor" />
            <CircleAlert v-else-if="messageType === 'error'" class="size-5" :class="iconColor" />
            <Info v-else class="size-5" :class="iconColor" />
          </div>
          <DialogTitle class="text-base">{{ titleText }}</DialogTitle>
        </div>
      </DialogHeader>

      <div class="py-3 pl-[52px] text-sm text-muted-foreground leading-relaxed">
        {{ appStore.modalMessage }}
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <button
            class="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors"
            :class="{
              'bg-emerald-500 text-white hover:bg-emerald-600': messageType === 'success',
              'bg-red-500 text-white hover:bg-red-600': messageType === 'error',
              'bg-blue-500 text-white hover:bg-blue-600': messageType === 'info',
            }"
          >
            Đã hiểu
          </button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>