<script setup lang="ts">
import { Crown } from 'lucide-vue-next';
import { menuGroups } from '../data/Menu';

defineProps<{
  isOpen: boolean;
}>();
</script>

<template>
  <aside 
    class="bg-white border-r border-slate-200 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar z-40 transition-all duration-300 fixed h-[calc(100vh-64px)] top-16 group shadow-lg lg:shadow-none"
    :class="[
      isOpen 
        ? 'translate-x-0 w-64' 
        : '-translate-x-full lg:translate-x-0 lg:w-20 hover:lg:w-64 hover:lg:shadow-lg'
    ]"
  >
    <!-- Inner content restricted to w-64 so items don't re-wrap -->
    <div class="w-64 pb-6 mt-4 flex flex-col justify-between flex-1">
      <div>
        <!-- Menu Groups -->
        <div v-for="(group, idx) in menuGroups" :key="idx" :class="idx === 0 ? 'mt-4' : 'mt-6'">
          <div class="px-7 mb-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase transition-opacity duration-300 whitespace-nowrap"
               :class="isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 group-hover:lg:opacity-100'">
            {{ group.title }}
          </div>
          <nav :class="group.items.length === 1 ? '' : 'space-y-1'">
            <a v-for="(item, itemIdx) in group.items" :key="itemIdx" href="#" 
               class="mx-4 px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors"
               :class="item.isActive ? 'bg-[#EEF2FF] text-[#0033CC] font-semibold' : 'text-slate-500 hover:bg-slate-50 font-medium'">
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              <span class="pt-0.5 transition-opacity duration-300 whitespace-nowrap"
                    :class="isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 group-hover:lg:opacity-100'">
                {{ item.name }}
              </span>
              <span v-if="item.badge" class="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded mr-2 transition-opacity duration-300"
                    :class="[item.badge.class, isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 group-hover:lg:opacity-100']">
                {{ item.badge.text }}
              </span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Nâng cấp Premium -->
      <div class="mx-4 mt-8 bg-[#FFFAD5] rounded-2xl p-4 border border-[#FBE68A] relative overflow-hidden transition-opacity duration-300"
           :class="isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0 group-hover:lg:opacity-100'">
        <div class="flex items-center gap-2 font-bold text-[#A87B00] mb-2 relative z-10 whitespace-nowrap">
          <Crown class="w-5 h-5 shrink-0" /> Nâng cấp Premium
        </div>
        <p class="text-xs text-[#82610A] mb-4 relative z-10 leading-relaxed font-medium">
          Trải nghiệm đầy đủ tính năng AI và không giới hạn bài tập.
        </p>
        <button class="w-full py-2 bg-gradient-to-br from-[#FFC000] to-[#F5B800] rounded-lg font-bold text-[#7A5B01] text-sm shadow-sm relative z-10 hover:shadow-md transition">
          ✨ Nâng cấp ngay
        </button>
      </div>
    </div>
  </aside>
</template>
