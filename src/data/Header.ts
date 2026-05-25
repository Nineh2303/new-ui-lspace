export interface INavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export const topNavLinks: INavLink[] = [
  { label: 'Video', href: '#' },
  { label: 'Bài viết', href: '#' }
];
