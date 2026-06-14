// ─── User Admin Requests ──────────────────────────────────────────────────────

/** POST /api/users/user/list — danh sách học sinh */
export interface IUserListRequest {
  search?: string
}

/** POST /api/users/user/detail — chi tiết 1 user */
export interface IGetUserRequest {
  id: string
}

/** POST /api/users/user/update — cập nhật thông tin user */
export interface IUpdateUserRequest {
  id: string
  fullName?: string
  role?: string
  phoneNumber?: string
  schoolName?: string
  schoolGrade?: string
  is_active?: boolean
}

/** POST /api/users/user/delete — vô hiệu hóa user */
export interface IDeleteUserRequest {
  id: string
}

/** POST /api/users/user/exam-history — lịch sử thi của user */
export interface IGetExamHistoryRequest {
  id: string
}
