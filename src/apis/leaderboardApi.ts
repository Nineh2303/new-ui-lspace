import { httpClient } from "@/src/configs/httpClientConfig.ts";
import type {
    ILeaderboardResponse,
    IDeleteLeaderboardResponse,
} from "@/src/stores/models/leaderboard/response/ILeaderboardResponse.ts";
import type {
    ICreateLeaderboardRequest,
    IUpdateLeaderboardRequest,
} from "@/src/stores/models/leaderboard/request/ILeaderboardRequest.ts";

export const leaderboardApi = {
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
};
