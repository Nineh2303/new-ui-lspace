<template>
    <div class="flex w-full h-full">
      <div class="w-full fixed z-20">
        <TopHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen"/>
      </div>
      <router-view/> 
    </div>
</template>
<script setup>

import TopHeader from "@/src/components/TopHeader.vue";
</script>

<style lang="scss" scoped>

</style>