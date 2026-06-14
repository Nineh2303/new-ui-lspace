<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/src/stores/examStore'
import { useAttemptStore } from '@/src/stores/attemptStore'
import { useAppStore } from '@/src/stores/app.ts'
import { examApi } from '@/src/apis'
import type { ITopResultItem } from '@/src/stores/models/exam/response/ITopResultResponse.ts'
import UiButton from '@/src/components/ui/exam/button.vue'
import UiCard from '@/src/components/ui/exam/card.vue'
import UiCardContent from '@/src/components/ui/exam/card-content.vue'
import UiBadge from '@/src/components/ui/exam/badge.vue'
import {
  ArrowLeft, Clock, BookOpen, Target, AlertCircle, User,
  FileText, Lightbulb, ShieldCheck, RotateCcw, Zap, CheckCircle2, Trophy, Medal
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const attemptStore = useAttemptStore()
const appStore = useAppStore()

const starting = ref(false)
const error = ref('')
const topResults = ref<ITopResultItem[]>([])

onMounted(async () => {
  await examStore.fetchExam(route.params.id as string)
  await examStore.fetchQuestions(route.params.id as string)
  // Fetch top 5 leaderboard
  try {
    const res = await examApi.getExamTopResults(route.params.id as string)
    topResults.value = res.data ?? []
  } catch { /* no results yet */ }
})

function formatTime(seconds: number | null) {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const rankMedals = ['🥇', '🥈', '🥉']

// Phân loại câu hỏi
const questionStats = computed(() => {
  const qs = examStore.currentQuestions
  const poolSize = qs.length || 1
  const displayCount = examStore.currentExam?.display_question_count || qs.length
  const ratio = displayCount / poolSize

  const rawMc = qs.filter(q => q.question_type === 'multiple_choice').length
  const rawTf = qs.filter(q => q.question_type === 'true_false').length
  const rawSa = qs.filter(q => q.question_type === 'short_answer').length

  let mc = Math.round(rawMc * ratio)
  let tf = Math.round(rawTf * ratio)
  let sa = Math.round(rawSa * ratio)
  
  // Bù trừ sai số do làm tròn để tổng mc + tf + sa luôn bằng displayCount
  if (qs.length > 0) {
    const diff = displayCount - (mc + tf + sa)
    if (diff !== 0) {
      if (rawMc >= rawTf && rawMc >= rawSa) mc += diff
      else if (rawTf >= rawMc && rawTf >= rawSa) tf += diff
      else sa += diff
    }
  }

  const totalPoints = Math.round(qs.reduce((sum, q) => sum + q.points, 0) * ratio)
  
  return { mc, tf, sa, totalPoints, displayCount }
})

// Ước tính thời gian làm bài
const estimatedMinutes = computed(() => {
  const qs = examStore.currentQuestions
  const poolSize = qs.length || 1
  const displayCount = examStore.currentExam?.display_question_count || qs.length
  const ratio = displayCount / poolSize

  // ~30s/multiple_choice, ~15s/true_false, ~60s/short_answer
  const seconds = qs.reduce((sum, q) => {
    if (q.question_type === 'multiple_choice') return sum + 30
    if (q.question_type === 'true_false') return sum + 15
    return sum + 60
  }, 0)
  return Math.ceil((seconds * ratio) / 60)
})

// Mức độ khó (dựa vào số lượng câu hỏi hiển thị)
const difficulty = computed(() => {
  const count = questionStats.value.displayCount
  if (count >= 30) return { label: 'Khó', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' }
  if (count >= 15) return { label: 'Trung bình', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' }
  return { label: 'Dễ', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' }
})

async function startExam() {
  error.value = ''
  starting.value = true
  try {
    await attemptStore.startAttempt(route.params.id as string)
    router.push(`/exams/${route.params.id}/take`)
  } catch {
    error.value = 'Không thể bắt đầu bài thi. Vui lòng thử lại.'
    starting.value = false
  }
}
</script>

<template>
  <div class="bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 w-full">
    <div class="flex-1 md:p-8">
      <div class="w-full max-w-6xl px-4 md:px-6 mx-auto">

        <button
          class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 mb-8 transition-colors"
          @click="router.back()"
        >
          <ArrowLeft class="size-5" /> Quay lại danh sách
        </button>

        <div v-if="examStore.currentExam">
          <!-- Hero header -->
          <div class="mb-8">
            <div class="flex items-start gap-4 mb-3">
              <h1 class="text-3xl font-bold tracking-tight flex-1">{{ examStore.currentExam.title }}</h1>
              <UiBadge :class="difficulty.bg + ' ' + difficulty.color" class="mt-1.5 shrink-0 text-sm px-3 py-1">
                {{ difficulty.label }}
              </UiBadge>
            </div>
            <p v-if="examStore.currentExam.description" class="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ examStore.currentExam.description }}
            </p>
          </div>

          <!-- Thống kê (full width) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <UiCard class="py-5 gap-2 text-center">
              <Clock class="size-6 mx-auto text-blue-500" />
              <p class="text-2xl font-bold">{{ examStore.currentExam.time_limit_minutes ?? '∞' }}</p>
              <p class="text-sm text-muted-foreground">phút</p>
            </UiCard>
            <UiCard class="py-5 gap-2 text-center">
              <BookOpen class="size-6 mx-auto text-violet-500" />
              <p class="text-2xl font-bold">{{ questionStats.displayCount }}</p>
              <p class="text-sm text-muted-foreground">câu hỏi</p>
            </UiCard>
            <UiCard class="py-5 gap-2 text-center">
              <Zap class="size-6 mx-auto text-amber-500" />
              <p class="text-2xl font-bold">{{ questionStats.totalPoints }}</p>
              <p class="text-sm text-muted-foreground">tổng điểm</p>
            </UiCard>
            <UiCard class="py-5 gap-2 text-center">
              <Target class="size-6 mx-auto text-emerald-500" />
              <p class="text-2xl font-bold">{{ examStore.currentExam.passing_score }}</p>
              <p class="text-sm text-muted-foreground">điểm đạt</p>
            </UiCard>
          </div>

          <!-- 2-column layout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- CỘT TRÁI -->
            <div class="flex flex-col gap-6">
              <!-- Cấu trúc đề -->
              <UiCard>
                <UiCardContent class="py-6">
                  <h2 class="font-semibold text-base mb-4 flex items-center gap-2">
                    <FileText class="size-5 text-slate-400" /> Cấu trúc đề thi
                  </h2>
                  <div class="grid grid-cols-3 gap-3">
                    <div v-if="questionStats.mc > 0" class="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/20">
                      <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600">MC</div>
                      <div>
                        <p class="text-base font-semibold">{{ questionStats.mc }} câu</p>
                        <p class="text-xs text-muted-foreground">Trắc nghiệm</p>
                      </div>
                    </div>
                    <div v-if="questionStats.tf > 0" class="flex items-center gap-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/20">
                      <div class="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-bold text-violet-600">TF</div>
                      <div>
                        <p class="text-base font-semibold">{{ questionStats.tf }} câu</p>
                        <p class="text-xs text-muted-foreground">Đúng / Sai</p>
                      </div>
                    </div>
                    <div v-if="questionStats.sa > 0" class="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20">
                      <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-600">SA</div>
                      <div>
                        <p class="text-base font-semibold">{{ questionStats.sa }} câu</p>
                        <p class="text-xs text-muted-foreground">Tự luận</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="estimatedMinutes > 0" class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p class="text-sm text-muted-foreground">
                      ⏱️ Ước tính hoàn thành: <strong class="text-foreground">~{{ estimatedMinutes }} phút</strong>
                    </p>
                  </div>
                </UiCardContent>
              </UiCard>

              <!-- User info + Bắt đầu -->
              <UiCard>
                <UiCardContent class="flex flex-col gap-4 py-6">
                  <h2 class="font-semibold text-base flex items-center gap-2">
                    <ShieldCheck class="size-5 text-emerald-400" /> Xác nhận thí sinh
                  </h2>

                  <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User class="size-6 text-primary" />
                    </div>
                    <div>
                      <p class="font-semibold text-base text-slate-800 dark:text-slate-100">{{ appStore.fullName ?? appStore.given_name }}</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">{{ appStore.email }}</p>
                    </div>
                    <UiBadge variant="secondary" class="ml-auto">Đã xác thực</UiBadge>
                  </div>

                  <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

                  <UiButton :disabled="starting" class="w-full text-lg py-4 font-semibold" @click="startExam">
                    {{ starting ? 'Đang chuẩn bị…' : '🚀 Bắt đầu làm bài' }}
                  </UiButton>
                </UiCardContent>
              </UiCard>
            </div>

            <!-- CỘT PHẢI -->
            <div class="flex flex-col gap-6">
              <!-- Top 5 Bảng xếp hạng (ĐÃ ĐƯA LÊN TRÊN) -->
              <UiCard>
                <UiCardContent class="py-6">
                  <h2 class="font-semibold text-base mb-4 flex items-center gap-2">
                    <Trophy class="size-5 text-amber-400" /> Bảng xếp hạng — Top 3
                  </h2>

                  <div v-if="topResults.length > 0" class="space-y-2.5">
                    <div
                      v-for="item in topResults"
                      :key="item.rank"
                      class="flex items-center gap-3 p-3.5 rounded-xl transition-colors"
                      :class="[
                        item.rank === 1 ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800' :
                        item.rank === 2 ? 'bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700' :
                        item.rank === 3 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' :
                        'bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800'
                      ]"
                    >
                      <div class="w-10 h-10 flex items-center justify-center shrink-0">
                        <span v-if="item.rank <= 3" class="text-2xl">{{ rankMedals[item.rank - 1] }}</span>
                        <span v-else class="text-sm font-bold text-slate-400">#{{ item.rank }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-base font-semibold truncate" :class="item.rank === 1 ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-200'">{{ item.full_name }}</p>
                        <p class="text-sm text-muted-foreground">{{ item.attempt_count }} lần thi · {{ formatTime(item.best_time) }}</p>
                      </div>
                      <div class="text-right shrink-0">
                        <p class="text-xl font-bold" :class="item.passed ? 'text-emerald-600' : 'text-red-500'">{{ item.best_score }}<span class="text-sm font-normal text-slate-400">/{{ item.total_points }}</span></p>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-8 text-muted-foreground">
                    <Medal class="size-10 mx-auto mb-3 text-slate-300" />
                    <p class="text-base">Chưa có kết quả. Hãy là người đầu tiên!</p>
                  </div>
                </UiCardContent>
              </UiCard>

              <!-- Lưu ý (ĐÃ ĐƯA XUỐNG DƯỚI) -->
              <UiCard>
                <UiCardContent class="py-6">
                  <h2 class="font-semibold text-base mb-4 flex items-center gap-2">
                    <Lightbulb class="size-5 text-amber-400" /> Lưu ý trước khi thi
                  </h2>
                  <ul class="space-y-3 text-base text-slate-600 dark:text-slate-400">
                    <li class="flex items-start gap-3">
                      <CheckCircle2 class="size-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Thi lại nhiều lần — ghi nhận <strong>kết quả cao nhất</strong>.</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <CheckCircle2 class="size-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Câu trả lời <strong>tự động lưu</strong> — refresh không mất bài.</span>
                    </li>
                    <li v-if="examStore.currentExam.time_limit_minutes" class="flex items-start gap-3">
                      <AlertCircle class="size-5 shrink-0 text-amber-400 mt-0.5" />
                      <span>Giới hạn <strong>{{ examStore.currentExam.time_limit_minutes }} phút</strong>. Hết giờ tự động nộp.</span>
                    </li>
                    <li v-else class="flex items-start gap-3">
                      <CheckCircle2 class="size-5 shrink-0 text-emerald-400 mt-0.5" />
                      <span>Không giới hạn thời gian.</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <RotateCcw class="size-5 shrink-0 text-blue-400 mt-0.5" />
                      <span>Quay lại câu trước bất cứ lúc nào.</span>
                    </li>
                  </ul>
                </UiCardContent>
              </UiCard>
            </div>
          </div>
        </div>

        <div v-else class="flex justify-center py-20">
          <div class="animate-spin rounded-full size-10 border-3 border-primary border-t-transparent" />
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
