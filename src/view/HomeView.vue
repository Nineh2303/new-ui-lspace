<script setup lang="ts">
import {computed, ref} from 'vue';
import LeftSidebar from '../components/LeftSidebar.vue';
import DashboardCards from '../components/DashboardCards.vue';
import FilterSidebar from '../components/FilterSidebar.vue';
import VideoGrid from '../components/VideoGrid.vue';
import {useAppStore} from "@/src/stores/auth.ts";
import {IVideoItem, videosData} from "@/src/data/Dashboard.ts";

const appStore = useAppStore();

// Sidebar State
const isSidebarOpen = ref(false);

// Filter States
const currentCategory = ref('Tất cả');

// State
const videos = ref<IVideoItem[]>(videosData);
const isLoading = ref(true);

const filteredVideos = computed(() => {
  if (currentCategory.value === 'Tất cả') return videos.value;
  return videos.value.filter(v => v.category === currentCategory.value || (currentCategory.value === 'Listening' && v.category === 'Luyện nghe') || (currentCategory.value === 'Reading' && v.category === 'Luyện đọc') || (currentCategory.value === 'Writing' && v.category === 'Ngữ pháp') || (currentCategory.value === 'Speaking' && v.category === 'Luyện nói'));
});

// onMounted(async () => {
//   const authPayload = localStorage.getItem('access_token');
//   if (authPayload) {
//     appStore.getUser();
//   }
// })
</script>

<template>
  <div class="flex flex-col h-full bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden w-full h-full">


    <!-- Sidebar Left (Full Height) -->

    <div class="flex flex-col flex-1 overflow-hidden pt-16">
      <LeftSidebar :isOpen="isSidebarOpen"/>
      <!-- Header Toàn cục -->

      <!-- Phần Chính -->
      <main class="flex-1 overflow-y-auto pt-16 md:p-8 custom-scrollbar relative transition-all duration-300"
            :class="[isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20']">
        <!-- Overlay on mobile when sidebar is open -->
        <div v-if="isSidebarOpen"
             class="lg:hidden absolute inset-0 bg-slate-900/20 z-0"
             @click="isSidebarOpen = false"></div>

        <div class="w-full max-w-full px-2 md:px-4 mx-auto relative z-10">

          <div>
            <!-- Welcome Banner -->
            <DashboardCards v-if="appStore.isAuthenticated"/>
          </div>

          <!-- Phần lưới công việc và bộ lọc -->
          <div class="flex flex-col lg:flex-row gap-6 mt-6">
            <FilterSidebar
                :currentCategory="currentCategory"
                @update:currentCategory="currentCategory = $event"
            />

            <div v-if="appStore.isAuthenticated" class="flex-1">
              <VideoGrid :videos="filteredVideos"/>
            </div>

            <div v-else
                 class="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12 text-center">
              <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/-2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-black text-slate-800 mb-2">Đăng nhập để xem Video</h3>
              <p class="text-slate-500 mb-8 max-w-sm font-medium">Bạn cần đăng nhập để mở khóa hàng ngàn video bài giảng
                chất lượng cao từ các chuyên gia.</p>
              <!--              <button @click="appStore.login()"-->
              <!--                      class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">-->
              <!--                Đăng nhập ngay-->
              <!--              </button>-->
            </div>
          </div>

        </div>
      </main>
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
