<script setup lang="ts">
import { cn } from "@/lib/utils"
defineProps<{ class?: string }>()
</script>
<template>
  <div :class="cn('flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white py-6 text-slate-800 shadow-sm', $props.class)" v-bind="$attrs">
    <slot />
  </div>
</template>
