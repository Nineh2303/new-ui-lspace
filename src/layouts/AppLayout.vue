<script setup lang="ts">
import { ref } from 'vue'
import TopHeader from '@/src/components/TopHeader.vue'
import LeftSidebar from '@/src/components/LeftSidebar.vue'
import { useAppStore } from '@/src/stores/app.ts'

const isSidebarOpen = ref(false)
const appStore = useAppStore()
</script>

<template>

  <div class="h-screen flex flex-col overflow-hidden bg-[#F8FAFC] dark:bg-slate-950">
    <TopHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <div class="flex flex-1 overflow-hidden relative">
      <LeftSidebar :isOpen="isSidebarOpen" v-if="appStore.isAuthenticated" />
      <main class="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
main::-webkit-scrollbar {
  width: 5px;
}
main::-webkit-scrollbar-track {
  background: transparent;
}
main::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
