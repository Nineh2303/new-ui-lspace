import {IDayActivity, ILeaderboardItem, IVideoItem} from "@/src/data/Dashboard.ts";

export interface IDashboardData {
    activity: IDayActivity[];
    leaderboard: ILeaderboardItem[];
    videos: IVideoItem[];
}