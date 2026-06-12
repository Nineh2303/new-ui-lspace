<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExamStore } from '@/src/stores/examStore'
import UiCard from '@/src/components/ui/exam/card.vue'
import UiCardHeader from '@/src/components/ui/exam/card-header.vue'
import UiCardTitle from '@/src/components/ui/exam/card-title.vue'
import UiCardDescription from '@/src/components/ui/exam/card-description.vue'
import UiCardContent from '@/src/components/ui/exam/card-content.vue'
import UiCardFooter from '@/src/components/ui/exam/card-footer.vue'
import UiButton from '@/src/components/ui/exam/button.vue'
import UiInput from '@/src/components/ui/exam/input.vue'
import UiTextarea from '@/src/components/ui/exam/textarea.vue'
import UiLabel from '@/src/components/ui/exam/label.vue'
import { ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const examStore = useExamStore()

const form = ref({
  title: '',
  description: '',
  time_limit_minutes: '' as string | number,
  passing_score: 60,
  is_published: false,
})
const saving = ref(false)
const errors = ref<Record<string, string>>({})

async function save() {
  errors.value = {}
  if (!form.value.title.trim()) { errors.value.title = 'Tiêu đề là bắt buộc.'; return }
  saving.value = true
  try {
    const exam = await examStore.createExam({
      title: form.value.title.trim(),
      description: form.value.description.trim() || null,
      time_limit_minutes: form.value.time_limit_minutes ? Number(form.value.time_limit_minutes) : null,
      passing_score: Number(form.value.passing_score),
      is_published: form.value.is_published,
    })
    router.push(`/admin/exams/${exam.id}/questions`)
  } catch {
    errors.value.general = 'Tạo bài thi thất bại.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="container mx-auto max-w-2xl px-4 py-10">
      <div class="mb-6 flex items-center gap-3">
        <UiButton variant="ghost" size="icon" @click="router.back()"><ArrowLeft class="size-4" /></UiButton>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Tạo bài thi mới</h1>
          <p class="text-sm text-muted-foreground">Điền thông tin bài thi bên dưới</p>
        </div>
      </div>

      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Thông tin bài thi</UiCardTitle>
          <UiCardDescription>Cấu hình các thiết lập bài thi</UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="flex flex-col gap-5 pt-0">
          <div class="flex flex-col gap-1.5">
            <UiLabel for="title">Tiêu đề <span class="text-destructive">*</span></UiLabel>
            <UiInput id="title" v-model="form.title" placeholder="VD: IELTS Grammar Practice" />
            <p v-if="errors.title" class="text-xs text-destructive">{{ errors.title }}</p>
          </div>
          <div class="flex flex-col gap-1.5">
            <UiLabel for="desc">Mô tả</UiLabel>
            <UiTextarea id="desc" v-model="form.description" :rows="3" placeholder="Học sinh sẽ được kiểm tra về nội dung gì?" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <UiLabel for="time">Thời gian (phút)</UiLabel>
              <UiInput id="time" v-model="form.time_limit_minutes" type="number" placeholder="Để trống = không giới hạn" min="1" />
            </div>
            <div class="flex flex-col gap-1.5">
              <UiLabel for="pass">Điểm đạt (%)</UiLabel>
              <UiInput id="pass" v-model="form.passing_score" type="number" min="0" max="100" />
            </div>
          </div>
          <label class="flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 hover:bg-muted/50 transition-colors">
            <div
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors"
              :class="form.is_published ? 'bg-primary' : 'bg-input'"
              @click="form.is_published = !form.is_published"
            >
              <span class="block size-4 rounded-full bg-background shadow transition-transform" :class="form.is_published ? 'translate-x-4' : 'translate-x-0'" />
            </div>
            <div>
              <p class="text-sm font-medium">Đăng ngay</p>
              <p class="text-xs text-muted-foreground">Học sinh có thể thấy và làm bài thi này</p>
            </div>
          </label>
          <p v-if="errors.general" class="text-sm text-destructive">{{ errors.general }}</p>
        </UiCardContent>
        <UiCardFooter class="gap-3 border-t pt-4">
          <UiButton variant="outline" class="flex-1" @click="router.back()">Hủy</UiButton>
          <UiButton class="flex-1" :disabled="saving" @click="save">
            {{ saving ? 'Đang tạo…' : 'Tạo & Thêm câu hỏi' }}
          </UiButton>
        </UiCardFooter>
      </UiCard>
    </div>
</template>
