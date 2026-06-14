<script setup lang="ts">
import { Newspaper } from 'lucide-vue-next'
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Bài viết</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Đọc các bài viết và tài liệu học tập.</p>
    </div>

    <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-16 text-center">
      <Newspaper class="size-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
      <p class="font-medium text-slate-500 dark:text-slate-400">Tính năng đang được phát triển.</p>
      <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Các bài viết sẽ sớm được cập nhật.</p>
    </div>
  </div>
</template>
