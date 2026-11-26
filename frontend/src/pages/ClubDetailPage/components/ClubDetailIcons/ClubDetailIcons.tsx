// 상세 화면 정보 행·빠른 실행 버튼에 쓰는 선 아이콘 (currentColor로 색을 받는다)
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const CalendarIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x='3.5' y='5' width='17' height='15.5' rx='3' />
    <path d='M3.5 10h17M8 3v4M16 3v4' />
  </svg>
);

export const PeopleIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx='9' cy='8.5' r='3.5' />
    <path d='M2.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5' />
    <path d='M15.5 5.2a3.5 3.5 0 0 1 0 6.6M18 14.8c1.7.7 3 2.3 3.5 4.7' />
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d='M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z' />
    <circle cx='12' cy='9.5' r='2.5' />
  </svg>
);

export const RefreshIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d='M20 11a8 8 0 0 0-14.5-4.5L4 8' />
    <path d='M4 3.5V8h4.5' />
    <path d='M4 13a8 8 0 0 0 14.5 4.5L20 16' />
    <path d='M20 20.5V16h-4.5' />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x='3.5' y='3.5' width='17' height='17' rx='5' />
    <circle cx='12' cy='12' r='4' />
    <circle cx='17.2' cy='6.8' r='0.6' fill='currentColor' />
  </svg>
);

export const YoutubeIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x='2.5' y='5.5' width='19' height='13' rx='4' />
    <path d='m10 9.2 5 2.8-5 2.8V9.2Z' fill='currentColor' />
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <svg {...base({ width: 16, height: 16, ...props })}>
    <path d='m9 6 6 6-6 6' />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d='m6 9 6 6 6-6' />
  </svg>
);
