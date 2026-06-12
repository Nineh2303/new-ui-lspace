<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useExamStore } from '@/src/stores/examStore'
import UiButton from '@/src/components/ui/exam/button.vue'
import UiBadge from '@/src/components/ui/exam/badge.vue'
import { Plus, Edit, BookOpen, Trash2 } from 'lucide-vue-next'

const examStore = useExamStore()

onMounted(() => examStore.fetchAllExams())

async function togglePublish(id: string, current: boolean) {
  await examStore.updateExam(id, { is_published: !current })
  await examStore.fetchAllExams()
}

async function deleteExam(id: string) {
  if (!confirm('Xóa bài thi này và tất cả câu hỏi?')) return
  await examStore.deleteExam(id)
}
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-10">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Quản trị</h1>
          <p class="text-sm text-muted-foreground">Quản lý bài thi và câu hỏi.</p>
        </div>
        <RouterLink to="/admin/exams/new">
          <UiButton class="gap-2">
            <Plus class="size-4" /> Tạo bài thi
          </UiButton>
        </RouterLink>
      </div>

      <div v-if="examStore.loading" class="flex flex-col gap-3">
        <div v-for="i in 4" :key="i" class="h-16 rounded-lg border bg-muted animate-pulse" />
      </div>

      <div v-else-if="examStore.exams.length" class="flex flex-col gap-2">
        <div
          v-for="exam in examStore.exams"
          :key="exam.id"
          class="flex items-center gap-4 rounded-lg border p-4 bg-card"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-medium text-sm truncate">{{ exam.title }}</p>
              <UiBadge :variant="exam.is_published ? 'success' : 'secondary'" class="text-xs">
                {{ exam.is_published ? 'Đã đăng' : 'Nháp' }}
              </UiBadge>
            </div>
            <p class="text-xs text-muted-foreground mt-0.5">
              {{ exam.question_count ?? 0 }} câu · Đạt: {{ exam.passing_score }}%
              <span v-if="exam.time_limit_minutes"> · {{ exam.time_limit_minutes }} phút</span>
            </p>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <UiButton variant="outline" size="icon-sm" @click="togglePublish(exam.id, exam.is_published)" :title="exam.is_published ? 'Hủy đăng' : 'Đăng'">
              <span class="text-xs">{{ exam.is_published ? '↓' : '↑' }}</span>
            </UiButton>
            <RouterLink :to="`/admin/exams/${exam.id}/questions`">
              <UiButton variant="outline" size="icon-sm" title="Quản lý câu hỏi">
                <BookOpen class="size-3.5" />
              </UiButton>
            </RouterLink>
            <RouterLink :to="`/admin/exams/${exam.id}/edit`">
              <UiButton variant="outline" size="icon-sm">
                <Edit class="size-3.5" />
              </UiButton>
            </RouterLink>
            <UiButton variant="outline" size="icon-sm" class="text-destructive hover:text-destructive" @click="deleteExam(exam.id)">
              <Trash2 class="size-3.5" />
            </UiButton>
          </div>
        </div>
      </div>

      <div v-else class="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        <p class="font-medium">Chưa có bài thi nào.</p>
        <RouterLink to="/admin/exams/new">
          <UiButton variant="outline" class="mt-4 gap-2">
            <Plus class="size-4" /> Tạo bài thi đầu tiên
          </UiButton>
        </RouterLink>
      </div>
  </div>
</template>
