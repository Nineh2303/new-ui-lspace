<script setup lang="ts">
import { computed } from "vue"
import { cn } from "@/lib/utils"
const props = defineProps<{ value?: number; class?: string }>()
const pct = computed(() => Math.min(100, Math.max(0, props.value ?? 0)))
</script>
<template>
  <div :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', $props.class)">
    <div class="h-full bg-primary transition-all" :style="{ width: pct + '%' }" />
  </div>
</template>
