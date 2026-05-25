import type { Component } from 'vue';
import { CheckSquare, Clock, Headphones, BookOpen, Edit3, Mic } from 'lucide-vue-next';

export interface IFilterItem {
  id: string;
  label: string;
  icon?: Component;
  isAll?: boolean;
}

export const taskTypeFilters: IFilterItem[] = [
  { id: 'Tất cả', label: 'Tất cả', isAll: true },
  { id: 'Bài tập', label: 'Bài tập', icon: CheckSquare },
  { id: 'Đề thi gần đây', label: 'Đề thi gần đây', icon: Clock }
];

export const categoryFilters: IFilterItem[] = [
  { id: 'Tất cả', label: 'Tất cả', isAll: true },
  { id: 'Listening', label: 'Listening', icon: Headphones },
  { id: 'Reading', label: 'Reading', icon: BookOpen },
  { id: 'Writing', label: 'Writing', icon: Edit3 },
  { id: 'Speaking', label: 'Speaking', icon: Mic }
];
