export interface ICreateVideoRequest {
  category: string;
  thumbnail: string;
  title: string;
  duration: string;
  instructor: string;
  views?: string;
  videoUrl?: string;
}

export interface IUpdateVideoRequest {
  category?: string;
  thumbnail?: string;
  title?: string;
  duration?: string;
  instructor?: string;
  views?: string;
  videoUrl?: string;
}
