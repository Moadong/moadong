import { PromotionArticle } from '@/types/promotion';

export const dummyPromotionArticles: PromotionArticle[] = [
  {
    clubName: '백경미술연구회',
    clubId: 'dummy-1',
    title: 'EXODUS : 대탈출ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
    location: '부경대학교 향파관 3층',
    eventStartDate: '2026-03-05', // 진행 예정
    eventEndDate: '2026-12-31',
    description: '테스트 진행 중 행사입니다.dkkkkkkkkkkkkkkkkkkkkkkk',
    images: [
      'https://picsum.photos/800/900',
      'https://picsum.photos/800/1000',
      'https://picsum.photos/800/1100',
    ],
  },
  {
    clubName: 'WAP',
    clubId: 'dummy-2',
    title: '🔥 해커톤 모집 🔥',
    location: '온라인',
    eventStartDate: '2026-11-15',
    eventEndDate: '2026-11-15',
    description: '해커톤 테스트 행사입니다.',
    images: ['https://picsum.photos/800/1000'],
  },
  {
    clubName: '종료 테스트',
    clubId: 'dummy-3',
    title: '지난 행사',
    location: '테스트 장소',
    eventStartDate: '2023-01-01', // 종료된 행사
    eventEndDate: '2023-01-01',
    description: '이미 종료된 행사입니다.',
    images: [],
  },
];
