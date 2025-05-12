import { clubHandlers } from './apply';
import { setupServer } from 'msw/node';
import { Question } from '../data/mockData';

const server = setupServer(...clubHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MSW 클럽 핸들러 테스트 (fetch)', () => {
  it('클럽 지원서 API 테스트 (정상 요청)', async () => {
    const response = await fetch('http://localhost/api/club/123/apply');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.clubId).toBe(123);
    expect(data.questions).toBeDefined();
    expect(data.questions.length).toBeGreaterThan(0);
  });

  it('클럽 지원서 이름이 있어야 한다.', async () => {
    const response = await fetch('http://localhost/api/club/123/apply');
    const data = await response.json();

    expect(data.form_title).toBeDefined();
  });

  it('지원서 제목이 20자 이하여야 한다.', async () => {
    const response = await fetch('http://localhost/api/club/123/apply');
    const data = await response.json();

    expect(data.form_title.length).toBeLessThanOrEqual(20);
  });

  it('필수 질문이라면 항목이 비어있지 않아야 한다.', async () => {
    const response = await fetch('http://localhost/api/club/123/apply');
    const data = await response.json();

    data.questions.forEach((question: Question) => {
      if (question.options.required) {
        expect(question.items).toBeDefined();
        expect(question.items?.length).toBeGreaterThan(0);
      }
    });
  });

  describe('에러 케이스', () => {
    it('잘못된 형식의 클럽 ID로 요청 시 400 에러를 반환한다.', async () => {
      const response = await fetch('http://localhost/api/club/abc/apply');
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('유효하지 않은 클럽 ID입니다.');
    });

    it('클럽 ID 누락 시 400 에러를 반환한다.', async () => {
      const response = await fetch('http://localhost/api/club/apply');
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('유효하지 않은 클럽 ID입니다.');
    });
  });

  describe('클럽 지원서 보내기 API 테스트', () => {
    it('지원서 제출 성공', async () => {
      const response = await fetch('http://localhost/api/club/123/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '1': ['답변1', '답변2'],
          '2': ['답변3'],
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.clubId).toBe(123);
      expect(data.message).toBe('지원서가 성공적으로 제출되었습니다.');
      expect(data.submittedAt).toBeDefined();
    });

    it('잘못된 클럽 ID로 요청 시 400 에러', async () => {
      const response = await fetch('http://localhost/api/club/abc/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '1': ['답변1'],
          '2': ['답변2'],
        }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('유효하지 않은 클럽 ID입니다.');
    });
  });
});
