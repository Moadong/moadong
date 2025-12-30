import { ClubApiResponse } from '@/types/club';

export const mockClubApi: ClubApiResponse = {
  id: '67ee2b97b35e3c267e3c2485',
  name: 'RCY',
  logo: '/src/assets/images/logos/default_profile_image.svg',
  cover: '/src/assets/images/banners/banner_desktop1.png',
  tags: ['', ''],
  state: '활성화',
  introduction: '부산 RCY 대학생 봉사단',
  description: {
    introDescription: '부경대학교 어쩌고 저쩌고',
    activityDescription:
      '분야, 주제, 개발환경 등을 자율적으로 선택하여 한 학기 동안 팀원들과 프로젝트를 진행하고, 결과물을 제작해 발표 및 전시하는 활동을 합니다.',
    awards: [
      {
        semester: '2025 1학기',
        achievements: [
          '교내 프로그래밍 경진대회 대상, 최우수상, 장려상 배출',
          '2024 라이프 스타일 스마트 가전 메이커톤 대상',
        ],
      },
    ],
    idealCandidate: {
      tags: ['열정적인', '노력하는'],
      content:
        '이런 사람이 오면 좋아요, 열정적이고 협업을 중시하는 분들을 환영합니다.',
    },
    benefits:
      '협업하며 프로젝트를 진행하고,\n직접 결과물을 만들어 개발 경험을 쌓을 수 있습니다.',
    faqs: [],
  },
  recruitmentPeriod: '2025.08.04 15:00 ~ 2999.01.02 15:00',
  recruitmentStatus: 'OPEN',
  externalApplicationUrl: 'https://open.kakao.com/o/sBjU8ZKh',
  socialLinks: {
    instagram: 'https://www.instagram.com/pknu_rcy_official',
    youtube: 'https://www.youtube.com/pknu_rcy_official',
    x: '',
  },
  category: '봉사',
  division: '중동',
};
