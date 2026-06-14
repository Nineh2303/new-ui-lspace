<script setup lang="ts">
import {computed, ref} from 'vue';
import DashboardCards from '../components/DashboardCards.vue';
import FilterSidebar from '../components/FilterSidebar.vue';
import VideoGrid from '../components/VideoGrid.vue';
import {useAppStore} from "@/src/stores/app.ts";
import {IVideoItem, videosData} from "@/src/data/Dashboard.ts";

const appStore = useAppStore();

// Filter States
const currentCategory = ref('Tất cả');

// State
const videos = ref<IVideoItem[]>(videosData);
const isLoading = ref(true);

const filteredVideos = computed(() => {
  if (currentCategory.value === 'Tất cả') return videos.value;
  return videos.value.filter(v => v.category === currentCategory.value || (currentCategory.value === 'Listening' && v.category === 'Luyện nghe') || (currentCategory.value === 'Reading' && v.category === 'Luyện đọc') || (currentCategory.value === 'Writing' && v.category === 'Ngữ pháp') || (currentCategory.value === 'Speaking' && v.category === 'Luyện nói'));
});

</script>

<template>
  <div class="bg-[#F8FAFC]  dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 w-full">
    <div class="flex flex-col flex-1">

      <div class="flex-1 md:p-8">

        <div class="w-[80%] max-w-full px-2 md:px-4 mx-auto relative z-10">

          <div>
            <DashboardCards v-if="appStore.isAuthenticated"/>
          </div>
          <div class="flex flex-col lg:flex-row gap-6 mt-6">

            <div v-if="appStore.isAuthenticated" class="flex-1">
              <VideoGrid :videos="filteredVideos"/>
            </div>

            <div v-else
                 class="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col items-center justify-center p-12 text-center">
              <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/-2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Đăng nhập để xem Video</h3>
              <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium">Bạn cần đăng nhập để mở khóa hàng ngàn video bài giảng
                chất lượng cao từ các chuyên gia.</p>
            </div>
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
