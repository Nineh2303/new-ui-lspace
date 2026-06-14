import { httpClient } from "@/src/configs/httpClientConfig.ts";
import type { IVideoResponse, IDeleteVideoResponse } from "@/src/stores/models/video/response/IVideoResponse.ts";
import type { ICreateVideoRequest, IUpdateVideoRequest } from "@/src/stores/models/video/request/IVideoRequest.ts";

export const videoApi = {
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
};
