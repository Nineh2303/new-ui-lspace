import { httpClient } from "@/src/configs/httpClientConfig.ts";
import { ApiResponse } from "@/src/interface/ApiResponse.ts";
import { IRegisterUserResponse } from "@/src/stores/models/auth/response/IRegisterUserResponse.ts";
import { IRegisterUserRequest } from "@/src/stores/models/auth/request/IRegisterUserRequest.ts";
import type { ILoginUserRequest } from "@/src/stores/models/auth/request/ILoginUserRequest.ts";
import type { ICurrentUserRequest } from "@/src/stores/models/auth/request/AuthRequest.ts";
import { ISchoolItem } from "@/src/interface/ISchool.ts";

export const userApi = {
    getCurrentUser: () =>
        httpClient.post<ApiResponse<IRegisterUserResponse>>('/api/v1/users/current-user', {} as ICurrentUserRequest).then(res => res.data),

    register: (request: IRegisterUserRequest) =>
        httpClient.post<ApiResponse<IRegisterUserResponse>>('/api/v1/users/register', request).then(res => res.data),

    login: (request: ILoginUserRequest) =>
        httpClient.post<ApiResponse<IRegisterUserResponse>>('/api/v1/users/login', request).then(res => res.data),

    getSchools: () =>
        httpClient.post<ApiResponse<ISchoolItem[]>>('/api/v1/schools', {}).then(res => res.data),
};
