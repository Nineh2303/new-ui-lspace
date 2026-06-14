// ─── Question Requests ────────────────────────────────────────────────────────

/** POST /api/exams/questions — lấy câu hỏi của bài thi (ẩn đáp án) */
export interface IGetQuestionsRequest {
  examId: string
}

/** POST /api/exams/questions/list — lấy câu hỏi kèm đáp án (admin only) */
export interface IGetQuestionsAdminRequest {
  examId: string
}

/** POST /api/exams/questions/create — tạo câu hỏi mới */
export interface ICreateQuestionRequest {
  examId: string
  content: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: { id: string; text: string }[] | null
  correct_answer?: string | null
  explanation?: string | null
  points?: number
  order_index?: number
}

/** POST /api/exams/questions/update — cập nhật câu hỏi */
export interface IUpdateQuestionRequest {
  examId: string
  id: string
  content?: string
  question_type?: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: { id: string; text: string }[] | null
  correct_answer?: string | null
  explanation?: string | null
  points?: number
  order_index?: number
}

/** POST /api/exams/questions/delete — xóa câu hỏi */
export interface IDeleteQuestionRequest {
  examId: string
  id: string
}
