<script setup lang="ts">
import { categoryFilters } from '../data/Filters';

defineProps<{ 
  currentCategory: string; 
}>();

defineEmits(['update:currentCategory']);
</script>

<template>
  <div class="w-full lg:w-56 shrink-0 space-y-6">
    
    <!-- Categories -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-sm">
      <div class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">KỸ NĂNG</div>
      <div class="space-y-1">
        <button v-for="item in categoryFilters" :key="item.id"
                @click="$emit('update:currentCategory', item.id)"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all"
                :class="currentCategory === item.id ? 'bg-[#4572ED] text-white shadow-md shadow-blue-500/20 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'">
          <template v-if="item.isAll">
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                 :class="currentCategory === item.id ? 'border-white' : 'border-slate-300'">
              <div v-if="currentCategory === item.id" class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </template>
          <template v-else>
            <component :is="item.icon" class="w-4 h-4 opacity-70 shrink-0" />
          </template>
          {{ item.label }}
        </button>
      </div>
    </div>

  </div>
</template>
