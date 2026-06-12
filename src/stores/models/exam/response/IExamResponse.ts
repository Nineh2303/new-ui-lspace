import type { IExam, IQuestion, IExamAttempt, IAttemptResult } from '@/src/interface/IExam'

// ─── Exam Responses ───────────────────────────────────────────────────────────

/** GET /api/exams — danh sách bài thi (public, chỉ published) */
export interface IExamListResponse {
  data: IExam[]
  total: number
}

/** GET /api/exams/:id — chi tiết bài thi kèm số câu hỏi */
export type IExamDetailResponse = IExam

/** GET /api/exams/:id/questions — danh sách câu hỏi (ẩn correct_answer) */
export interface IExamQuestionsResponse {
  data: IQuestion[]
}

/** POST /api/exams — tạo bài thi */
export type ICreateExamResponse = IExam

/** PUT /api/exams/:id — cập nhật bài thi */
export type IUpdateExamResponse = IExam

// ─── Attempt Responses ────────────────────────────────────────────────────────

/** POST /api/exams/:examId/attempts — bắt đầu làm bài */
export type IStartAttemptResponse = IExamAttempt

/** POST /api/attempts/:attemptId/submit — nộp bài, trả về kết quả */
export type ISubmitAttemptResponse = {
  attempt_id: string
  score: number
  passed: boolean
}

/** GET /api/attempts/:attemptId/result — xem kết quả chi tiết */
export type IAttemptResultResponse = IAttemptResult
