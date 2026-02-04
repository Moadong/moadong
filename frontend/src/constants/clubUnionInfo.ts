import { inactiveCategoryIcons } from '@/assets/images/icons/category_button';

export interface ClubUnionMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageSrc: string;
}

const MEMBER_AVATARS = {
  PRESIDENT: inactiveCategoryIcons.all,
  VICE_PRESIDENT: inactiveCategoryIcons.all,
  PLANNING: inactiveCategoryIcons.all,
  SECRETARY: inactiveCategoryIcons.all,
  PROMOTION: inactiveCategoryIcons.all,
  RELIGION: inactiveCategoryIcons.religion,
  HOBBY: inactiveCategoryIcons.hobby,
  STUDY: inactiveCategoryIcons.study,
  VOLUNTEER: inactiveCategoryIcons.volunteer,
  PERFORMANCE: inactiveCategoryIcons.performance,
  SPORT: inactiveCategoryIcons.sport,
};

export const CLUB_UNION_SNS = {
  instagram: 'https://www.instagram.com/17th_wesh',
  kakaotalk: 'https://pf.kakao.com/_WBqUxb',
} as const;

// 개발자 가이드: description 필드는 UI가 깨지지 않도록 글자 수를 제한합니다.
// (권장) 모바일: 50자 이내, 데스크톱: 100자 이내
export const CLUB_UNION_MEMBERS: ClubUnionMember[] = [
  {
    id: 1,
    name: '이주은',
    role: '회장',
    description: '',
    imageSrc: MEMBER_AVATARS.PRESIDENT,
  },
  {
    id: 2,
    name: '이정원',
    role: '부회장',
    description: '',
    imageSrc: MEMBER_AVATARS.VICE_PRESIDENT,
  },
  {
    id: 3,
    name: '최지현',
    role: '기획국장',
    description: '',
    imageSrc: MEMBER_AVATARS.PLANNING,
  },
  {
    id: 4,
    name: '김민서',
    role: '사무국장',
    description: '',
    imageSrc: MEMBER_AVATARS.SECRETARY,
  },
  {
    id: 5,
    name: '최동희',
    role: '홍보국장',
    description: '',
    imageSrc: MEMBER_AVATARS.PROMOTION,
  },
  {
    id: 6,
    name: '전호진',
    role: '봉사분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.VOLUNTEER,
  },
  {
    id: 7,
    name: '신가윤',
    role: '종교분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.RELIGION,
  },
  {
    id: 8,
    name: '정상윤',
    role: '취미교양분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.HOBBY,
  },
  {
    id: 9,
    name: '김은새',
    role: '학술분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.STUDY,
  },
  {
    id: 10,
    name: '권민준',
    role: '공연1분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.PERFORMANCE,
  },
  {
    id: 11,
    name: '곽현우',
    role: '공연2분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.PERFORMANCE,
  },
  {
    id: 12,
    name: '김민제',
    role: '운동1분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.SPORT,
  },
  {
    id: 13,
    name: '이상재',
    role: '운동2분과장',
    description: '',
    imageSrc: MEMBER_AVATARS.SPORT,
  },
];
