import type { Club } from '@/types/club';

// 동아리 목업 데이터
export const floatingClubs: Club[] = [
  {
    id: 'wap',
    name: 'WAP',
    logo: '',
    tags: ['프로젝트', '소프트웨어'],
    recruitmentStatus: '모집중',
    division: '중앙동아리',
    category: '학술',
    introduction: '개발자들이 모여있습니다.',
  },
  {
    id: 'moadong',
    name: '모아동',
    logo: '',
    tags: ['취미교양', '동아리'],
    recruitmentStatus: '모집중',
    division: '중앙동아리',
    category: '모임',
    introduction: '모여서 만드는 동아리',
  },
  {
    id: 'moaboza',
    name: '모아보자',
    logo: '',
    tags: ['학술', '프로젝트'],
    recruitmentStatus: '모집마감',
    division: '단과대',
    category: '소프트웨어',
    introduction: '데이터로 모아보는 동아리',
  },
  {
    id: 'dddddd',
    name: '모아보즈아앙',
    logo: '',
    tags: ['학술', '프로젝트'],
    recruitmentStatus: '모집마감',
    division: '단과대',
    category: '소프트웨어',
    introduction: '데이터로 모아보는 동아리',
  },
];

export const cardPositions = [
  { top: '10%', left: '15%' }, // 1번 카드: 좌측 상단
  { top: '25%', right: '10%' }, // 2번 카드: 우측 상단
  { top: '55%', left: '5%' }, // 3번 카드: 좌측 하단
  { top: '70%', right: '18%' }, // 4번 카드: 우측 하단
];

export const tagsRow1 = [
  { type: '운동', label: '운동' },
  { type: '취미교양', label: '취미교양' },
  { type: '공연', label: '공연' },
  { type: '자유', label: '자유' },
  { type: '봉사', label: '봉사' },
  { type: '학술', label: '학술' },
  { type: '종교', label: '종교' },
];

export const tagsRow2 = [
  { type: '자유', label: '친목' },
  { type: '자유', label: '스터디' },
  { type: '자유', label: '공모전' },
  { type: '자유', label: '봉사' },
  { type: '자유', label: '음악' },
  { type: '자유', label: '여행' },
  { type: '자유', label: '창업' },
  { type: '자유', label: '자격증' },
  { type: '자유', label: '언어' },
];
