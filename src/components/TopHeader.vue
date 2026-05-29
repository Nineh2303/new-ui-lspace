
<template>
  <header class="fixed w-full h-16 bg-white border-b border-slate-200 flex items-center shrink-0 shadow-sm z-50 px-4 md:px-6 relative justify-between">
    <!-- Left Section: Toggle & Logo -->
    <div class="flex items-center gap-3 shrink-0">
      <!-- Hamburger Toggle (Always visible) -->
      <button @click="$emit('toggle-sidebar')" class="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
        <Menu class="w-5 h-5" />
      </button>
      
      <!-- Logo Area in Header -->
      <a href="#" class="flex items-center gap-2">
        <div class="relative w-8 h-8 shrink-0 flex items-center justify-center">
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
        <div class="font-black text-[18px] tracking-widest flex items-center uppercase pb-0.5">
          <span class="text-[#FFC000]">LANG</span>
          <span class="text-[#0033CC]">SPACE</span>
        </div>
      </a>
    </div>
    
    <!-- Center Links -->
    <nav class="hidden lg:flex justify-center items-center gap-8">
      <a v-for="(link, idx) in topNavLinks" :key="idx" :href="link.href" class="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
        {{ link.label }}
        <ChevronRight v-if="link.hasDropdown" class="w-4 h-4 opacity-50 rotate-90" />
      </a>
    </nav>
    
    <!-- Right Action Area -->
    <div class="shrink-0 flex items-center gap-3 md:gap-5 h-full">
      <template v-if="appStore.isAuthenticated">
        <button class="relative text-slate-500 hover:text-slate-700 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-3 cursor-pointer" @click="appStore.logout()">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-bold text-slate-800 leading-tight">Xin chào, {{ appStore.given_name }}</div>
            <div class="text-xs font-semibold text-yellow-500">Thoát</div>
          </div>
          <div class="w-9 h-9 rounded-full overflow-hidden border border-blue-600/20 flex items-center justify-center text-blue-600 bg-blue-50">
            <img v-if="appStore.image" :src="appStore.image" alt="Avatar" class="w-full h-full object-cover" />
            <User v-else class="w-5 h-5" />
          </div>
        </div>
      </template>
      <template v-else>
<!--        <button @click="authStore.login()" class="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">-->
<!--          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-4 h-4" />-->
<!--          Đăng nhập-->
<!--        </button>-->
        <GoogleLogin :callback="callback" />
      </template>
    </div>
  </header>
</template>
<script setup lang="ts">
import { Menu, Bell, User, ChevronRight } from 'lucide-vue-next';
import { topNavLinks } from '../data/Header';
import {useAppStore} from '../stores/auth';
import {GoogleLogin}  from "vue3-google-login"
import  {IGoogleLoginPayload} from "@/src/services/api.ts";
import {encryptPayload} from "@/src/services/crypto.ts";

const appStore = useAppStore();

const callback = (response) => {
  // localStorage.setItem('google_authentication', encryptPayload(JSON.stringify(response)));
  const loginRequest: IGoogleLoginPayload ={
    credential: response.credential,
    clientId: response.clientId,
  };
  appStore.login(loginRequest)

}
defineEmits(['toggle-sidebar']);
</script>
