import fetchMock from 'jest-fetch-mock';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';
import { createPromotionArticle, getPromotionArticles } from './promotion';

jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

const API_BASE_URL = 'http://localhost:3000';

// Mock secureFetch
jest.mock('./auth/secureFetch', () => ({
  secureFetch: jest.fn((url: string, options?: RequestInit) => {
    const token = localStorage.getItem('accessToken');
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  }),
}));

describe('promotion API', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.setItem('accessToken', 'mock-token');
  });

  describe('getPromotionArticles', () => {
    it('API 응답을 올바르게 파싱하여 반환한다', async () => {
      const mockArticles: PromotionArticle[] = [
        {
          clubName: '테스트 클럽 1',
          clubId: 'club1',
          title: '테스트 홍보글 1',
          location: '서울',
          eventStartDate: '2024-01-01',
          eventEndDate: '2024-01-31',
          description: '설명 1',
          images: ['image1.jpg'],
        },
        {
          clubName: '테스트 클럽 2',
          clubId: 'club2',
          title: '테스트 홍보글 2',
          location: null,
          eventStartDate: '2024-02-01',
          eventEndDate: '2024-02-28',
          description: '설명 2',
          images: [],
        },
      ];

      fetchMock.mockResponseOnce(JSON.stringify({ articles: mockArticles }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

      const result = await getPromotionArticles();

      expect(result).toEqual(mockArticles);
      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/api/promotion`);
    });

    it('articles 필드가 없으면 빈 배열을 반환한다', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await getPromotionArticles();

      expect(result).toEqual([]);
    });

    it('빈 배열 응답을 올바르게 처리한다', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ articles: [] }), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await getPromotionArticles();

      expect(result).toEqual([]);
    });

    it('API 호출 실패 시 적절한 에러를 던진다', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: 'Internal Server Error' }),
        { status: 500 },
      );

      await expect(getPromotionArticles()).rejects.toThrow(
        '홍보게시판 목록을 불러오는데 실패했습니다.',
      );
    });
  });

  describe('createPromotionArticle', () => {
    it('요청 데이터를 전송하고 응답을 반환한다', async () => {
      const mockPayload: CreatePromotionArticleRequest = {
        clubId: 'club1',
        title: '새로운 홍보글',
        location: '서울',
        eventStartDate: '2024-03-01',
        eventEndDate: '2024-03-31',
        description: '홍보 내용',
        images: ['image1.jpg'],
      };

      const mockResponse = {
        id: '123',
        message: '생성 성공',
      };

      fetchMock.mockResponseOnce(JSON.stringify({ data: mockResponse }), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await createPromotionArticle(mockPayload);

      expect(result).toEqual(mockResponse);
      // 올바른 URL과 메서드로 호출되었는지 확인
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/promotion`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockPayload),
        }),
      );
    });

    it('API 호출 실패 시 적절한 에러를 던진다', async () => {
      const mockPayload: CreatePromotionArticleRequest = {
        clubId: 'club1',
        title: '새로운 홍보글',
        location: null,
        eventStartDate: '2024-03-01',
        eventEndDate: '2024-03-31',
        description: '홍보 내용',
        images: [],
      };

      fetchMock.mockResponseOnce(JSON.stringify({ message: 'Bad Request' }), {
        status: 400,
      });

      await expect(createPromotionArticle(mockPayload)).rejects.toThrow(
        '홍보게시판 글 추가에 실패했습니다.',
      );
    });
  });
});
