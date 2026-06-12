<script setup lang="ts">
import NavBar from '@/src/components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NavBar />
    <slot />
  </div>
</template>
