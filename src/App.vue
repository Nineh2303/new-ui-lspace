<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <GlobalLoading />
  <GlobalModal :message="appStore.modalMessage" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/src/stores/app.ts'
import GlobalLoading from '@/src/components/common/GlobalLoading.vue'
import GlobalModal from '@/src/components/common/GlobalModal.vue'
import AppLayout from '@/src/layouts/AppLayout.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
</style>