<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/src/stores/examStore'
import { useAttemptStore } from '@/src/stores/attemptStore'
import UiButton from '@/src/components/ui/exam/button.vue'
import UiCard from '@/src/components/ui/exam/card.vue'
import UiCardContent from '@/src/components/ui/exam/card-content.vue'
import UiInput from '@/src/components/ui/exam/input.vue'
import UiLabel from '@/src/components/ui/exam/label.vue'
import UiBadge from '@/src/components/ui/exam/badge.vue'
import { ArrowLeft, Clock, BookOpen, Target, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const attemptStore = useAttemptStore()

const name = ref('')
const email = ref('')
const starting = ref(false)
const error = ref('')

onMounted(async () => {
  await examStore.fetchExam(route.params.id as string)
  await examStore.fetchQuestions(route.params.id as string)
})

async function startExam() {
  if (!name.value.trim()) { error.value = 'Vui lòng nhập họ và tên.'; return }
  if (!email.value.trim()) { error.value = 'Vui lòng nhập email.'; return }
  error.value = ''
  starting.value = true
  try {
    await attemptStore.startAttempt(route.params.id as string, name.value.trim(), email.value.trim())
    router.push(`/exams/${route.params.id}/take`)
  } catch {
    error.value = 'Không thể bắt đầu bài thi. Vui lòng thử lại.'
    starting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto max-w-2xl px-4 py-10">
      <button class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors" @click="router.back()">
        <ArrowLeft class="size-4" /> Quay lại
      </button>

      <div v-if="examStore.currentExam">
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight mb-2">{{ examStore.currentExam.title }}</h1>
          <p v-if="examStore.currentExam.description" class="text-muted-foreground">
            {{ examStore.currentExam.description }}
          </p>
        </div>

        <!-- Thống kê -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <UiCard class="py-4 gap-2 text-center">
            <Clock class="size-5 mx-auto text-primary" />
            <div class="px-2">
              <p class="text-lg font-bold">{{ examStore.currentExam.time_limit_minutes ?? '∞' }}</p>
              <p class="text-xs text-muted-foreground">phút</p>
            </div>
          </UiCard>
          <UiCard class="py-4 gap-2 text-center">
            <BookOpen class="size-5 mx-auto text-primary" />
            <div class="px-2">
              <p class="text-lg font-bold">{{ examStore.currentQuestions.length }}</p>
              <p class="text-xs text-muted-foreground">câu hỏi</p>
            </div>
          </UiCard>
          <UiCard class="py-4 gap-2 text-center">
            <Target class="size-5 mx-auto text-primary" />
            <div class="px-2">
              <p class="text-lg font-bold">{{ examStore.currentExam.passing_score }}%</p>
              <p class="text-xs text-muted-foreground">để đạt</p>
            </div>
          </UiCard>
        </div>

        <!-- Form bắt đầu -->
        <UiCard>
          <UiCardContent class="flex flex-col gap-4 py-6">
            <h2 class="font-semibold text-base">Nhập thông tin để bắt đầu làm bài</h2>

            <div class="flex flex-col gap-1.5">
              <UiLabel for="name">Họ và tên <span class="text-red-500">*</span></UiLabel>
              <UiInput id="name" v-model="name" placeholder="Nhập họ và tên của bạn" />
            </div>
            <div class="flex flex-col gap-1.5">
              <UiLabel for="email">Email <span class="text-red-500">*</span></UiLabel>
              <UiInput id="email" v-model="email" type="email" placeholder="your@email.com" />
            </div>

            <div v-if="examStore.currentExam.time_limit_minutes" class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle class="size-4 shrink-0 mt-0.5" />
              <span>Bài thi này có giới hạn {{ examStore.currentExam.time_limit_minutes }} phút. Đồng hồ bắt đầu ngay khi bạn nhấn "Bắt đầu".</span>
            </div>

            <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

            <UiButton :disabled="starting" class="w-full" @click="startExam">
              {{ starting ? 'Đang chuẩn bị…' : 'Bắt đầu làm bài' }}
            </UiButton>
          </UiCardContent>
        </UiCard>
      </div>

      <div v-else class="flex justify-center py-20">
        <div class="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent" />
      </div>
  </div>
</template>
