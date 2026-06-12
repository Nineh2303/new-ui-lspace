<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/src/components/ui/dialog'
</script>

<template>
  <Dialog>
    <DialogTrigger>
      Open
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Xác nhận đăng ký
        </DialogTitle>
      </DialogHeader>

      Nội dung modal
    </DialogContent>
  </Dialog>
</template>