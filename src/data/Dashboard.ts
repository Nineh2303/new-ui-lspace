export interface IDayActivity {
  day: string;
  active: boolean[];
}

export interface ILeaderboardItem {
  rank: number;
  init: string;
  name: string;
  type: string;
  points: string;
}

export interface IVideoItem {
  id: number;
  category: string;
  thumbnail: string;
  title: string;
  duration: string;
  instructor: string;
  views: string;
  videoUrl?: string; // Add optional video url later if needed
}

export const videosData: IVideoItem[] = [
  { id: 1, category: 'Luyện nghe', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Chiến thuật làm bài Nghe Part 1 (Tranh)', duration: '12:45', instructor: 'Cô Mai', views: '1.2K lượt xem' },
  { id: 2, category: 'Ngữ pháp', thumbnail: 'https://images.unsplash.com/photo-1546410531-bea5aad13156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: '12 Thì trong Tiếng Anh (Phần 1)', duration: '45:20', instructor: 'Thầy Hùng', views: '3.4K lượt xem' },
  { id: 3, category: 'Từ vựng', thumbnail: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Từ vựng chủ đề Office & Business', duration: '20:15', instructor: 'Cô Lan', views: '800 lượt xem' },
  { id: 4, category: 'Luyện đọc', thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Skimming và Scanning hiệu quả', duration: '18:30', instructor: 'Thầy David', views: '2.1K lượt xem' },
  { id: 5, category: 'Luyện nghe', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Chữa đề Listening Format Mới ETS 2024', duration: '55:10', instructor: 'Cô Mai', views: '5K lượt xem' },
  { id: 6, category: 'Luyện nói', thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Phát âm chuẩn IPA - Phụ âm', duration: '22:00', instructor: 'Thầy John', views: '1.5K lượt xem' },
];
