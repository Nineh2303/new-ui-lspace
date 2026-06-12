<script setup lang="ts">
import {ref, onUnmounted,onMounted} from "vue";
import { Flame, Star } from 'lucide-vue-next';
import {useAppStore} from "@/src/stores/app.ts";
const appStore = useAppStore();


const currentDate = ref('')

let intervalId: number

const updateDate = () => {

  const now = new Date()

  currentDate.value = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

}

onMounted(() => {
  updateDate()
  intervalId = window.setInterval(() => {
    updateDate()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(intervalId)
})


</script>

<template>
  <div class="bg-gradient-to-br from-[#4572ED] to-[#2B4BCE] rounded-[32px] p-8 md:p-10 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 w-full">
    <!-- Decorative background elements -->
    <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute right-40 -bottom-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
    
    <div class="relative z-10 flex-1 w-full text-center md:text-left">
      <p class="text-blue-200 font-semibold tracking-wider text-sm uppercase mb-2">{{currentDate}}</p>
      <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">Chào buổi sáng, {{appStore.username}}!👋</h1>
      <p class="text-blue-100/90 text-lg md:text-xl max-w-2xl font-medium leading-relaxed drop-shadow-sm">
        Tiếp tục hành trình chinh phục tiếng Anh của bạn. Hôm nay là một ngày tuyệt vời để luyện tập thêm vài bài Listening và Reading.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="relative z-10 hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-5 rounded-3xl border border-white/20 shadow-inner">
      <div class="flex items-center gap-4 pr-6 border-r border-white/20">
        <div class="bg-orange-500/20 p-3 rounded-2xl">
          <Flame class="w-8 h-8 text-orange-400 fill-orange-400" />
        </div>
        <div>
          <div class="font-black text-2xl leading-none shadow-sm">7 Ngày</div>
          <div class="text-sm text-blue-200 font-medium mt-1">Chuỗi Streak</div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 pl-2">
        <div class="bg-emerald-500/20 p-3 rounded-2xl">
          <Star class="w-8 h-8 text-emerald-400 fill-emerald-400" />
        </div>
        <div>
          <div class="font-black text-2xl leading-none shadow-sm">1,240</div>
          <div class="text-sm text-blue-200 font-medium mt-1">Điểm tích lũy</div>
        </div>
      </div>
    </div>
  </div>
</template>
