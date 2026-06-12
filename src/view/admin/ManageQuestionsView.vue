<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/src/stores/examStore'
import type { QuestionOption } from '@/src/interface/IExam'
import UiCard from '@/src/components/ui/exam/card.vue'
import UiCardHeader from '@/src/components/ui/exam/card-header.vue'
import UiCardTitle from '@/src/components/ui/exam/card-title.vue'
import UiCardContent from '@/src/components/ui/exam/card-content.vue'
import UiButton from '@/src/components/ui/exam/button.vue'
import UiInput from '@/src/components/ui/exam/input.vue'
import UiTextarea from '@/src/components/ui/exam/textarea.vue'
import UiLabel from '@/src/components/ui/exam/label.vue'
import UiBadge from '@/src/components/ui/exam/badge.vue'
import UiSeparator from '@/src/components/ui/exam/separator.vue'
import { ArrowLeft, Plus, Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

type QType = 'multiple_choice' | 'true_false' | 'short_answer'

interface QuestionForm {
  content: string
  question_type: QType
  options: QuestionOption[]
  correct_answer: string
  explanation: string
  points: number
}

const newQuestion = ref<QuestionForm>({
  content: '',
  question_type: 'multiple_choice',
  options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
  correct_answer: '',
  explanation: '',
  points: 1,
})
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  await examStore.fetchExam(route.params.id as string)
  await examStore.fetchQuestions(route.params.id as string)
})

function resetForm() {
  newQuestion.value = {
    content: '',
    question_type: 'multiple_choice',
    options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
    correct_answer: '',
    explanation: '',
    points: 1,
  }
}

async function saveQuestion() {
  if (!newQuestion.value.content.trim()) { error.value = 'Nội dung câu hỏi là bắt buộc.'; return }
  error.value = ''
  saving.value = true
  try {
    await examStore.createQuestion({
      exam_id: route.params.id as string,
      content: newQuestion.value.content.trim(),
      question_type: newQuestion.value.question_type,
      options: newQuestion.value.question_type === 'multiple_choice' ? newQuestion.value.options.filter(o => o.text.trim()) : null,
      correct_answer: newQuestion.value.correct_answer.trim() || null,
      explanation: newQuestion.value.explanation.trim() || null,
      points: newQuestion.value.points,
      order_index: examStore.currentQuestions.length,
    })
    await examStore.fetchQuestions(route.params.id as string)
    resetForm()
  } catch {
    error.value = 'Lưu câu hỏi thất bại.'
  } finally {
    saving.value = false
  }
}

async function deleteQ(id: string) {
  if (!confirm('Xóa câu hỏi này?')) return
  await examStore.deleteQuestion(id)
}

function typeLabel(t: string) {
  return { multiple_choice: 'Trắc nghiệm', true_false: 'Đúng / Sai', short_answer: 'Tự luận' }[t] ?? t
}
</script>

