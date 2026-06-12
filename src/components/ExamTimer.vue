<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { Clock } from "lucide-vue-next"

const props = defineProps<{ minutes: number }>()
const emit = defineEmits<{ "time-up": [] }>()

const remaining = ref(props.minutes * 60)
let interval: ReturnType<typeof setInterval>

const formatted = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
})

const isWarning = computed(() => remaining.value <= 300 && remaining.value > 60)
const isDanger = computed(() => remaining.value <= 60)

onMounted(() => {
  interval = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
    } else {
      clearInterval(interval)
      emit("time-up")
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div
    class="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-mono font-semibold transition-colors"
    :class="{
      'border-red-300 bg-red-50 text-red-600': isDanger,
      'border-amber-300 bg-amber-50 text-amber-700': isWarning,
      'border-slate-200 bg-slate-50 text-slate-600': !isDanger && !isWarning,
    }"
  >
    <Clock class="size-3.5" />
    {{ formatted }}
  </div>
</template>
