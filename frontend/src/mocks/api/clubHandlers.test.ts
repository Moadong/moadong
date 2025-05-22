import { clubHandlers } from './apply';
import { setupServer } from 'msw/node';
import { Question } from '../data/mockData';
import { createApiUrl } from '../utils/createApiUrl';
import { API_BASE, CLUB_ID } from '../constants/clubApi';
import { ERROR_MESSAGE } from '../constants/error';
import { submitApplication, updateApplication } from './utils/request';

interface ClubApplyResponse {
  clubId: string;
  form_title: string;
  questions: Question[];
}

interface ApiErrorResponse {
  message: string;
}

interface SubmissionResponse {
  clubId: string;
  message: string;
}

const server = setupServer(...clubHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('동아리 지원서 API 테스트', () => {
  describe('지원서 GET 테스트', () => {
    let response: Response;
    let data: ClubApplyResponse | ApiErrorResponse;

    beforeEach(async () => {
      response = await fetch(createApiUrl(CLUB_ID));
      data = await response.json();
    });

    it('클럽 지원서를 정상적으로 불러온다.', () => {
      expect(response.status).toBe(200);
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
      const response = await fetch(`${API_BASE}/invalid-id/apply`);
      const data: ApiErrorResponse = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain(ERROR_MESSAGE.INVALID_CLUB_ID);
    });
  });

  describe('클럽 지원서 POST 테스트', () => {
    it('지원서 제작 성공', async () => {
      const answers = {
        '1': ['답변1', '답변2'],
        '2': ['답변3'],
      };

      const response = await submitApplication(CLUB_ID, answers);
      const data: SubmissionResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe(ERROR_MESSAGE.POST_APPLICATION_SUCCESS);
    });

    it('객관식 질문 답변 제출 성공', async () => {
      const answers = {
        1: ['선택 1번입니다'],
        99: ['선택 1번입니다', '선택 2번입니다'],
      };

      const response = await submitApplication(CLUB_ID, answers);
      const data: SubmissionResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe(ERROR_MESSAGE.POST_APPLICATION_SUCCESS);
    });

    it('주관식 질문 답변 제출 성공', async () => {
      const answers = {
        101: ['주관식 단답형 답변입니다'],
        103: ['주관식 서술형 답변입니다. 자세한 내용을 작성합니다.'],
        104: ['test@example.com'],
        105: ['010-1234-5678'],
        106: ['홍길동'],
      };

      const response = await submitApplication(CLUB_ID, answers);
      const data: SubmissionResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe(ERROR_MESSAGE.POST_APPLICATION_SUCCESS);
    });

    it('잘못된 클럽 ID로 요청 시 400 에러', async () => {
      const response = await fetch(`${API_BASE}/invalid-id/apply`, {
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
      expect(data.message).toContain(ERROR_MESSAGE.INVALID_CLUB_ID);
    });
  });

  describe('클럽 지원서 PUT 테스트', () => {
    it('지원서 수정 성공', async () => {
      const answers = {
        '1': ['수정된 답변1', '수정된 답변2'],
        '2': ['수정된 답변3'],
      };

      const response = await updateApplication(CLUB_ID, answers);
      const data: SubmissionResponse = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe(ERROR_MESSAGE.PUT_APPLICATION_SUCCESS);
    });

    it('잘못된 클럽 ID로 수정 요청 시 400 에러', async () => {
      const response = await fetch(`${API_BASE}/invalid-id/apply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '1': ['수정된 답변1'],
          '2': ['수정된 답변2'],
        }),
      });

      const data: ApiErrorResponse = await response.json();
      expect(response.status).toBe(400);
      expect(data.message).toContain(ERROR_MESSAGE.INVALID_CLUB_ID);
    });
  });
});
