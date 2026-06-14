<script setup lang="ts">
import { cn } from "@/lib/utils"
defineProps<{ class?: string }>()
</script>
<template>
  <div :class="cn('flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-6 text-slate-800 dark:text-slate-100 shadow-sm', $props.class)" v-bind="$attrs">
    <slot />
  </div>
</template>
