import { defineStore } from 'pinia'
import { ref } from 'vue'
import { examApi } from '@/src/apis'
import type { IExamAttempt, IAttemptResult } from '@/src/interface/IExam'
import type { ISubmitAttemptRequest } from '@/src/stores/models/exam/request/IAttemptRequest.ts'

const STORAGE_KEY_PREFIX = 'exam_answers_'
const ATTEMPT_KEY = 'exam_current_attempt'

export const useAttemptStore = defineStore('attempt', () => {
  const currentAttempt = ref<IExamAttempt | null>(null)
  /** Map questionId → answer (lưu tạm phía client trong khi làm bài) */
  const answers = ref<Record<string, string>>({})
  const error = ref<string | null>(null)

  // ── localStorage auto-save ───────────────────────────────────────────────────

  /** Lưu câu trả lời vào localStorage */
  function saveToStorage() {
    if (!currentAttempt.value) return
    localStorage.setItem(
      STORAGE_KEY_PREFIX + currentAttempt.value.id,
      JSON.stringify(answers.value),
    )
  }

  /** Khôi phục câu trả lời từ localStorage (gọi khi mount ExamTakeView) */
  function loadSavedAnswers() {
    if (!currentAttempt.value) return
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + currentAttempt.value.id)
    if (saved) {
      try {
        answers.value = JSON.parse(saved)
      } catch {
        // corrupt data — ignore
      }
    }
  }

  /** Xóa cache localStorage sau khi nộp bài */
  function clearSavedAnswers() {
    if (currentAttempt.value) {
      localStorage.removeItem(STORAGE_KEY_PREFIX + currentAttempt.value.id)
    }
    localStorage.removeItem(ATTEMPT_KEY)
    currentAttempt.value = null
    answers.value = {}
  }

  /** Lưu attempt hiện tại vào localStorage (để restore sau refresh) */
  function saveAttemptToStorage() {
    if (currentAttempt.value) {
      localStorage.setItem(ATTEMPT_KEY, JSON.stringify(currentAttempt.value))
    }
  }

  /** Khôi phục attempt từ localStorage */
  function loadAttemptFromStorage(): boolean {
    const saved = localStorage.getItem(ATTEMPT_KEY)
    if (saved) {
      try {
        currentAttempt.value = JSON.parse(saved)
        return true
      } catch {
        return false
      }
    }
    return false
  }

  // ── In-memory answer management ──────────────────────────────────────────────

  function setAnswer(questionId: string, answer: string) {
    answers.value[questionId] = answer
    saveToStorage() // auto-save mỗi lần trả lời
  }

  function getAnswer(questionId: string): string {
    return answers.value[questionId] ?? ''
  }

  function resetAnswers() {
    answers.value = {}
  }

  // ── API actions ─────────────────────────────────────────────────────────────

  /**
   * Bắt đầu làm bài thi — user info lấy từ JWT session.
   * POST /api/exams/:examId/attempts
   */
  async function startAttempt(examId: string): Promise<IExamAttempt> {
    error.value = null
    try {
      const attempt = await examApi.startAttempt(examId)
      currentAttempt.value = attempt
      resetAnswers()
      saveAttemptToStorage()
      return attempt
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể bắt đầu bài thi.'
      throw e
    }
  }

  /**
   * Nộp bài thi — gửi toàn bộ answers lên server để chấm điểm.
   * POST /api/attempts/:attemptId/submit
   * Server trả về { attempt_id, score, passed, time_spent }
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
      const result = await examApi.submitAttempt(request)
      clearSavedAnswers() // Xóa cache sau khi nộp thành công
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
      return await examApi.getAttemptResult(attemptId)
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Không thể tải kết quả.'
      throw e
    }
  }

  /**
   * Hủy phiên làm bài hiện tại — gọi khi user back ra khỏi màn hình thi.
   * Server sẽ soft delete attempt này để tránh trùng lặp.
   */
  async function cancelAttempt(): Promise<void> {
    if (!currentAttempt.value) return
    try {
      await examApi.cancelAttempt(currentAttempt.value.id)
    } catch {
      // Bỏ qua lỗi — attempt có thể đã bị hủy hoặc đã nộp
    } finally {
      clearSavedAnswers()
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
    // localStorage helpers
    loadSavedAnswers,
    clearSavedAnswers,
    loadAttemptFromStorage,
    // api actions
    startAttempt,
    submitAttempt,
    fetchResult,
    cancelAttempt,
  }
})
