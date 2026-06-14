<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router"
import { useExamStore } from "@/src/stores/examStore"
import { useAttemptStore } from "@/src/stores/attemptStore"
import ExamTimer from "@/src/components/ExamTimer.vue"
import QuestionDisplay from "@/src/components/QuestionDisplay.vue"
import UiButton from "@/src/components/ui/exam/button.vue"
import UiProgress from "@/src/components/ui/exam/progress.vue"

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const attemptStore = useAttemptStore()

const submitting = ref(false)
const showConfirm = ref(false)

// ── Chặn back / rời trang ──────────────────────────────────────────────────
const showLeaveConfirm = ref(false)
const isSubmitted = ref(false)        // true sau khi nộp bài thành công
const isCancelling = ref(false)       // tránh gọi cancel trùng

let resolveNavigation: ((val: boolean) => void) | null = null

// Chặn route change (back, click link...)
onBeforeRouteLeave(async (_to, _from) => {
  // Cho phép rời nếu đã nộp bài hoặc đang hủy
  if (isSubmitted.value || isCancelling.value) {
    return true
  }
  
  // Hiện modal xác nhận rời
  showLeaveConfirm.value = true
  
  // Trả về Promise để Vue Router đợi người dùng quyết định
  return new Promise<boolean>((resolve) => {
    resolveNavigation = resolve
  })
})

// Chặn đóng tab / refresh
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (!isSubmitted.value) {
    e.preventDefault()
  }
}

async function confirmLeave() {
  isCancelling.value = true
  showLeaveConfirm.value = false
  await attemptStore.cancelAttempt()
  
  if (resolveNavigation) {
    resolveNavigation(true) // cho phép navigation tiếp tục
    resolveNavigation = null
  } else {
    router.replace(`/exams/${route.params.id}`)
  }
}

function cancelLeave() {
  showLeaveConfirm.value = false
  if (resolveNavigation) {
    resolveNavigation(false) // hủy navigation (ngăn chặn rời trang)
    resolveNavigation = null
  }
}

// ── Anti-copy ───────────────────────────────────────────────────────────────
const preventDefaultAction = (e: Event) => {
  e.preventDefault()
}

const handleKeyDown = (e: KeyboardEvent) => {
  // Chặn Ctrl+C, Ctrl+X, Cmd+C, Cmd+X
  if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'x', 'X'].includes(e.key)) {
    e.preventDefault()
  }
}

