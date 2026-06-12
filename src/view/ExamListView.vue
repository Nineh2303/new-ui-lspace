<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useExamStore } from '@/src/stores/examStore'
import ExamCard from '@/src/components/ExamCard.vue'
import UiInput from '@/src/components/ui/exam/input.vue'
import { Search } from 'lucide-vue-next'

const examStore = useExamStore()
const search = ref('')

onMounted(() => examStore.fetchExams())

const filtered = computed(() => {
  if (!search.value.trim()) return examStore.exams
  const q = search.value.toLowerCase()
  return examStore.exams.filter((e) =>
    e.title.toLowerCase().includes(q) || (e.description ?? '').toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Danh sách bài thi</h1>
        <p class="text-muted-foreground">Duyệt và làm các bài thi tiếng Anh.</p>
      </div>

      <div class="relative mb-6 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <UiInput v-model="search" placeholder="Tìm kiếm bài thi..." class="pl-9" />
      </div>

      <div v-if="examStore.loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="h-48 rounded-xl border bg-muted animate-pulse" />
      </div>

      <div v-else-if="filtered.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ExamCard v-for="exam in filtered" :key="exam.id" :exam="exam" />
      </div>

      <div v-else class="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
        <p class="font-medium">Không tìm thấy bài thi.</p>
        <p class="text-sm mt-1">Hãy thử từ khóa khác.</p>
      </div>
  </div>
</template>
