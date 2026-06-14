export interface ILeaderboardResponse {
  rank: number;
  init: string;
  name: string;
  type: string;
  points: string;
}

export interface ILeaderboardListResponse {
  data: ILeaderboardResponse[];
}

export interface IDeleteLeaderboardResponse {
  success: boolean;
  message: string;
}
