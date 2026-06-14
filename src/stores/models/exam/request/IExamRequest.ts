// ─── Exam Requests ────────────────────────────────────────────────────────────

/** POST /api/exams — danh sách bài thi đã published */
// (no body needed)

/** POST /api/exams/detail — lấy chi tiết 1 bài thi */
export interface IGetExamRequest {
  id: string
}

/** POST /api/exams/create — tạo bài thi mới */
export interface ICreateExamRequest {
  title: string
  description?: string | null
  time_limit_minutes?: number | null
  passing_score: number
  display_question_count?: number | null
  is_published?: boolean
}

/** POST /api/exams/update — cập nhật bài thi */
export interface IUpdateExamRequest {
  id: string
  title?: string
  description?: string | null
  time_limit_minutes?: number | null
  passing_score?: number
  display_question_count?: number | null
  is_published?: boolean
}

/** POST /api/exams/delete — xóa bài thi */
export interface IDeleteExamRequest {
  id: string
}

/** POST /api/exams/top-results — top kết quả bài thi */
export interface IGetTopResultsRequest {
  examId: string
  limit?: number
}
