import {httpClient} from "@/src/configs/httpClientConfig.ts";
import {IDashboardData} from "@/src/interface/IDashboardData.ts";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";
import {ISchoolItem} from "@/src/interface/ISchool.ts";
import {IRegisterUserResponse} from "@/src/stores/models/auth/response/IRegisterUserResponse.ts";
import {IRegisterUserRequest} from "@/src/stores/models/auth/request/IRegisterUserRequest.ts";
import type { ILoginUserRequest } from "@/src/stores/models/auth/request/ILoginUserRequest.ts";
import type {
    ICreateExamRequest,
    IUpdateExamRequest,
} from "@/src/stores/models/exam/request/IExamRequest.ts";
import type {
    ICreateQuestionRequest,
    IUpdateQuestionRequest,
} from "@/src/stores/models/exam/request/IQuestionRequest.ts";
import type {
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
import type { ITopResultsResponse } from "@/src/stores/models/exam/response/ITopResultResponse.ts";
import type { IVideoResponse, IDeleteVideoResponse } from "@/src/stores/models/video/response/IVideoResponse.ts";
import type { ICreateVideoRequest, IUpdateVideoRequest } from "@/src/stores/models/video/request/IVideoRequest.ts";
import type {
    ILeaderboardResponse,
    IDeleteLeaderboardResponse,
} from "@/src/stores/models/leaderboard/response/ILeaderboardResponse.ts";
import type {
    ICreateLeaderboardRequest,
    IUpdateLeaderboardRequest,
} from "@/src/stores/models/leaderboard/request/ILeaderboardRequest.ts";
import type { IQuestion } from "@/src/interface/IExam.ts";


export const api = {
    // ── Dashboard ────────────────────────────────────────────────────────────
    getDashboardData: () =>
        httpClient.post<IDashboardData>('/api/v1/dashboard', {}).then(res => res.data),

    // ── Users ────────────────────────────────────────────────────────────────
    getCurrentUser: () =>
        httpClient.get<ApiResponse<IRegisterUserResponse>>('/api/v1/users/current-user').then(res => res.data),
    register: (request: IRegisterUserRequest) =>
        httpClient.post<ApiResponse<IRegisterUserResponse>>('/api/v1/users/register', request).then(res => res.data),
    login: (request: ILoginUserRequest) =>
        httpClient.post<ApiResponse<IRegisterUserResponse>>('/api/v1/users/login', request).then(res => res.data),
    getSchools: () =>
        httpClient.post<ApiResponse<ISchoolItem[]>>('/api/v1/schools', {}).then(res => res.data),

    // ── Videos ───────────────────────────────────────────────────────────────
    getVideos: () =>
        httpClient.get<IVideoResponse[]>('/api/v1/videos').then(res => res.data),
    getVideoById: (id: number) =>
        httpClient.get<IVideoResponse>(`/api/videos/${id}`).then(res => res.data),
    createVideo: (request: ICreateVideoRequest) =>
        httpClient.post<IVideoResponse>('/api/v1/videos', request).then(res => res.data),
    updateVideo: (id: number, request: IUpdateVideoRequest) =>
        httpClient.put<IVideoResponse>(`/api/videos/${id}`, request).then(res => res.data),
    deleteVideo: (id: number) =>
        httpClient.delete<IDeleteVideoResponse>(`/api/videos/${id}`).then(res => res.data),

    // ── Leaderboard ──────────────────────────────────────────────────────────
    getLeaderboard: () =>
        httpClient.get<ILeaderboardResponse[]>('/api/v1/leaderboard').then(res => res.data),
    getLeaderboardById: (id: number) =>
        httpClient.get<ILeaderboardResponse>(`/api/leaderboard/${id}`).then(res => res.data),
    createLeaderboard: (request: ICreateLeaderboardRequest) =>
        httpClient.post<ILeaderboardResponse>('/api/v1/leaderboard', request).then(res => res.data),
    updateLeaderboard: (id: number, request: IUpdateLeaderboardRequest) =>
        httpClient.put<ILeaderboardResponse>(`/api/leaderboard/${id}`, request).then(res => res.data),
    deleteLeaderboard: (id: number) =>
        httpClient.delete<IDeleteLeaderboardResponse>(`/api/leaderboard/${id}`).then(res => res.data),

    // ── Exams ────────────────────────────────────────────────────────────────
    /** GET /api/exams — danh sách bài thi đã published (user) */
    getExams: () =>
        httpClient.get<IExamListResponse>('/api/v1/exams').then(res => res.data),

    /** GET /api/exams/:id — chi tiết bài thi */
    getExamById: (id: string) =>
        httpClient.get<IExamDetailResponse>(`/api/exams/${id}`).then(res => res.data),

    /** GET /api/exams/:id/questions — câu hỏi của bài thi */
    getExamQuestions: (examId: string) =>
        httpClient.get<IExamQuestionsResponse>(`/api/exams/${examId}/questions`).then(res => res.data),

    /** GET /api/exams/:examId/top-results — top 5 kết quả */
    getExamTopResults: (examId: string) =>
        httpClient.get<ITopResultsResponse>(`/api/exams/${examId}/top-results`).then(res => res.data),

    // ── Questions ────────────────────────────────────────────────────────────
    createQuestion: (examId: string, request: ICreateQuestionRequest) =>
        httpClient.post<IQuestion>(`/api/exams/${examId}/questions`, request).then(res => res.data),
    updateQuestion: (examId: string, questionId: string, request: IUpdateQuestionRequest) =>
        httpClient.put<IQuestion>(`/api/exams/${examId}/questions/${questionId}`, request).then(res => res.data),
    deleteQuestion: (examId: string, questionId: string) =>
        httpClient.delete<IDeleteVideoResponse>(`/api/exams/${examId}/questions/${questionId}`).then(res => res.data),

    // ── Attempts ─────────────────────────────────────────────────────────────
    /** POST /api/exams/:examId/attempts — bắt đầu làm bài (JWT user) */
    startAttempt: (examId: string) =>
        httpClient.post<IStartAttemptResponse>(`/api/exams/${examId}/attempts`, {}).then(res => res.data),

    /** POST /api/attempts/:attemptId/submit — nộp bài */
    submitAttempt: (attemptId: string, request: ISubmitAttemptRequest) =>
        httpClient.post<ISubmitAttemptResponse>(`/api/attempts/${attemptId}/submit`, request).then(res => res.data),

    /** GET /api/attempts/:attemptId/result — xem kết quả */
    getAttemptResult: (attemptId: string) =>
        httpClient.get<IAttemptResultResponse>(`/api/attempts/${attemptId}/result`).then(res => res.data),
};
