<script setup lang="ts">
import { RouterLink } from "vue-router"
import type { IExam } from "@/src/interface/IExam"
import UiCard from "@/src/components/ui/exam/card.vue"
import UiBadge from "@/src/components/ui/exam/badge.vue"
import UiButton from "@/src/components/ui/exam/button.vue"
import { Clock, BookOpen, Target, ChevronRight } from "lucide-vue-next"

defineProps<{ exam: IExam }>()
</script>

<template>
  <UiCard class="group overflow-hidden hover:shadow-md transition-shadow py-0">
    <div class="h-2 bg-gradient-to-r from-primary to-primary/60" />
    <div class="p-5 flex flex-col gap-3">
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-semibold text-base leading-snug line-clamp-2 flex-1">{{ exam.title }}</h3>
        <UiBadge v-if="exam.is_published" variant="success" class="shrink-0">Đang mở</UiBadge>
        <UiBadge v-else variant="secondary" class="shrink-0">Bản nháp</UiBadge>
      </div>

      <p v-if="exam.description" class="text-sm text-muted-foreground line-clamp-2">
        {{ exam.description }}
      </p>

      <div class="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span class="flex items-center gap-1">
          <Clock class="size-3.5 text-primary" />
          {{ exam.time_limit_minutes ? `${exam.time_limit_minutes} phút` : "Không giới hạn" }}
        </span>
        <span class="flex items-center gap-1">
          <BookOpen class="size-3.5 text-primary" />
          {{ exam.question_count ?? 0 }} câu hỏi
        </span>
        <span class="flex items-center gap-1">
          <Target class="size-3.5 text-primary" />
          Đạt: {{ exam.passing_score }}%
        </span>
      </div>

      <RouterLink :to="`/exams/${exam.id}`">
        <UiButton variant="outline" size="sm" class="w-full gap-1.5 mt-1">
          Xem đề thi <ChevronRight class="size-3.5" />
        </UiButton>
      </RouterLink>
    </div>
  </UiCard>
</template>
