import { clubHandlers } from './apply';
import { setupServer } from 'msw/node';
import { Question } from '../data/mockData';
import { API_BASE } from '../constants/api';

const createApiUrl = (clubId: string | number, action: string = 'apply') => {
  return clubId ? `${API_BASE}/${clubId}/${action}` : `${API_BASE}/${action}`;
};
interface ClubApplyResponse {
  clubId: number;
  form_title: string;
  questions: Question[];
}

interface ApiErrorResponse {
  message: string;
}

interface SubmissionResponse {
  clubId: number;
  message: string;
  submittedAt: string;
}

const server = setupServer(...clubHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('동아리 지원서 API 테스트', () => {
  let response: Response;
  let data: ClubApplyResponse | ApiErrorResponse;

  describe('지원서 GET 테스트', () => {
    beforeEach(async () => {
      response = await fetch(createApiUrl(123));
      data = await response.json();
    });

    it('클럽 지원서를 정상적으로 불러온다.', () => {
      expect(response.status).toBe(200);
      expect((data as ClubApplyResponse).clubId).toBe(123);
      expect((data as ClubApplyResponse).form_title).toBeDefined();
      expect((data as ClubApplyResponse).questions.length).toBeGreaterThan(0);
    });

    it('지원서 제목은 20자 이하이다.', () => {
      expect((data as ClubApplyResponse).form_title.length).toBeLessThanOrEqual(
        20,
      );
    });

    it('필수 질문의 항목이 비어있지 않아야 한다.', () => {
      (data as ClubApplyResponse).questions.forEach((question: Question) => {
        if (question.options?.required) {
          expect(question.items).toBeDefined();
          expect(question.items?.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('지원서 GET 에러 케이스', () => {
    it('잘못된 형식의 클럽 ID로 요청 시 400 에러를 반환한다.', async () => {
      const response = await fetch(createApiUrl('abc'));
      const data: ApiErrorResponse = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain('유효하지 않은 클럽 ID입니다.');
    });

    it('클럽 ID 누락 시 에러 발생시킨다.', async () => {
      const response = await fetch(createApiUrl(''));
      const data: ApiErrorResponse = await response.json();
      console.log(data);

      expect(response.status).toBe(400);
      expect(data.message).toContain('유효하지 않은 클럽 ID입니다.');
    });
  });

  describe('클럽 지원서 POST 테스트', () => {
    it('지원서 제출 성공', async () => {
      const response = await fetch(createApiUrl(123), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '1': ['답변1', '답변2'],
          '2': ['답변3'],
        }),
      });

      const data: SubmissionResponse = await response.json();
      expect(response.status).toBe(201);
      expect(data.clubId).toBe(123);
      expect(data.message).toBe('지원서가 성공적으로 제출되었습니다.');
      expect(data.submittedAt).toBeDefined();
    });

    it('잘못된 클럽 ID로 요청 시 400 에러', async () => {
      const response = await fetch(createApiUrl('abc'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '1': ['답변1'],
          '2': ['답변2'],
        }),
      });

      const data: ApiErrorResponse = await response.json();
      expect(response.status).toBe(400);
      expect(data.message).toContain('유효하지 않은 클럽 ID');
    });
  });
});
