import { defineStore } from 'pinia'
import { ref } from 'vue'
import { examApi } from '@/src/apis'
import type { IExam, IQuestion } from '@/src/interface/IExam'
import type { ICreateExamRequest, IUpdateExamRequest } from '@/src/stores/models/exam/request/IExamRequest.ts'
import type { ICreateQuestionRequest, IUpdateQuestionRequest } from '@/src/stores/models/exam/request/IQuestionRequest.ts'

export const useExamStore = defineStore('exam', () => {
  const exams = ref<IExam[]>([])
  const currentExam = ref<IExam | null>(null)
  const currentQuestions = ref<IQuestion[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Exam ────────────────────────────────────────────────────────────────────

  /** Lấy danh sách bài thi đã published — dùng cho trang /exams */
  async function fetchExams() {
    loading.value = true
    error.value = null
    try {
      const res = await examApi.getExams()
      exams.value = res.data ?? []
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể tải danh sách bài thi.'
    } finally {
      loading.value = false
    }
  }

  /** Lấy tất cả bài thi (bao gồm nháp) — dùng cho admin */
  async function fetchAllExams() {
    loading.value = true
    error.value = null
    try {
      const res = await examApi.getAllExams()
      exams.value = res.data ?? []
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể tải danh sách bài thi.'
    } finally {
      loading.value = false
    }
  }

  /** Lấy chi tiết 1 bài thi theo id */
  async function fetchExam(id: string) {
    error.value = null
    try {
      currentExam.value = await examApi.getExamById(id)
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể tải bài thi.'
    }
  }

  /** Lấy danh sách câu hỏi của bài thi */
  async function fetchQuestions(examId: string) {
    error.value = null
    try {
      const res = await examApi.getExamQuestions(examId)
      currentQuestions.value = res.data ?? []
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể tải câu hỏi.'
    }
  }

  /** Tạo bài thi mới */
  async function createExam(payload: ICreateExamRequest): Promise<IExam> {
    try {
      const exam = await examApi.createExam(payload)
      return exam
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? 'Tạo bài thi thất bại.')
    }
  }

  /** Cập nhật bài thi */
  async function updateExam(id: string, payload: Omit<IUpdateExamRequest, 'id'>): Promise<void> {
    try {
      const updated = await examApi.updateExam(id, payload)
      // Cập nhật local state nếu đang xem bài thi đó
      if (currentExam.value?.id === id) currentExam.value = updated
      const idx = exams.value.findIndex(e => e.id === id)
      if (idx !== -1) exams.value[idx] = updated
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? 'Cập nhật bài thi thất bại.')
    }
  }

  /** Xóa bài thi */
  async function deleteExam(id: string): Promise<void> {
    try {
      await examApi.deleteExam(id)
      exams.value = exams.value.filter(e => e.id !== id)
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? 'Xóa bài thi thất bại.')
    }
  }

  // ── Questions ───────────────────────────────────────────────────────────────

  /** Thêm câu hỏi vào bài thi */
  async function createQuestion(examId: string, payload: ICreateQuestionRequest): Promise<void> {
    try {
      const question = await examApi.createQuestion(examId, payload)
      currentQuestions.value.push(question)
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? 'Thêm câu hỏi thất bại.')
    }
  }

  /** Cập nhật câu hỏi */
  async function updateQuestion(examId: string, questionId: string, payload: IUpdateQuestionRequest): Promise<void> {
    try {
      const updated = await examApi.updateQuestion(examId, questionId, payload)
      const idx = currentQuestions.value.findIndex(q => q.id === questionId)
      if (idx !== -1) currentQuestions.value[idx] = updated
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? 'Cập nhật câu hỏi thất bại.')
    }
  }

  /** Xóa câu hỏi */
  async function deleteQuestion(examId: string, questionId: string): Promise<void> {
    try {
      await examApi.deleteQuestion(examId, questionId)
      currentQuestions.value = currentQuestions.value.filter(q => q.id !== questionId)
    } catch (e: any) {
      throw new Error(e?.response?.data?.message ?? 'Xóa câu hỏi thất bại.')
    }
  }

  return {
    // state
    exams,
    currentExam,
    currentQuestions,
    loading,
    error,
    // exam actions
    fetchExams,
    fetchAllExams,
    fetchExam,
    fetchQuestions,
    createExam,
    updateExam,
    deleteExam,
    // question actions
    createQuestion,
    updateQuestion,
    deleteQuestion,
  }
})
