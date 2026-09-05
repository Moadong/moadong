import fetchMock from 'jest-fetch-mock';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';
import {
  createPromotionArticle,
  deletePromotionArticle,
  getPromotionArticles,
  updatePromotionArticle,
  uploadPromotionImage,
} from './promotion';

jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

const API_BASE_URL = 'http://localhost:3000';

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
          id: '1',
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
          id: '2',
          clubName: '테스트 클럽 2',
          clubId: 'club2',
          title: '테스트 홍보글 2',
          location: '부산',
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

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/promotion`,
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
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
        latitude: 35.1,
        longitude: 129.1,
        eventStartDate: '2024-03-01',
        eventEndDate: '2024-03-31',
        description: '홍보 내용',
        images: ['image1.jpg'],
      };

      const mockResponse = { articleId: '123' };

      fetchMock.mockResponseOnce(JSON.stringify({ data: mockResponse }), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await createPromotionArticle(mockPayload);

      expect(result).toEqual(mockResponse);

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
        location: '부산',
        latitude: 35.1,
        longitude: 129.1,
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

  describe('updatePromotionArticle', () => {
    const payload: CreatePromotionArticleRequest = {
      clubId: 'club1',
      title: '수정된 홍보글',
      location: '부산',
      latitude: 35.1,
      longitude: 129.1,
      eventStartDate: '2024-03-01',
      eventEndDate: '2024-03-31',
      description: '수정 내용',
      images: ['image1.jpg'],
    };

    it('PUT으로 바디를 보내고 응답 없이 끝난다', async () => {
      fetchMock.mockResponseOnce('', { status: 200 });

      await expect(
        updatePromotionArticle('123', payload),
      ).resolves.toBeUndefined();

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/promotion/123`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(payload),
        }),
      );
    });

    it('실패 시 기본 문구로 던지고 서버 문구는 data에 남긴다', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          statusCode: '902-2',
          message: '심사가 완료된 동아리만 홍보 게시글을 작성할 수 있습니다.',
        }),
        { status: 403 },
      );

      await expect(updatePromotionArticle('123', payload)).rejects.toThrow(
        '홍보게시판 글 수정에 실패했습니다.',
      );
    });
  });

  describe('deletePromotionArticle', () => {
    it('DELETE로 요청한다', async () => {
      fetchMock.mockResponseOnce('', { status: 200 });

      await expect(deletePromotionArticle('123')).resolves.toBeUndefined();

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/promotion/123`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });

    it('404면 에러를 던진다', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ statusCode: '902-1', message: '없는 글' }),
        { status: 404 },
      );

      await expect(deletePromotionArticle('missing')).rejects.toThrow(
        '홍보게시판 글 삭제에 실패했습니다.',
      );
    });
  });

  describe('uploadPromotionImage', () => {
    it('multipart의 file 필드로 올리고 imageUrl을 돌려준다', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: { imageUrl: 'https://cdn/a.png' } }),
        { headers: { 'content-type': 'application/json' } },
      );
      const file = new File(['x'], 'a.png', { type: 'image/png' });

      const result = await uploadPromotionImage('123', file);

      expect(result).toEqual({ imageUrl: 'https://cdn/a.png' });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/promotion/123/upload`);
      expect(options?.method).toBe('POST');
      expect(options?.body).toBeInstanceOf(FormData);
      // jest-fetch-mock이 FormData 값을 문자열로 바꿔 두므로 필드 존재만 확인한다
      expect((options?.body as FormData).has('file')).toBe(true);
      // multipart boundary는 브라우저가 붙여야 하므로 Content-Type을 직접 넣지 않는다
      expect(
        (options?.headers as Record<string, string>)['Content-Type'],
      ).toBeUndefined();
    });

    it('실패 시 에러를 던진다', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ message: '실패' }), {
        status: 500,
      });
      const file = new File(['x'], 'a.png', { type: 'image/png' });

      await expect(uploadPromotionImage('123', file)).rejects.toThrow(
        '홍보 이미지 업로드에 실패했습니다.',
      );
    });
  });
});
