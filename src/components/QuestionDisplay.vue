<script setup lang="ts">
import type { IQuestion } from "@/src/interface/IExam"
import UiInput from "@/src/components/ui/exam/input.vue"
import UiButton from "@/src/components/ui/exam/button.vue"

const props = defineProps<{ question: IQuestion; modelValue: string }>()
const emit = defineEmits<{ "update:modelValue": [value: string] }>()

function select(val: string) {
  emit("update:modelValue", val)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Trắc nghiệm -->
    <div v-if="question.question_type === 'multiple_choice'" class="flex flex-col gap-2">
      <button
        v-for="opt in question.options ?? []"
        :key="opt.id"
        type="button"
        class="flex items-center gap-3 rounded-lg border p-3.5 text-left transition-all hover:bg-primary/5"
        :class="modelValue === opt.id
          ? 'border-primary bg-primary/5'
          : 'border-slate-200'"
        @click="select(opt.id)"
      >
        <div
          class="flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
          :class="modelValue === opt.id
            ? 'border-primary bg-primary text-white'
            : 'border-slate-300 text-slate-500'"
        >
          {{ opt.id }}
        </div>
        <span class="text-sm text-slate-700">{{ opt.text }}</span>
      </button>
    </div>

    <!-- Đúng / Sai -->
    <div v-else-if="question.question_type === 'true_false'" class="flex gap-3">
      <UiButton
        v-for="v in ['true', 'false']"
        :key="v"
        :variant="modelValue === v ? 'default' : 'outline'"
        class="flex-1"
        @click="select(v)"
      >
        {{ v === 'true' ? '✓ Đúng' : '✗ Sai' }}
      </UiButton>
    </div>

    <!-- Tự luận ngắn -->
    <div v-else>
      <UiInput
        :model-value="modelValue"
        placeholder="Nhập câu trả lời của bạn..."
        @input="(e: Event) => select((e.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