onMounted(async () => {
  await examStore.fetchExam(route.params.id as string)
  await examStore.fetchQuestions(route.params.id as string)

  // Khôi phục attempt từ localStorage nếu refresh trang
  if (!attemptStore.currentAttempt) {
    attemptStore.loadAttemptFromStorage()
  }

  if (!attemptStore.currentAttempt) {
    router.replace(`/exams/${route.params.id}`)
    return
  }

  // Khôi phục câu trả lời từ localStorage
  attemptStore.loadSavedAnswers()

  // Đăng ký các bộ chặn sự kiện để bảo mật dữ liệu đề thi
  document.addEventListener('copy', preventDefaultAction)
  document.addEventListener('cut', preventDefaultAction)
  document.addEventListener('dragstart', preventDefaultAction)
  document.addEventListener('contextmenu', preventDefaultAction)
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // Dọn dẹp listener khi rời khỏi màn hình thi
  document.removeEventListener('copy', preventDefaultAction)
  document.removeEventListener('cut', preventDefaultAction)
  document.removeEventListener('dragstart', preventDefaultAction)
  document.removeEventListener('contextmenu', preventDefaultAction)
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const questions = computed(() => {
  if (attemptStore.currentAttempt?.questions?.length) {
    return attemptStore.currentAttempt.questions
  }
  return examStore.currentQuestions
})
const answeredCount = computed(() =>
  questions.value.filter((q) => attemptStore.getAnswer(q.id)).length
)
const progress = computed(() =>
  questions.value.length ? (answeredCount.value / questions.value.length) * 100 : 0
)

function getAnswer(questionId: string) {
  return attemptStore.getAnswer(questionId)
}
function setAnswer(questionId: string, value: string) {
  attemptStore.setAnswer(questionId, value)
}

function scrollToQuestion(i: number) {
  const el = document.getElementById(`question-${i}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    const { attemptId } = await attemptStore.submitAttempt()
    isSubmitted.value = true
    router.push(`/exams/${route.params.id}/result/${attemptId}`)
  } catch {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col select-none">
    <!-- Exam header sticky -->
    <header class="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
      <div class="container mx-auto max-w-3xl px-4 h-14 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <h1 class="font-semibold text-sm truncate text-slate-800 dark:text-slate-100">{{ examStore.currentExam?.title }}</h1>
          <span class="text-xs text-slate-500 dark:text-slate-400 shrink-0">
            {{ answeredCount }}/{{ questions.length }} đã trả lời
          </span>
        </div>
        <ExamTimer
          v-if="examStore.currentExam?.time_limit_minutes && attemptStore.currentAttempt?.started_at"
          :minutes="examStore.currentExam.time_limit_minutes"
          :started-at="attemptStore.currentAttempt.started_at"
          @time-up="submit"
        />
      </div>
      <UiProgress :value="progress" class="h-1 rounded-none" />
    </header>

    <!-- Dot navigation — quick jump -->
    <div class="sticky top-[60px] z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800">
      <div class="container mx-auto max-w-3xl px-4 py-3">
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(q, i) in questions"
            :key="q.id"
            type="button"
            class="size-7 rounded-full text-xs font-medium transition-all"
            :class="{
              'bg-emerald-500 text-white': attemptStore.getAnswer(q.id),
              'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600': !attemptStore.getAnswer(q.id),
            }"
            @click="scrollToQuestion(i)"
          >
            {{ i + 1 }}
          </button>
        </div>
      </div>
    </div>

    <!-- All questions -->
    <main class="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div class="flex flex-col gap-8">
        <div
          v-for="(q, i) in questions"
          :key="q.id"
          :id="`question-${i}`"
          class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all scroll-mt-28"
        >
          <!-- Question header -->
          <div class="flex items-start gap-3 mb-4">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              :class="attemptStore.getAnswer(q.id)
                ? 'bg-emerald-500 text-white'
                : 'bg-primary text-white'"
            >
              {{ i + 1 }}
            </div>
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">{{ q.points }} điểm</p>
              <p class="font-medium leading-relaxed text-slate-800 dark:text-slate-100">{{ q.content }}</p>
            </div>
          </div>

          <!-- Answer options -->
          <QuestionDisplay
            :question="q"
            :model-value="getAnswer(q.id) ?? ''"
            @update:model-value="(v: string) => setAnswer(q.id, v)"
          />
        </div>
      </div>

      <!-- Submit button fixed bottom -->
      <div class="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur py-3 px-4">
        <div class="container mx-auto max-w-3xl flex items-center justify-between">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {{ answeredCount }}/{{ questions.length }} câu đã trả lời
          </span>
          <UiButton variant="default" class="bg-emerald-600 hover:bg-emerald-700" @click="showConfirm = true">
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

    <!-- Leave confirm modal -->
    <Teleport to="body">
      <div v-if="showLeaveConfirm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-sm rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col gap-4">
          <h2 class="text-lg font-semibold text-rose-600 dark:text-rose-400">Cảnh báo thoát</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Bạn đang trong thời gian làm bài. Nếu thoát lúc này, kết quả sẽ không được ghi nhận và lượt thi này sẽ bị hủy.
            <br/><br/>
            Bạn có chắc chắn muốn thoát không?
          </p>
          <div class="flex gap-3 mt-2">
            <UiButton variant="outline" class="flex-1 border-slate-300 dark:border-slate-700" @click="cancelLeave">Ở lại</UiButton>
            <UiButton class="flex-1 bg-rose-600 hover:bg-rose-700 text-white" :disabled="isCancelling" @click="confirmLeave">
              {{ isCancelling ? "Đang xử lý..." : "Thoát" }}
            </UiButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
