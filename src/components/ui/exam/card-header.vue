<script setup lang="ts">
import { cn } from "@/lib/utils"
defineProps<{ class?: string }>()
</script>
<template>
  <div :class="cn('grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 [.border-b]:pb-6', $props.class)">
    <slot />
  </div>
</template>
