import { httpClient } from "@/src/configs/httpClientConfig.ts";
import { IDashboardData } from "@/src/interface/IDashboardData.ts";

export const dashboardApi = {
    getDashboardData: () =>
        httpClient.post<IDashboardData>('/api/v1/dashboard', {}).then(res => res.data),
};
