<script setup lang="ts">
import { computed, ref } from 'vue';
import FilterSidebar from '../components/FilterSidebar.vue';
import VideoGrid from '../components/VideoGrid.vue';
import { IVideoItem, videosData } from "@/src/data/Dashboard.ts";

// Filter States
const currentCategory = ref('Tất cả');

// State
const videos = ref<IVideoItem[]>(videosData);

const filteredVideos = computed(() => {
  if (currentCategory.value === 'Tất cả') return videos.value;
  return videos.value.filter(v => v.category === currentCategory.value || (currentCategory.value === 'Listening' && v.category === 'Luyện nghe') || (currentCategory.value === 'Reading' && v.category === 'Luyện đọc') || (currentCategory.value === 'Writing' && v.category === 'Ngữ pháp') || (currentCategory.value === 'Speaking' && v.category === 'Luyện nói'));
});
</script>

<template>
  <div class="bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 w-full">
    <div class="flex-1 md:p-8">
      <div class="w-full max-w-full px-2 md:px-4 mx-auto">

        <div class="mb-6">
          <h1 class="text-2xl font-bold tracking-tight">Video bài giảng</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Xem các bài giảng và hướng dẫn từ chuyên gia.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <FilterSidebar
              :currentCategory="currentCategory"
              @update:currentCategory="currentCategory = $event"
          />
          <div class="flex-1">
            <VideoGrid :videos="filteredVideos"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