<template>
  <div class="container mx-auto max-w-3xl px-4 py-10">
      <div class="mb-6 flex items-center gap-3">
        <UiButton variant="ghost" size="icon" @click="router.back()"><ArrowLeft class="size-4" /></UiButton>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Quản lý câu hỏi</h1>
          <p class="text-sm text-muted-foreground">{{ examStore.currentExam?.title }}</p>
        </div>
      </div>

      <!-- Danh sách câu hỏi hiện có -->
      <div v-if="examStore.currentQuestions.length" class="mb-6 flex flex-col gap-2">
        <div class="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{{ examStore.currentQuestions.length }} câu hỏi</span>
          <span>Tổng: {{ examStore.currentQuestions.reduce((s, q) => s + q.points, 0) }} điểm</span>
        </div>

        <UiCard
          v-for="(q, i) in examStore.currentQuestions"
          :key="q.id"
          class="py-0 overflow-hidden"
        >
          <div class="flex items-start gap-3 p-4">
            <div class="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {{ i + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium leading-snug">{{ q.content }}</p>
              <div class="mt-1.5 flex flex-wrap gap-2">
                <UiBadge variant="secondary" class="text-xs">{{ typeLabel(q.question_type) }}</UiBadge>
                <UiBadge variant="outline" class="text-xs">{{ q.points }} điểm</UiBadge>
                <span v-if="q.correct_answer" class="text-xs text-muted-foreground">Đáp án: <strong>{{ q.correct_answer }}</strong></span>
              </div>
            </div>
            <UiButton variant="ghost" size="icon-sm" class="text-destructive hover:text-destructive shrink-0" @click="deleteQ(q.id)">
              <Trash2 class="size-3.5" />
            </UiButton>
          </div>
        </UiCard>
      </div>

      <UiSeparator class="mb-6" />

      <!-- Form thêm câu hỏi mới -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle class="text-base">Thêm câu hỏi mới</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="flex flex-col gap-4 pt-0">
          <!-- Loại câu hỏi -->
          <div class="flex flex-col gap-1.5">
            <UiLabel>Loại câu hỏi</UiLabel>
            <div class="flex gap-2 flex-wrap">
              <UiButton
                v-for="t in [{ v: 'multiple_choice', l: 'Trắc nghiệm' }, { v: 'true_false', l: 'Đúng / Sai' }, { v: 'short_answer', l: 'Tự luận' }]"
                :key="t.v"
                :variant="newQuestion.question_type === t.v ? 'default' : 'outline'"
                size="sm"
                @click="newQuestion.question_type = t.v as QType"
              >
                {{ t.l }}
              </UiButton>
            </div>
          </div>

          <!-- Nội dung -->
          <div class="flex flex-col gap-1.5">
            <UiLabel for="qcontent">Nội dung câu hỏi <span class="text-destructive">*</span></UiLabel>
            <UiTextarea id="qcontent" v-model="newQuestion.content" placeholder="Nhập nội dung câu hỏi..." :rows="2" />
          </div>

          <!-- Trắc nghiệm -->
          <div v-if="newQuestion.question_type === 'multiple_choice'" class="flex flex-col gap-3">
            <UiLabel>Các đáp án</UiLabel>
            <div v-for="opt in newQuestion.options" :key="opt.id" class="flex items-center gap-2">
              <div
                class="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold cursor-pointer transition-colors"
                :class="newQuestion.correct_answer === opt.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'"
                @click="newQuestion.correct_answer = opt.id"
              >
                {{ opt.id }}
              </div>
              <UiInput v-model="opt.text" :placeholder="`Đáp án ${opt.id}`" class="flex-1" />
            </div>
            <p class="text-xs text-muted-foreground">Nhấp vào chữ cái để đánh dấu đáp án đúng. Đã chọn: <strong>{{ newQuestion.correct_answer || 'Chưa chọn' }}</strong></p>
          </div>

          <!-- Đúng / Sai -->
          <div v-else-if="newQuestion.question_type === 'true_false'" class="flex flex-col gap-1.5">
            <UiLabel>Đáp án đúng</UiLabel>
            <div class="flex gap-3">
              <UiButton
                v-for="v in ['true', 'false']"
                :key="v"
                :variant="newQuestion.correct_answer === v ? 'default' : 'outline'"
                size="sm"
                @click="newQuestion.correct_answer = v"
              >
                {{ v === 'true' ? 'Đúng' : 'Sai' }}
              </UiButton>
            </div>
          </div>

          <!-- Tự luận -->
          <div v-else class="flex flex-col gap-1.5">
            <UiLabel for="correct">Đáp án đúng</UiLabel>
            <UiInput id="correct" v-model="newQuestion.correct_answer" placeholder="Đáp án kỳ vọng" />
          </div>

          <!-- Giải thích & điểm -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <UiLabel for="explain">Giải thích <span class="text-muted-foreground text-xs">(tùy chọn)</span></UiLabel>
              <UiTextarea id="explain" v-model="newQuestion.explanation" placeholder="Tại sao đây là đáp án đúng?" :rows="2" />
            </div>
            <div class="flex flex-col gap-1.5">
              <UiLabel for="pts">Điểm</UiLabel>
              <UiInput id="pts" v-model="newQuestion.points" type="number" min="1" />
            </div>
          </div>

          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

          <UiButton class="gap-2 w-full" :disabled="saving" @click="saveQuestion">
            <Plus class="size-4" />
            {{ saving ? 'Đang thêm…' : 'Thêm câu hỏi' }}
          </UiButton>
        </UiCardContent>
      </UiCard>

      <div class="mt-4 flex justify-end">
        <UiButton variant="outline" @click="router.push('/admin')">Hoàn thành</UiButton>
      </div>
    </div>
</template>
