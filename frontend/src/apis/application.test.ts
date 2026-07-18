import fetchMock from 'jest-fetch-mock';
import { ApplicationDraft } from '@/types/application';
import { generateApplicationDraft } from './application';

jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

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

describe('generateApplicationDraft', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.setItem('accessToken', 'mock-token');
  });

  it('응답의 data 필드를 unwrap하여 초안을 반환한다', async () => {
    const draft: ApplicationDraft = {
      title: '매니아 신입 부원 모집 지원서',
      description: '안녕하세요',
      aiGenerated: true,
      questions: [
        {
          id: 1,
          title: '연락처',
          description: '연락 가능한 전화번호를 입력해주세요.',
          type: 'PHONE_NUMBER',
          options: { required: true },
          items: [],
        },
      ],
    };
    fetchMock.mockResponseOnce(JSON.stringify({ data: draft }), {
      headers: { 'content-type': 'application/json' },
    });

    const result = await generateApplicationDraft();

    expect(result).toEqual(draft);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/club/application/ai-draft',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('서버 오류 시 에러를 던진다', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'fail' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });

    await expect(generateApplicationDraft()).rejects.toThrow();
  });
});
