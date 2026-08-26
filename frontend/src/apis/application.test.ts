import fetchMock from 'jest-fetch-mock';
import { ApiError } from '@/errors';
import { AiDraftQuota, ApplicationDraft } from '@/types/application';
import { generateApplicationDraft, getAiDraftQuota } from './application';
import { secureFetch } from './auth/secureFetch';

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

  it('응답에 remaining이 포함되면 그대로 반환한다', async () => {
    const draft: ApplicationDraft = {
      title: '매니아 신입 부원 모집 지원서',
      description: '안녕하세요',
      aiGenerated: true,
      questions: [],
      remaining: 2,
    };
    fetchMock.mockResponseOnce(JSON.stringify({ data: draft }), {
      headers: { 'content-type': 'application/json' },
    });

    const result = await generateApplicationDraft();

    expect(result?.remaining).toBe(2);
  });

  it('한도 초과(429) 시 status 429를 담은 ApiError를 던진다', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        statuscode: '600-17',
        message: '이번 달 AI 초안 생성 횟수(3회)를 모두 사용했습니다.',
        data: null,
      }),
      { status: 429, headers: { 'content-type': 'application/json' } },
    );

    const error = await generateApplicationDraft().catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(429);
  });

  it('서버 오류 시 에러를 던진다', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'fail' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });

    await expect(generateApplicationDraft()).rejects.toThrow();
  });

  it('LLM 생성이 느려도 조기 abort되지 않도록 60초 타임아웃을 전달한다', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
      headers: { 'content-type': 'application/json' },
    });

    await generateApplicationDraft();

    expect(secureFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/club/application/ai-draft',
      expect.objectContaining({ method: 'POST' }),
      60_000,
    );
  });
});

describe('getAiDraftQuota', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.setItem('accessToken', 'mock-token');
  });

  it('응답의 data를 unwrap하여 남은 횟수 정보를 반환한다', async () => {
    const quota: AiDraftQuota = { limit: 3, used: 2, remaining: 1 };
    fetchMock.mockResponseOnce(JSON.stringify({ data: quota }), {
      headers: { 'content-type': 'application/json' },
    });

    const result = await getAiDraftQuota();

    expect(result).toEqual(quota);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/club/application/ai-draft/quota',
      expect.anything(),
    );
  });
});
