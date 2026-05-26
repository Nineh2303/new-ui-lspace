import {httpClient} from "@/src/configs/httpClientConfig.ts";
import {IDashboardData} from "@/src/interface/IDashboardData.ts";
import {IUser} from "@/src/interface/IUser.ts";
import {IGoogleLoginPayload} from "@/src/interface/IGoogleLoginPayload.ts";
import {IGoogleLoginResponse} from "@/src/interface/IGoogleLoginResponse.ts";
import {ILeaderboardItem, videosData} from "@/src/data/Dashboard.ts";
import {ApiResponse} from "@/src/interface/ApiResponse.ts";

// Automatically add JWT system token to the request headers when present
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('langspace_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // Dashboard
    getDashboardData: () => httpClient
        .post<IDashboardData>('/api/dashboard', {})
        .then(res => {
            return res.data
        }),

    // Users CRUD
    getAuthConfig: () => httpClient.get<{
        googleClientId: string | null
    }>('/api/users/auth-config').then(res => res.data),
    getCurrentUser: () => httpClient.post('/api/users/current-user',{}).then(res => res.data),
    getUsers: () => httpClient.get<IUser[]>('/api/users').then(res => res.data),
    getUserById: (id: string) => httpClient.get<IUser>(`/api/users/${id}`).then(res => res.data),
    createUser: (data: Partial<IUser>) => httpClient.post<IUser>('/api/users', data).then(res => res.data),
    updateUser: (id: string, data: Partial<IUser>) => httpClient.put<IUser>(`/api/users/${id}`, data).then(res => res.data),
    deleteUser: (id: string) => httpClient.delete<{
        success: boolean;
        message: string
    }>(`/api/users/${id}`).then(res => res.data),
    googleLogin: (payload: IGoogleLoginPayload) =>
        httpClient.post<ApiResponse<IGoogleLoginResponse>>('/api/users/google-login', payload)
        .then(res => res.data),


    // // Videos CRUD
    // getVideos: () => httpClient.get<IVideoItem[]>('/api/videos').then(res => res.data),
    // getVideoById: (id: number) => httpClient.get<IVideoItem>(`/api/videos/${id}`).then(res => res.data),
    // createVideo: (data: Partial<IVideoItem>) => httpClient.post<IVideoItem>('/api/videos', data).then(res => res.data),
    // updateVideo: (id: number, data: Partial<IVideoItem>) => httpClient.put<IVideoItem>(`/api/videos/${id}`, data).then(res => res.data),
    // deleteVideo: (id: number) => httpClient.delete<{ success: boolean; message: string }>(`/api/videos/${id}`).then(res => res.data),

    // Leaderboard CRUD
    getLeaderboard: () => httpClient.get<ILeaderboardItem[]>('/api/leaderboard').then(res => res.data),
    getLeaderboardById: (id: number) => httpClient.get<ILeaderboardItem>(`/api/leaderboard/${id}`).then(res => res.data),
    createLeaderboard: (data: Partial<ILeaderboardItem>) => httpClient.post<ILeaderboardItem>('/api/leaderboard', data).then(res => res.data),
    updateLeaderboard: (id: number, data: Partial<ILeaderboardItem>) => httpClient.put<ILeaderboardItem>(`/api/leaderboard/${id}`, data).then(res => res.data),
    deleteLeaderboard: (id: number) => httpClient.delete<{
        success: boolean;
        message: string
    }>(`/api/leaderboard/${id}`).then(res => res.data),

    // // Activities CRUD
    // getActivities: () => httpClient.get<IDayActivity[]>('/api/activities').then(res => res.data),
    // getActivityById: (id: number) => httpClient.get<IDayActivity>(`/api/activities/${id}`).then(res => res.data),
    // createActivity: (data: Partial<IDayActivity>) => httpClient.post<IDayActivity>('/api/activities', data).then(res => res.data),
    // updateActivity: (id: number, data: Partial<IDayActivity>) => httpClient.put<IDayActivity>(`/api/activities/${id}`, data).then(res => res.data),
    // deleteActivity: (id: number) => httpClient.delete<{ success: boolean; message: string }>(`/api/activities/${id}`).then(res => res.data),
};
