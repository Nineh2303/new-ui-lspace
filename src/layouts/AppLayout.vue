<script setup lang="ts">
import { ref } from 'vue'
import TopHeader from '@/src/components/TopHeader.vue'
import LeftSidebar from '@/src/components/LeftSidebar.vue'
import { useAppStore } from '@/src/stores/app.ts'

const isSidebarOpen = ref(false)
const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-200">
    <TopHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <LeftSidebar :isOpen="isSidebarOpen" v-if="appStore.isAuthenticated" />
    <!-- pt-16: tránh bị TopHeader fixed (h-16) che; lg:pl-20: tránh bị collapsed LeftSidebar (w-20) che -->
    <div class="pt-16 transition-all duration-300" :class="appStore.isAuthenticated ? 'lg:pl-20' : ''">
      <slot />
    </div>
  </div>
</template>
