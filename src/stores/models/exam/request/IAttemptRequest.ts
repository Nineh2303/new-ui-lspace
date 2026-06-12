import type { IExamAttempt, IAttemptAnswer, IAttemptResult } from '@/src/interface/IExam'

// ─── Attempt Requests ─────────────────────────────────────────────────────────

/** POST /api/exams/:examId/attempts — bắt đầu làm bài */
export interface IStartAttemptRequest {
  exam_id: string
  student_name: string
  student_email: string
}

/** POST /api/attempts/:attemptId/submit — nộp bài */
export interface ISubmitAttemptRequest {
  attempt_id: string
  /** Mảng câu trả lời */
  answers: ISubmitAnswerItem[]
}

export interface ISubmitAnswerItem {
  question_id: string
  answer: string | null
}
