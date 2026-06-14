<template>
  <header
      class="w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/60 flex items-center shrink-0 shadow-sm z-50 px-4 md:px-6 justify-between transition-colors duration-200">
    <div class="flex items-center gap-3 shrink-0">
      <button @click="$emit('toggle-sidebar')"
              v-if="appStore.isAuthenticated"
              class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
        <Menu class="w-5 h-5"/>
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <div class="relative w-8 h-8 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 80 A 40 40 0 1 1 80 80" fill="none" stroke="#0033CC" stroke-width="8" stroke-linecap="round"/>
            <circle cx="35" cy="40" r="7" fill="#0033CC"/>
            <path d="M 20 80 C 20 60 40 55 50 65 L 50 80 Z" fill="#0033CC"/>
            <circle cx="65" cy="40" r="7" fill="#0033CC"/>
            <path d="M 80 80 C 80 60 60 55 50 65 L 50 80 Z" fill="#0033CC"/>
            <circle cx="50" cy="45" r="8" fill="#0033CC"/>
            <path d="M 35 80 C 35 60 65 60 65 80 Z" fill="#FFC000"/>
          </svg>
        </div>
        <div class="font-black text-[18px] tracking-widest lg:flex hidden items-center uppercase pb-0.5">
          <span class="text-[#FFC000]">LANG</span>
          <span class="text-[#0033CC]">SPACE</span>
        </div>
      </router-link>
    </div>


    <!-- Right Action Area -->
    <div class="shrink-0 flex items-center gap-2 md:gap-3 h-full">

      <!-- Dark / Light Mode Toggle -->
      <button
        @click="toggleTheme"
        class="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        :title="themeStore.theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'"
      >
        <!-- Sun icon (hiện khi đang dark) -->
        <Sun v-if="themeStore.theme === 'dark'" class="w-5 h-5" />
        <!-- Moon icon (hiện khi đang light/system) -->
        <Moon v-else class="w-5 h-5" />
      </button>

      <template v-if="appStore.isAuthenticated">
        <button class="relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Bell class="w-5 h-5"/>
        </button>
        <div class="flex items-center gap-3 cursor-pointer" @click="appStore.logout()">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">Xin chào, {{ appStore.given_name }}</div>
            <div class="text-xs font-semibold text-yellow-500">Thoát</div>
          </div>
          <div class="w-9 h-9 rounded-full overflow-hidden border border-blue-600/20 flex items-center justify-center text-blue-600 bg-blue-50 dark:bg-blue-950">
            <img v-if="appStore.image" :src="appStore.image" alt="Avatar" class="w-full h-full object-cover"/>
            <User v-else class="w-5 h-5"/>
          </div>
        </div>
      </template>

      <template v-else>
        <router-link to="/login"
                     class="border-2 text-white font-bold bg-blue-500 hover:bg-blue-400 lg:w-40 w-28 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
          Đăng nhập
        </router-link>
        <router-link to="/register" class="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 lg:w-40 w-28 h-10 rounded-lg flex items-center justify-center transition-colors">
          Đăng ký
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, Menu, Moon, Sun, User } from 'lucide-vue-next';
import { useAppStore } from '../stores/app.ts';
import { useThemeStore } from '../stores/themeStore';

const appStore = useAppStore();
const themeStore = useThemeStore();

function toggleTheme() {
  themeStore.setTheme(themeStore.theme === 'dark' ? 'light' : 'dark')
}

defineEmits(['toggle-sidebar']);
</script>
