<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useExamStore } from "@/src/stores/examStore"
import { useAttemptStore } from "@/src/stores/attemptStore"
import ExamTimer from "@/src/components/ExamTimer.vue"
import QuestionDisplay from "@/src/components/QuestionDisplay.vue"
import UiButton from "@/src/components/ui/exam/button.vue"
import UiProgress from "@/src/components/ui/exam/progress.vue"
import { ChevronLeft, ChevronRight } from "lucide-vue-next"

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const attemptStore = useAttemptStore()

const current = ref(0)
const submitting = ref(false)
const showConfirm = ref(false)

onMounted(async () => {
  await examStore.fetchExam(route.params.id as string)
  await examStore.fetchQuestions(route.params.id as string)
  if (!attemptStore.currentAttempt) {
    router.replace(`/exams/${route.params.id}`)
  }
})

const questions = computed(() => examStore.currentQuestions)
const currentQ = computed(() => questions.value[current.value])
const answeredCount = computed(() =>
  questions.value.filter((q) => attemptStore.getAnswer(q.id)).length
)
const progress = computed(() =>
  questions.value.length ? (answeredCount.value / questions.value.length) * 100 : 0
)
const currentAnswer = computed({
  get: () => currentQ.value ? attemptStore.getAnswer(currentQ.value.id) : "",
  set: (v) => currentQ.value && attemptStore.setAnswer(currentQ.value.id, v),
})

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    const { attemptId } = await attemptStore.submitAttempt()
    router.push(`/exams/${route.params.id}/result/${attemptId}`)
  } catch {
    submitting.value = false
  }
}
</script>

<template>
  <!-- ExamTakeView: full-screen, có header sticky riêng (offset TopHeader) -->
  <div class="min-h-screen flex flex-col">
    <!-- Exam header sticky - top-16 để nằm dưới TopHeader -->
    <header class="sticky top-16 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
      <div class="container mx-auto max-w-3xl px-4 h-14 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <h1 class="font-semibold text-sm truncate text-slate-800 dark:text-slate-100">{{ examStore.currentExam?.title }}</h1>
          <span class="text-xs text-slate-500 dark:text-slate-400 shrink-0">
            {{ answeredCount }}/{{ questions.length }} đã trả lời
          </span>
        </div>
        <ExamTimer
          v-if="examStore.currentExam?.time_limit_minutes"
          :minutes="examStore.currentExam.time_limit_minutes"
          @time-up="submit"
        />
      </div>
      <UiProgress :value="progress" class="h-1 rounded-none" />
    </header>

    <!-- Dot navigation -->
    <div class="container mx-auto max-w-3xl px-4 py-4">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="(q, i) in questions"
          :key="q.id"
          type="button"
          class="size-7 rounded-full text-xs font-medium transition-all"
          :class="{
            'bg-primary text-white': i === current,
            'bg-emerald-500 text-white': i !== current && attemptStore.getAnswer(q.id),
            'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600': i !== current && !attemptStore.getAnswer(q.id),
          }"
          @click="current = i"
        >
          {{ i + 1 }}
        </button>
      </div>
    </div>

    <!-- Question body -->
    <main class="container mx-auto max-w-3xl flex-1 px-4 pb-10">
      <div v-if="currentQ" class="flex flex-col gap-6">
        <div class="flex items-start gap-3">
          <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
            {{ current + 1 }}
          </div>
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">{{ currentQ.points }} điểm</p>
            <p class="font-medium leading-relaxed text-slate-800 dark:text-slate-100">{{ currentQ.content }}</p>
          </div>
        </div>

        <QuestionDisplay :question="currentQ" v-model="currentAnswer" />

        <div class="flex items-center justify-between mt-4">
          <UiButton variant="outline" :disabled="current === 0" @click="current--">
            <ChevronLeft class="size-4" /> Câu trước
          </UiButton>

          <UiButton v-if="current < questions.length - 1" @click="current++">
            Câu tiếp <ChevronRight class="size-4" />
          </UiButton>

          <UiButton v-else variant="default" class="bg-emerald-600 hover:bg-emerald-700" @click="showConfirm = true">
            Nộp bài
          </UiButton>
        </div>
      </div>
    </main>

    <!-- Confirm modal -->
    <Teleport to="body">
      <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col gap-4">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Nộp bài?</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Bạn đã trả lời {{ answeredCount }}/{{ questions.length }} câu.
            <span v-if="answeredCount < questions.length" class="text-amber-600">
              Còn {{ questions.length - answeredCount }} câu chưa trả lời.
            </span>
          </p>
          <div class="flex gap-3">
            <UiButton variant="outline" class="flex-1" @click="showConfirm = false">Quay lại</UiButton>
            <UiButton class="flex-1" :disabled="submitting" @click="submit">
              {{ submitting ? "Đang nộp…" : "Xác nhận nộp bài" }}
            </UiButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
