import { http, HttpResponse } from 'msw';
import { PromotionArticle } from '@/types/promotion';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Mock 데이터
export const mockPromotionArticles: PromotionArticle[] = [
  {
    clubName: '모각코 동아리',
    clubId: 'club-1',
    title: '2024 봄 신입 부원 모집',
    location: '서울 강남구',
    eventStartDate: '2024-03-01',
    eventEndDate: '2024-03-31',
    description: '함께 성장하는 개발자 커뮤니티에 참여하세요!',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    ],
  },
  {
    clubName: '디자인 스터디',
    clubId: 'club-2',
    title: 'UI/UX 디자인 워크샵',
    location: null,
    eventStartDate: '2024-04-15',
    eventEndDate: '2024-04-20',
    description: '실무 디자이너와 함께하는 5일간의 집중 워크샵',
    images: [],
  },
  {
    clubName: '창업 동아리',
    clubId: 'club-3',
    title: '스타트업 데모데이',
    location: '부산 해운대구',
    eventStartDate: '2024-05-10',
    eventEndDate: '2024-05-10',
    description: '학생 창업팀의 아이디어를 공유하는 자리',
    images: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      'https://images.unsplash.com/photo-2540575467063-178a50c2df87?w=800',
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
  http.post(`${API_BASE_URL}/api/promotion`, async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      data: {
        id: `article-${Date.now()}`,
        message: '홍보글이 성공적으로 등록되었습니다.',
      },
    });
  }),
];
