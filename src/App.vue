<template>
    <div class="flex w-full h-full">
      <div class="w-full fixed z-20">
        <TopHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen"/>
      </div>
      <RouterView/>
    </div>
  <GlobalLoading/>
  <Toaster position="top-right" richColors/>
</template>
<script setup lang="ts">

import TopHeader from "@/src/components/TopHeader.vue";
import GlobalLoading from "@/src/components/GlobalLoading.vue";
import { Toaster } from 'vue-sonner'
import {ref} from 'vue'
import {RouterView} from "vue-router"


// Sidebar State
const isSidebarOpen = ref(false);
</script>

<style lang="scss" scoped>

</style>