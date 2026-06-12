import {httpClient} from "@/src/configs/httpClientConfig.ts";
import {IDashboardData} from "@/src/interface/IDashboardData.ts";
import {IUser} from "@/src/interface/IUser.ts";
import {IGoogleLoginPayload} from "@/src/interface/IGoogleLoginPayload.ts";
import {GoogleLoginResponse,} from "@/src/interface/GoogleLoginResponse.ts";
import {ILeaderboardItem} from "@/src/data/Dashboard.ts";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";
import {ISchoolItem} from "@/src/interface/ISchool.ts";
import {IRegisterUserResponse} from "@/src/stores/models/auth/response/IRegisterUserResponse.ts";
import {IRegisterUserRequest} from "@/src/stores/models/auth/request/IRegisterUserRequest.ts";
import type { IQuestion, IExamAttempt, IAttemptResult } from "@/src/interface/IExam.ts";
import type {
    ICreateExamRequest,
    IUpdateExamRequest,
} from "@/src/stores/models/exam/request/IExamRequest.ts";
import type {
    ICreateQuestionRequest,
    IUpdateQuestionRequest,
} from "@/src/stores/models/exam/request/IQuestionRequest.ts";
import type {
    IStartAttemptRequest,
    ISubmitAttemptRequest,
} from "@/src/stores/models/exam/request/IAttemptRequest.ts";
import type {
    IExamListResponse,
    IExamDetailResponse,
    IExamQuestionsResponse,
    ICreateExamResponse,
    IUpdateExamResponse,
    IStartAttemptResponse,
    ISubmitAttemptResponse,
    IAttemptResultResponse,
} from "@/src/stores/models/exam/response/IExamResponse.ts";

// Automatically add JWT system token to the request headers when present
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('langspace_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // ── Dashboard ────────────────────────────────────────────────────────────
    getDashboardData: () =>
        httpClient.post<IDashboardData>('/api/dashboard', {}).then(res => res.data),

    // ── Users ────────────────────────────────────────────────────────────────
    getAuthConfig: () =>
        httpClient.get<{ googleClientId: string | null }>('/api/users/auth-config').then(res => res.data),
    getCurrentUser: () =>
        httpClient.post('/api/users/current-user', {}).then(res => res.data),
    register: (request: IRegisterUserRequest) =>
        httpClient.post<ApiResponse<IRegisterUserResponse>>('/api/users/register', request).then(res => res.data),
    getUsers: () =>
        httpClient.get<IUser[]>('/api/users').then(res => res.data),
    getUserById: (id: string) =>
        httpClient.get<IUser>(`/api/users/${id}`).then(res => res.data),
    createUser: (data: Partial<IUser>) =>
        httpClient.post<IUser>('/api/users', data).then(res => res.data),
    updateUser: (id: string, data: Partial<IUser>) =>
        httpClient.put<IUser>(`/api/users/${id}`, data).then(res => res.data),
    deleteUser: (id: string) =>
        httpClient.delete<{ success: boolean; message: string }>(`/api/users/${id}`).then(res => res.data),
    googleLogin: (payload: IGoogleLoginPayload) =>
        httpClient.post<ApiResponse<GoogleLoginResponse>>('/api/users/google-login', payload).then(res => res.data),
    getSchools: () =>
        httpClient.post<ApiResponse<ISchoolItem[]>>('/api/schools', {}).then(res => res.data),

    // ── Leaderboard ──────────────────────────────────────────────────────────
    getLeaderboard: () =>
        httpClient.get<ILeaderboardItem[]>('/api/leaderboard').then(res => res.data),
    getLeaderboardById: (id: number) =>
        httpClient.get<ILeaderboardItem>(`/api/leaderboard/${id}`).then(res => res.data),
    createLeaderboard: (data: Partial<ILeaderboardItem>) =>
        httpClient.post<ILeaderboardItem>('/api/leaderboard', data).then(res => res.data),
    updateLeaderboard: (id: number, data: Partial<ILeaderboardItem>) =>
        httpClient.put<ILeaderboardItem>(`/api/leaderboard/${id}`, data).then(res => res.data),
    deleteLeaderboard: (id: number) =>
        httpClient.delete<{ success: boolean; message: string }>(`/api/leaderboard/${id}`).then(res => res.data),

    // ── Exams ────────────────────────────────────────────────────────────────
    /** GET /api/exams — danh sách bài thi đã published (user) */
    getExams: () =>
        httpClient.get<IExamListResponse>('/api/exams').then(res => res.data),

    /** GET /api/exams/all — tất cả bài thi kể cả nháp (admin) */
    getAllExams: () =>
        httpClient.get<IExamListResponse>('/api/exams/all').then(res => res.data),

    /** GET /api/exams/:id — chi tiết bài thi */
    getExamById: (id: string) =>
        httpClient.get<IExamDetailResponse>(`/api/exams/${id}`).then(res => res.data),

    /** GET /api/exams/:id/questions — câu hỏi của bài thi */
    getExamQuestions: (examId: string) =>
        httpClient.get<IExamQuestionsResponse>(`/api/exams/${examId}/questions`).then(res => res.data),

    /** POST /api/exams — tạo bài thi mới */
    createExam: (request: ICreateExamRequest) =>
        httpClient.post<ICreateExamResponse>('/api/exams', request).then(res => res.data),

    /** PUT /api/exams/:id — cập nhật bài thi */
    updateExam: (id: string, request: IUpdateExamRequest) =>
        httpClient.put<IUpdateExamResponse>(`/api/exams/${id}`, request).then(res => res.data),

    /** DELETE /api/exams/:id — xóa bài thi */
    deleteExam: (id: string) =>
        httpClient.delete<{ success: boolean; message: string }>(`/api/exams/${id}`).then(res => res.data),

    // ── Questions ────────────────────────────────────────────────────────────
    /** POST /api/exams/:examId/questions — thêm câu hỏi */
    createQuestion: (examId: string, request: ICreateQuestionRequest) =>
        httpClient.post<IQuestion>(`/api/exams/${examId}/questions`, request).then(res => res.data),

    /** PUT /api/exams/:examId/questions/:id — cập nhật câu hỏi */
    updateQuestion: (examId: string, questionId: string, request: IUpdateQuestionRequest) =>
        httpClient.put<IQuestion>(`/api/exams/${examId}/questions/${questionId}`, request).then(res => res.data),

    /** DELETE /api/exams/:examId/questions/:id — xóa câu hỏi */
    deleteQuestion: (examId: string, questionId: string) =>
        httpClient.delete<{ success: boolean; message: string }>(`/api/exams/${examId}/questions/${questionId}`).then(res => res.data),

    // ── Attempts ─────────────────────────────────────────────────────────────
    /** POST /api/exams/:examId/attempts — bắt đầu làm bài */
    startAttempt: (request: IStartAttemptRequest) =>
        httpClient.post<IStartAttemptResponse>(`/api/exams/${request.exam_id}/attempts`, request).then(res => res.data),

    /** POST /api/attempts/:attemptId/submit — nộp bài */
    submitAttempt: (attemptId: string, request: ISubmitAttemptRequest) =>
        httpClient.post<ISubmitAttemptResponse>(`/api/attempts/${attemptId}/submit`, request).then(res => res.data),

    /** GET /api/attempts/:attemptId/result — xem kết quả */
    getAttemptResult: (attemptId: string) =>
        httpClient.get<IAttemptResultResponse>(`/api/attempts/${attemptId}/result`).then(res => res.data),
};
