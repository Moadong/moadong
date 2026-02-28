import type { Club } from '@/types/club';

// 동아리 목업 데이터
export const floatingClubs: Club[] = [
  {
    id: 'moadong',
    name: '모아동',
    logo: '',
    tags: ['학술', '스터디'],
    recruitmentStatus: 'OPEN',
    division: '중동',
    category: '학술',
    introduction: '다양한 전공 학생들이 모여 학문을 함께 나누는 동아리',
  },
  {
    id: 'moaboza',
    name: '모아보자',
    logo: '',
    tags: ['봉사', '지역사회'],
    recruitmentStatus: 'ALWAYS',
    division: '중동',
    category: '봉사',
    introduction: '지역 사회와 함께 봉사하며 따뜻함을 전하는 동아리',
  },
  {
    id: 'moamoa',
    name: '모아모아',
    logo: '',
    tags: ['취미', '교양'],
    recruitmentStatus: 'OPEN',
    division: '중동',
    category: '취미교양',
    introduction: '다양한 취미를 가진 사람들이 모여 교류하는 동아리',
  },
  {
    id: 'moajup',
    name: '모아운동',
    logo: '',
    tags: ['스포츠', '팀워크'],
    recruitmentStatus: 'CLOSED',
    division: '중동',
    category: '운동',
    introduction: '함께 운동을 즐기며 건강과 팀워크를 다지는 동아리',
  },
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
