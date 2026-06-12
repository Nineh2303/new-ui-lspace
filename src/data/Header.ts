export interface INavLink {
  label: string;
  href?: string;
  to?: string;
  hasDropdown?: boolean;
}

export const topNavLinks: INavLink[] = [
  { label: 'Video', href: '#' },
  { label: 'Bài viết', href: '#' },
  { label: 'Bài thi', to: '/exams' },
  { label: 'Quản trị', to: '/admin' },
];
