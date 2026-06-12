<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAttemptStore } from "@/src/stores/attemptStore"
import type { IAttemptResult } from "@/src/interface/IExam"
import UiCard from "@/src/components/ui/exam/card.vue"
import UiCardContent from "@/src/components/ui/exam/card-content.vue"
import UiBadge from "@/src/components/ui/exam/badge.vue"
import UiButton from "@/src/components/ui/exam/button.vue"
import { CheckCircle, XCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-vue-next"

const route = useRoute()
const router = useRouter()
const attemptStore = useAttemptStore()

const result = ref<IAttemptResult | null>(null)
const expanded = ref<Set<string>>(new Set())

onMounted(async () => {
  result.value = await attemptStore.fetchResult(route.params.attemptId as string)
})

const pct = computed(() => result.value?.attempt.score ?? 0)
const passed = computed(() => result.value?.attempt.passed ?? false)

function toggle(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

function typeLabel(t: string) {
  return { multiple_choice: "Trắc nghiệm", true_false: "Đúng / Sai", short_answer: "Tự luận" }[t] ?? t
}
</script>

<template>
  <div class="container mx-auto max-w-2xl px-4 py-10">
      <div v-if="result">
        <!-- Score hero -->
        <div class="mb-8 rounded-2xl border p-8 text-center" :class="passed ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'">
          <div class="text-6xl font-extrabold mb-2" :class="passed ? 'text-emerald-600' : 'text-red-500'">
            {{ pct }}%
          </div>
          <UiBadge :variant="passed ? 'success' : 'destructive'" class="mb-3 text-sm px-3 py-1">
            {{ passed ? "🎉 Đạt yêu cầu!" : "Chưa đạt" }}
          </UiBadge>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ result.earned_points }}/{{ result.total_points }} điểm &nbsp;•&nbsp;
            {{ result.answers.filter(a => a.is_correct).length }} đúng,
            {{ result.answers.filter(a => !a.is_correct).length }} sai
          </p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Thí sinh: <strong class="text-slate-700 dark:text-slate-200">{{ result.attempt.student_name }}</strong>
          </p>
        </div>

        <!-- Answer review -->
        <h2 class="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Xem lại đáp án</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="(item, i) in result.answers"
            :key="item.id"
            class="rounded-xl border overflow-hidden"
            :class="item.is_correct ? 'border-emerald-200' : 'border-red-200'"
          >
            <button
              type="button"
              class="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50"
              @click="toggle(item.id)"
            >
              <CheckCircle v-if="item.is_correct" class="size-5 shrink-0 text-emerald-500 mt-0.5" />
              <XCircle v-else class="size-5 shrink-0 text-red-500 mt-0.5" />
              <div class="flex-1 min-w-0">
                <p class="text-xs text-slate-500 mb-1">Câu {{ i + 1 }} · {{ typeLabel(item.question.question_type) }} · {{ item.question.points }} điểm</p>
                <p class="text-sm font-medium leading-snug text-slate-800">{{ item.question.content }}</p>
              </div>
              <ChevronUp v-if="expanded.has(item.id)" class="size-4 shrink-0 text-slate-400 mt-0.5" />
              <ChevronDown v-else class="size-4 shrink-0 text-slate-400 mt-0.5" />
            </button>

            <div v-if="expanded.has(item.id)" class="border-t px-4 py-3 bg-slate-50 flex flex-col gap-2 text-sm">
              <p><span class="font-medium text-slate-700">Câu trả lời của bạn:</span>
                <span class="ml-1" :class="item.is_correct ? 'text-emerald-600' : 'text-red-500'">
                  {{ item.answer || "(Chưa trả lời)" }}
                </span>
              </p>
              <p v-if="item.question.correct_answer && !item.is_correct">
                <span class="font-medium text-slate-700">Đáp án đúng:</span>
                <span class="ml-1 text-emerald-600">{{ item.question.correct_answer }}</span>
              </p>
              <p v-if="item.question.explanation" class="text-slate-500 italic">
                {{ item.question.explanation }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 flex gap-3 justify-center">
          <UiButton variant="outline" @click="router.push('/exams')">
            <BookOpen class="size-4" /> Làm đề khác
          </UiButton>
          <UiButton @click="router.push('/')">Về trang chủ</UiButton>
        </div>
      </div>

      <div v-else class="flex justify-center py-20">
        <div class="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent" />
      </div>
  </div>
</template>
