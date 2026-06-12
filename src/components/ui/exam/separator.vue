<script setup lang="ts">
import { cn } from "@/lib/utils"
defineProps<{ class?: string }>()
</script>
<template>
  <hr :class="cn('shrink-0 bg-border h-px w-full border-0', $props.class)" v-bind="$attrs" />
</template>
