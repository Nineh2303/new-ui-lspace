import type { IExam } from '@/src/interface/IExam'

// ─── Exam Requests ────────────────────────────────────────────────────────────

/** POST /api/exams — tạo bài thi mới */
export interface ICreateExamRequest {
  title: string
  description?: string | null
  time_limit_minutes?: number | null
  passing_score: number
  is_published?: boolean
}

/** PUT /api/exams/:id — cập nhật bài thi */
export interface IUpdateExamRequest {
  title?: string
  description?: string | null
  time_limit_minutes?: number | null
  passing_score?: number
  is_published?: boolean
}
