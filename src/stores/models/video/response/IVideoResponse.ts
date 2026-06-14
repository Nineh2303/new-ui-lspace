export interface IVideoResponse {
  id: number;
  category: string;
  thumbnail: string;
  title: string;
  duration: string;
  instructor: string;
  views: string;
  videoUrl?: string;
}

export interface IVideoListResponse {
  data: IVideoResponse[];
}

export interface IDeleteVideoResponse {
  success: boolean;
  message: string;
}
