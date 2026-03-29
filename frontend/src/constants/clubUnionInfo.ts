import { inactiveCategoryIcons } from '@/assets/images/icons/category_button';

export interface ClubUnionMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageSrc: string;
  type: keyof typeof MEMBER_AVATARS;
}

const MEMBER_AVATARS = {
  PRESIDENT: inactiveCategoryIcons.representative,
  VICE_PRESIDENT: inactiveCategoryIcons.representative,
  PLANNING: inactiveCategoryIcons.representative,
  SECRETARY: inactiveCategoryIcons.representative,
  PROMOTION: inactiveCategoryIcons.representative,
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
// (권장) 데스크톱: 30자 이내
export const CLUB_UNION_MEMBERS: ClubUnionMember[] = [
  {
    id: 1,
    name: '이주은',
    role: '회장',
    description: '모두가 바라는 미래가 이루어질 수 있도록 노력하겠습니다.',
    imageSrc: MEMBER_AVATARS.PRESIDENT,
    type: 'PRESIDENT',
  },
  {
    id: 2,
    name: '이정원',
    role: '부회장',
    description: '동아리가 한 해동안 잘 운영될 수 있도록 노력하겠습니다.',
    imageSrc: MEMBER_AVATARS.VICE_PRESIDENT,
    type: 'VICE_PRESIDENT',
  },
  {
    id: 3,
    name: '최지현',
    role: '기획국장',
    description:
      '동아리의 바램이 이루어지도록 질 높은 행사를 만들어가겠습니다.',
    imageSrc: MEMBER_AVATARS.PLANNING,
    type: 'PLANNING',
  },
  {
    id: 4,
    name: '김민서',
    role: '사무국장',
    description: '작은 바람이 모여 우리가 될 수 있도록, 함께 하겠습니다.',
    imageSrc: MEMBER_AVATARS.SECRETARY,
    type: 'SECRETARY',
  },
  {
    id: 5,
    name: '최동희',
    role: '홍보국장',
    description:
      '모두가 바라는 대로, 즐거운 동아리 활동에 앞장서 노력하겠습니다.',
    imageSrc: MEMBER_AVATARS.PROMOTION,
    type: 'PROMOTION',
  },
  {
    id: 6,
    name: '전호진',
    role: '봉사분과장',
    description:
      '나눔은 나눌수록 배가 됩니다. 작은 나눔을 통해 삶의 따스함을 느낍시다.',
    imageSrc: MEMBER_AVATARS.VOLUNTEER,
    type: 'VOLUNTEER',
  },
  {
    id: 7,
    name: '신가윤',
    role: '종교분과장',
    description: '여러분의 소원이 현실이 되도록, 열심히 하겠습니다.',
    imageSrc: MEMBER_AVATARS.RELIGION,
    type: 'RELIGION',
  },
  {
    id: 8,
    name: '정상윤',
    role: '취미교양분과장',
    description: '목소리에 귀 기울이며, 바라는 방향으로 함께 나아가겠습니다.',
    imageSrc: MEMBER_AVATARS.HOBBY,
    type: 'HOBBY',
  },
  {
    id: 9,
    name: '김은새',
    role: '학술분과장',
    description: '기대에 부응할 수 있도록, 책임감 있게 움직이겠습니다.',
    imageSrc: MEMBER_AVATARS.STUDY,
    type: 'STUDY',
  },
  {
    id: 10,
    name: '김민제',
    role: '운동1분과장',
    description: '동아리의 연결과 성장을 이끄는 we:sh가 함께하겠습니다.',
    imageSrc: MEMBER_AVATARS.SPORT,
    type: 'SPORT',
  },
  {
    id: 11,
    name: '이상재',
    role: '운동2분과장',
    description: '여러분이 바라는 대로, 원하는 대로 열심히 하겠습니다.',
    imageSrc: MEMBER_AVATARS.SPORT,
    type: 'SPORT',
  },
  {
    id: 12,
    name: '권민준',
    role: '공연1분과장',
    description:
      '많은 학우분들이 공연과 다양한 볼거리를 즐길 수 있도록 노력하겠습니다.',
    imageSrc: MEMBER_AVATARS.PERFORMANCE,
    type: 'PERFORMANCE',
  },
  {
    id: 13,
    name: '곽현우',
    role: '공연2분과장',
    description: '여러분들의 즐거운 동아리 생활을 위해 열심히 노력하겠습니다.',
    imageSrc: MEMBER_AVATARS.PERFORMANCE,
    type: 'PERFORMANCE',
  },
];
