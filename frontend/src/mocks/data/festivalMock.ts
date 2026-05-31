import DaedongImage from '@/assets/images/popup/daedong.png';
import { PromotionArticle } from '@/types/promotion';

export const festivalMock: PromotionArticle[] = [
  {
    id: '600000000000000000000003',
    clubId: 'festival-1',
    clubName: '총동연',
    title: '🎉 동아리 소개 한마당',
    description: '부경대학교 동아리 소개 한마당이 열립니다.',
    location: '부경대학교',
    eventStartDate: '2026-03-05T11:00:00',
    eventEndDate: '2026-03-05T18:00:00',
    images: [
      'https://github.com/user-attachments/assets/42962967-a5e6-4270-9a43-6fce39b6c306',
    ],
    isFestival: true,
  },
    {
    id: '600000000000000000000004',
    clubId: 'festival-2',
    clubName: '총학생회',
    title: '🌊 2026 대동제 - 청해제 🌊',
    description: '부경대학교 축제가 열립니다.',
    location: '부경대학교 잔디광장',
    eventStartDate: '2026-05-11T19:30:00',
    eventEndDate: '2026-05-14T19:30:00',
    images: [DaedongImage],
    isFestival: true,
  },
];
