import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/src/services/api.ts'
import type { IExamAttempt, IAttemptResult, IQuestion } from '@/src/interface/IExam'
import type { IStartAttemptRequest, ISubmitAttemptRequest } from '@/src/stores/models/exam/request/IAttemptRequest.ts'

export const useAttemptStore = defineStore('attempt', () => {
  const currentAttempt = ref<IExamAttempt | null>(null)
  /** Map questionId → answer (lưu tạm phía client trong khi làm bài) */
  const answers = ref<Record<string, string>>({})
  const error = ref<string | null>(null)

  // ── In-memory answer management (client-side only) ──────────────────────────

  function setAnswer(questionId: string, answer: string) {
    answers.value[questionId] = answer
  }

  function getAnswer(questionId: string): string {
    return answers.value[questionId] ?? ''
  }

  function resetAnswers() {
    answers.value = {}
  }

  // ── API actions ─────────────────────────────────────────────────────────────

  /**
   * Bắt đầu làm bài thi.
   * POST /api/exams/:examId/attempts
   */
  async function startAttempt(
    examId: string,
    studentName: string,
    studentEmail: string,
  ): Promise<IExamAttempt> {
    error.value = null
    const request: IStartAttemptRequest = {
      exam_id: examId,
      student_name: studentName,
      student_email: studentEmail,
    }
    try {
      const attempt = await api.startAttempt(request)
      currentAttempt.value = attempt
      resetAnswers()
      return attempt
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể bắt đầu bài thi.'
      throw e
    }
  }

  /**
   * Nộp bài thi — gửi toàn bộ answers lên server để chấm điểm.
   * POST /api/attempts/:attemptId/submit
   * Server trả về { attempt_id, score, passed }
   */
  async function submitAttempt(): Promise<{ attemptId: string }> {
    if (!currentAttempt.value) throw new Error('Chưa có lần thi nào đang diễn ra.')
    error.value = null

    const request: ISubmitAttemptRequest = {
      attempt_id: currentAttempt.value.id,
      answers: Object.entries(answers.value).map(([question_id, answer]) => ({
        question_id,
        answer: answer || null,
      })),
    }

    try {
      const result = await api.submitAttempt(currentAttempt.value.id, request)
      return { attemptId: result.attempt_id }
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Nộp bài thất bại.'
      throw e
    }
  }

  /**
   * Xem kết quả chi tiết sau khi nộp bài.
   * GET /api/attempts/:attemptId/result
   */
  async function fetchResult(attemptId: string): Promise<IAttemptResult> {
    error.value = null
    try {
      return await api.getAttemptResult(attemptId)
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể tải kết quả.'
      throw e
    }
  }

  return {
    // state
    currentAttempt,
    answers,
    error,
    // answer helpers
    setAnswer,
    getAnswer,
    resetAnswers,
    // api actions
    startAttempt,
    submitAttempt,
    fetchResult,
  }
})
