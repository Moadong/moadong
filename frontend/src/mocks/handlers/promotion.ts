import { http, HttpResponse } from 'msw';
import { PromotionArticle } from '@/types/promotion';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Mock 데이터
export const mockPromotionArticles: PromotionArticle[] = [
  {
    id: '600000000000000000000001',
    clubName: 'WAP',
    clubId: '67e54ae51cfd27718dd40bec',
    title: '💌✨WAP 최종 전시회 초대장 ✨💌',
    location: '부경대학교 동원 장보고관 1층',
    eventStartDate: '2026-03-15T13:10:00Z',
    eventEndDate: '2026-03-16T13:10:00Z',
    description:
      'WAP 최종 전시회에 여러분을 초대합니다! \n\n이번 전시회에서는 WAP 팀이 한 학기 동안 열심히 준비한 프로젝트들을 선보입니다. 다양한 작품과 아이디어가 가득한 이번 전시회에서 여러분의 많은 관심과 참여 부탁드립니다! 🙌\n\n#WAP #최종전시회 #부경대학교',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    ],
  },
  {
    id: '600000000000000000000002',
    clubName: 'WAP',
    clubId: '67e54ae51cfd27718dd40bec',
    title: 'WAP 최종 전시회 초대장',
    location: '부경대학교 동원 장보고관 1층',
    eventStartDate: '2026-05-06T06:30:00Z',
    eventEndDate: '2026-05-06T07:30:00Z',
    description:
      'WAP 최종 전시회에 여러분을 초대합니다! \n\n이번 전시회에서는 WAP 팀이 한 학기 동안 열심히 준비한 프로젝트들을 선보입니다. 다양한 작품과 아이디어가 가득한 이번 전시회에서 여러분의 많은 관심과 참여 부탁드립니다! 🙌\n\n#WAP #최종전시회 #부경대학교',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    ],
  },
];

// MSW 핸들러
export const promotionHandlers = [
  // GET /api/promotion - 홍보게시판 목록 조회
  http.get(`${API_BASE_URL}/api/promotion`, () => {
    return HttpResponse.json({
      articles: mockPromotionArticles,
    });
  }),

  // POST /api/promotion - 홍보게시판 글 작성
  http.post(`${API_BASE_URL}/api/promotion`, () => {
    return HttpResponse.json({
      data: {
        id: `article-${Date.now()}`,
        message: '홍보글이 성공적으로 등록되었습니다.',
      },
    });
  }),
];
