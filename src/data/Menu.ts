import { Home, Headphones, BookOpen, Edit3, Mic, Type, BookA, PenTool, CheckCircle, BarChart, Clock, BookMarked, Settings, FileText, ShieldCheck } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface IMenuItem {
  name: string;
  icon: Component;
  isActive?: boolean;
  route?: string;
  badge?: {
    text: string;
    class: string;
  };
}

export interface IMenuGroup {
  title: string;
  items: IMenuItem[];
}

export const menuGroups: IMenuGroup[] = [
  {
    title: 'Tổng quan',
    items: [
      { name: 'Trang chủ', icon: Home, isActive: true }
    ]
  },
  {
    title: 'Luyện tập',
    items: [
      { name: 'Listening', icon: Headphones },
      { name: 'Reading', icon: BookOpen },
      { name: 'Writing', icon: Edit3 },
      { name: 'Speaking', icon: Mic, badge: { text: 'AI', class: 'bg-[#E6F8ED] text-[#00B85E]' } },
      { name: 'Đề thi', icon: FileText, route: '/exams', badge: { text: 'MỚI', class: 'bg-[#E8F0FE] text-[#0033CC]' } }
    ]
  },
  {
    title: 'Công cụ',
    items: [
      { name: 'Từ vựng', icon: Type },
      { name: 'Ngữ pháp', icon: BookA },
      { name: 'Bài mẫu', icon: PenTool },
      { name: 'AI chấm chữa', icon: CheckCircle, badge: { text: 'MỚI', class: 'bg-[#E8F0FE] text-[#0033CC]' } }
    ]
  },
  {
    title: 'Quản lý',
    items: [
      { name: 'Kết quả học tập', icon: BarChart },
      { name: 'Lịch sử làm bài', icon: Clock },
      { name: 'Sổ tay', icon: BookMarked },
      { name: 'Admin đề thi', icon: ShieldCheck, route: '/admin' },
      { name: 'Cài đặt', icon: Settings }
    ]
  }
];
