// ─── Exam ────────────────────────────────────────────────────────────────────

export interface QuestionOption {
  id: string
  text: string
}

export interface IExam {
  id: string;
  title: string;
  description: string | null;
  time_limit_minutes: number | null;
  passing_score: number;
  display_question_count: number | null;
  is_published: boolean;
  created_at: string;
  question_count: number;
}

export interface IQuestion {
  id: string
  exam_id: string
  content: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: QuestionOption[] | null
  correct_answer: string | null
  explanation: string | null
  points: number
  order_index: number
}

// ─── Attempt ─────────────────────────────────────────────────────────────────

export interface IExamAttempt {
  id: string;
  exam_id: string;
  user_id: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  passed: boolean | null;
  questions?: IQuestion[];
}

export interface IAttemptAnswer {
  id: string
  attempt_id: string
  question_id: string
  answer: string | null
  is_correct: boolean | null
  points_earned: number
}

export interface IAttemptResult {
  attempt: IExamAttempt
  answers: (IAttemptAnswer & { question: IQuestion })[]
  total_points: number
  earned_points: number
}
