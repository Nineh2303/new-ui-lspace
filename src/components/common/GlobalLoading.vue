<script setup lang="ts">

import {useAppStore} from "@/src/stores/app.ts";

const appStore = useAppStore();
</script>

<template>
  <div class="fixed inset-0 z-[100] bg-white/30 backdrop-blur-sm flex items-center justify-center"
  :class="appStore.isLoading == false ? 'hidden' : ''">
    <div class="flex flex-col items-center">
      <div class="relative w-16 h-16 mb-4 animate-bounce">
        <svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M 20 80 A 40 40 0 1 1 80 80" fill="none" stroke="#0033CC" stroke-width="8" stroke-linecap="round"/>
          <circle cx="35" cy="40" r="7" fill="#0033CC" />
          <path d="M 20 80 C 20 60 40 55 50 65 L 50 80 Z" fill="#0033CC" />
          <circle cx="65" cy="40" r="7" fill="#0033CC" />
          <path d="M 80 80 C 80 60 60 55 50 65 L 50 80 Z" fill="#0033CC" />
          <circle cx="50" cy="45" r="8" fill="#0033CC" />
          <path d="M 35 80 C 35 60 65 60 65 80 Z" fill="#FFC000" />
        </svg>
      </div>
      <div class="font-black text-2xl tracking-widest flex items-center uppercase animate-pulse">
        <span class="text-[#FFC000]">LANG</span>
        <span class="text-[#0033CC]">SPACE</span>
      </div>
    </div>
  </div>
</template>
