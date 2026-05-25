<script setup lang="ts">
import { ref } from 'vue';
import { Play, Clock, Eye, User, X } from 'lucide-vue-next';
import type { IVideoItem } from '../data/Dashboard';

defineProps<{ 
  videos: IVideoItem[] 
}>();

const activeVideo = ref<IVideoItem | null>(null);

const openVideo = (video: IVideoItem) => {
  activeVideo.value = video;
};

const closeVideo = () => {
  activeVideo.value = null;
};
</script>

<template>
  <div class="flex-1">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 content-start">
      
      <div v-for="video in videos" :key="video.id" 
           @click="openVideo(video)"
           class="bg-white rounded-2xl border border-slate-200/60 shadow-sm relative flex flex-col hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all cursor-pointer group overflow-hidden">
        
        <!-- Thumbnail Section -->
        <div class="relative w-full aspect-video bg-slate-100 overflow-hidden">
          <img :src="video.thumbnail" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Video Thumbnail" />
          
          <!-- Overlay Play Button -->
          <div class="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
            <div class="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play class="w-5 h-5 text-blue-600 fill-blue-600 ml-1" />
            </div>
          </div>
          
          <!-- Duration Pill -->
          <div class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Clock class="w-3 h-3" /> {{ video.duration }}
          </div>
          
          <!-- Category Badge -->
          <div class="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
            {{ video.category }}
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col bg-white">
          <h3 class="font-bold text-[15px] text-slate-800 leading-snug line-clamp-2 min-h-[44px] group-hover:text-blue-600 transition-colors">{{ video.title }}</h3>
          
          <!-- Footer Stats -->
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 mt-4">
            <div class="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <User class="w-3.5 h-3.5" />
              <span>{{ video.instructor }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
              <Eye class="w-3.5 h-3.5" />
              <span>{{ video.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Modal -->
    <div v-if="activeVideo" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" @click="closeVideo"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-black rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col xl:flex-row">
        
        <!-- Close Button -->
        <button @click="closeVideo" class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
          <X class="w-6 h-6" />
        </button>

        <!-- Video Player Area Placeholder -->
        <div class="w-full xl:w-2/3 aspect-video bg-slate-800 relative flex items-center justify-center border-b xl:border-b-0 xl:border-r border-slate-700/50">
          <img :src="activeVideo.thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div class="z-10 flex flex-col items-center">
            <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] cursor-pointer hover:scale-105 transition-transform">
              <Play class="w-10 h-10 text-white fill-white ml-2" />
            </div>
            <p class="text-white/80 font-medium mt-4 text-sm tracking-wide">Nhấn để phát video</p>
          </div>
          
          <!-- Mock Player Controls -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-4 text-white">
             <Play class="w-5 h-5 fill-white" />
             <div class="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
               <div class="w-1/3 h-full bg-blue-500 rounded-full"></div>
             </div>
             <span class="text-xs font-medium">04:15 / {{ activeVideo.duration }}</span>
          </div>
        </div>

        <!-- Sidebar Details Area -->
        <div class="w-full xl:w-1/3 bg-slate-900 p-6 flex flex-col text-slate-200 p-8 h-full max-h-[40vh] xl:max-h-none overflow-y-auto custom-scrollbar">
          <div class="inline-block px-2.5 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider rounded border border-blue-500/20 mb-4 w-max">
            {{ activeVideo.category }}
          </div>
          
          <h2 class="text-2xl font-bold text-white mb-4 leading-snug">{{ activeVideo.title }}</h2>
          
          <div class="flex items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-800">
            <span class="flex items-center gap-1.5"><User class="w-4 h-4" /> {{ activeVideo.instructor }}</span>
            <span class="flex items-center gap-1.5"><Eye class="w-4 h-4" /> {{ activeVideo.views }}</span>
          </div>

          <div class="flex-1">
             <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-3">Nội dung bài học</h3>
             <ul class="space-y-3">
               <li class="flex gap-3 items-start p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-sm group">
                 <Play class="w-4 h-4 text-blue-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div>
                   <p class="font-medium text-white group-hover:text-blue-400 transition-colors">1. Giới thiệu chức năng</p>
                   <p class="text-slate-500 text-xs mt-0.5">00:00</p>
                 </div>
               </li>
               <li class="flex gap-3 items-start p-2 bg-slate-800 rounded-lg cursor-pointer transition-colors text-sm border border-slate-700">
                 <Play class="w-4 h-4 text-blue-500 mt-0.5 fill-blue-500" />
                 <div>
                   <p class="font-medium text-blue-400">2. Hướng dẫn chi tiết</p>
                   <p class="text-blue-500/70 text-xs mt-0.5">04:15 - Đang phát</p>
                 </div>
               </li>
               <li class="flex gap-3 items-start p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-sm group">
                 <Play class="w-4 h-4 text-slate-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div>
                   <p class="font-medium text-slate-300 group-hover:text-blue-400 transition-colors">3. Thực hành & Bài tập</p>
                   <p class="text-slate-500 text-xs mt-0.5">10:45</p>
                 </div>
               </li>
             </ul>
          </div>
          
          <button class="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50">
            Làm bài tập vận dụng
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
