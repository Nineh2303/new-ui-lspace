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
  <UiCard class="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 py-0 flex flex-col h-full border border-slate-200 dark:border-slate-800">
    <div class="h-2.5 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
    <div class="p-6 flex flex-col gap-4 flex-1">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-bold text-lg leading-tight line-clamp-2 flex-1 group-hover:text-primary transition-colors">{{ exam.title }}</h3>
        <UiBadge v-if="exam.is_published" variant="success" class="shrink-0 px-2.5 py-0.5 shadow-sm">Đang mở</UiBadge>
        <UiBadge v-else variant="secondary" class="shrink-0 px-2.5 py-0.5">Bản nháp</UiBadge>
      </div>

      <p v-if="exam.description" class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
        {{ exam.description }}
      </p>

      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground mt-auto pt-2">
        <span class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          <Clock class="size-4 text-primary" />
          {{ exam.time_limit_minutes ? `${exam.time_limit_minutes} phút` : "Không giới hạn" }}
        </span>
        <span class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          <BookOpen class="size-4 text-primary" />
          {{ exam.display_question_count ?? 0 }} câu hỏi
        </span>
        <span class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          <Target class="size-4 text-primary" />
          Đạt: {{ exam.passing_score }} điểm
        </span>
      </div>

      <RouterLink :to="`/exams/${exam.id}`" class="mt-4 block">
        <UiButton variant="default" class="w-full gap-2 py-5 text-sm font-semibold shadow-md group-hover:shadow-lg transition-all">
          Bắt đầu thi <ChevronRight class="size-4 transition-transform group-hover:translate-x-1" />
        </UiButton>
      </RouterLink>
    </div>
  </UiCard>
</template>
