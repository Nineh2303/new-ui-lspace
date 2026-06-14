export interface ICreateLeaderboardRequest {
  rank: number;
  init: string;
  name: string;
  type: string;
  points: string;
}

export interface IUpdateLeaderboardRequest {
  rank?: number;
  init?: string;
  name?: string;
  type?: string;
  points?: string;
}
