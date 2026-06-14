import { httpClient } from "@/src/configs/httpClientConfig.ts";
import type {
    ICreateExamRequest,
    IUpdateExamRequest,
    IGetExamRequest,
    IDeleteExamRequest,
    IGetTopResultsRequest,
} from "@/src/stores/models/exam/request/IExamRequest.ts";
import type {
    IGetQuestionsRequest,
    IGetQuestionsAdminRequest,
    ICreateQuestionRequest,
    IUpdateQuestionRequest,
    IDeleteQuestionRequest,
} from "@/src/stores/models/exam/request/IQuestionRequest.ts";
import type {
    IStartAttemptRequest,
    ISubmitAttemptRequest,
    IGetAttemptResultRequest,
    ICancelAttemptRequest,
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
import type { IQuestion } from "@/src/interface/IExam.ts";

export const examApi = {
    // ── Exams ────────────────────────────────────────────────────────────────
    /** POST /api/exams — danh sách bài thi đã published */
    getExams: () =>
        httpClient.post<IExamListResponse>('/api/v1/exams', {}).then(res => res.data),

    /** POST /api/exams/all — tất cả bài thi (admin) */
    getAllExams: () =>
        httpClient.post<IExamListResponse>('/api/v1/exams/all', {}).then(res => res.data),

    /** POST /api/exams/detail — chi tiết 1 bài thi */
    getExamById: (id: string) =>
        httpClient.post<IExamDetailResponse>('/api/v1/exams/detail', { id } as IGetExamRequest).then(res => res.data),

    /** POST /api/exams/top-results — top kết quả */
    getExamTopResults: (examId: string) =>
        httpClient.post<ITopResultsResponse>('/api/v1/exams/top-results', { examId, limit:3 } as IGetTopResultsRequest).then(res => res.data),

    /** POST /api/exams/create — tạo bài thi mới */
    createExam: (request: ICreateExamRequest) =>
        httpClient.post<ICreateExamResponse>('/api/v1/exams/create', request).then(res => res.data),

    /** POST /api/exams/update — cập nhật bài thi */
    updateExam: (id: string, request: Omit<IUpdateExamRequest, 'id'>) =>
        httpClient.post<IUpdateExamResponse>('/api/v1/exams/update', { id, ...request } as IUpdateExamRequest).then(res => res.data),

    /** POST /api/exams/delete — xóa bài thi */
    deleteExam: (id: string) =>
        httpClient.post('/api/v1/exams/delete', { id } as IDeleteExamRequest).then(res => res.data),

    // ── Questions ────────────────────────────────────────────────────────────
    /** POST /api/exams/questions — lấy câu hỏi (ẩn đáp án, dùng khi làm bài) */
    getExamQuestions: (examId: string) =>
        httpClient.post<IExamQuestionsResponse>('/api/v1/exams/questions', { examId } as IGetQuestionsRequest).then(res => res.data),

    /** POST /api/exams/questions/list — lấy câu hỏi kèm đáp án (admin only) */
    getExamQuestionsAdmin: (examId: string) =>
        httpClient.post<IExamQuestionsResponse>('/api/v1/exams/questions/list', { examId } as IGetQuestionsAdminRequest).then(res => res.data),

    /** POST /api/exams/questions/create — thêm câu hỏi */
    createQuestion: (examId: string, request: Omit<ICreateQuestionRequest, 'examId'>) =>
        httpClient.post<IQuestion>('/api/v1/exams/questions/create', { examId, ...request } as ICreateQuestionRequest).then(res => res.data),

    /** POST /api/exams/questions/update — cập nhật câu hỏi */
    updateQuestion: (examId: string, questionId: string, request: Omit<IUpdateQuestionRequest, 'examId' | 'id'>) =>
        httpClient.post<IQuestion>('/api/v1/exams/questions/update', { examId, id: questionId, ...request } as IUpdateQuestionRequest).then(res => res.data),

    /** POST /api/exams/questions/delete — xóa câu hỏi */
    deleteQuestion: (examId: string, questionId: string) =>
        httpClient.post('/api/v1/exams/questions/delete', { examId, id: questionId } as IDeleteQuestionRequest).then(res => res.data),

    // ── Attempts ─────────────────────────────────────────────────────────────
    /** POST /api/exams/attempts/start — bắt đầu làm bài (JWT user) */
    startAttempt: (examId: string) =>
        httpClient.post<IStartAttemptResponse>('/api/v1/exams/attempts/start', { examId } as IStartAttemptRequest).then(res => res.data),

    /** POST /api/attempts/submit — nộp bài */
    submitAttempt: (request: ISubmitAttemptRequest) =>
        httpClient.post<ISubmitAttemptResponse>('/api/v1/attempts/submit', request).then(res => res.data),

    /** POST /api/attempts/result — xem kết quả chi tiết */
    getAttemptResult: (attemptId: string) =>
        httpClient.post<IAttemptResultResponse>('/api/v1/attempts/result', { attemptId } as IGetAttemptResultRequest).then(res => res.data),

    /** POST /api/attempts/cancel — hủy phiên làm bài */
    cancelAttempt: (attemptId: string) =>
        httpClient.post('/api/v1/attempts/cancel', { attemptId } as ICancelAttemptRequest).then(res => res.data),
};
