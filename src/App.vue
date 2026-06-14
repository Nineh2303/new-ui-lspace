<template>
      <AppLayout>
        <RouterView />
      </AppLayout>
      <GlobalLoading />
      <GlobalModal />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/src/stores/app.ts'
import GlobalLoading from '@/src/components/common/GlobalLoading.vue'
import GlobalModal from '@/src/components/common/GlobalModal.vue'
import AppLayout from '@/src/layouts/AppLayout.vue'

const appStore = useAppStore()

onMounted(async () => {
  const token = localStorage.getItem('langspace_token')
  if (token) {
    await appStore.getCurrentUser()
  }
})
</script>

<style lang="scss" scoped>
</style>