export interface ITopResultItem {
  rank: number;
  full_name: string;
  best_score: number;
  total_points: number;
  earned_points: number;
  attempt_count: number;
  best_time: number | null;
  passed: boolean;
}

export interface ITopResultsResponse {
  data: ITopResultItem[];
}
