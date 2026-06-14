// ─── Attempt Requests ─────────────────────────────────────────────────────────

/** POST /api/exams/attempts/start — bắt đầu làm bài (user từ JWT) */
export interface IStartAttemptRequest {
  examId: string
}

/** POST /api/attempts/submit — nộp bài */
export interface ISubmitAttemptRequest {
  attempt_id: string
  /** Mảng câu trả lời */
  answers: ISubmitAnswerItem[]
}

export interface ISubmitAnswerItem {
  question_id: string
  answer: string | null
}

/** POST /api/attempts/result — xem kết quả chi tiết */
export interface IGetAttemptResultRequest {
  attemptId: string
}

/** POST /api/attempts/cancel — hủy phiên làm bài */
export interface ICancelAttemptRequest {
  attemptId: string
}
