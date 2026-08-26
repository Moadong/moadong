import fetchMock from 'jest-fetch-mock';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { ReceivedLetter, SentFeedback } from '@/types/feedback';
import {
  createFeedback,
  getReceivedLetter,
  getReceivedLetters,
  getSentFeedbacks,
  markReceivedLetterAsRead,
  uploadFeedbackImages,
} from './feedback';

jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'http://localhost:3000',
}));

const API_BASE_URL = 'http://localhost:3000';
const FEEDBACK_BASE_URL = `${API_BASE_URL}/api/student/feedback`;

/** handleResponse가 content-type을 보고 파싱하므로 헤더를 반드시 붙인다 */
const mockJson = (body: unknown) =>
  fetchMock.mockResponseOnce(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
  });

describe('feedback API', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.clear();
    // 토큰이 있으면 studentFetch가 발급을 건너뛰고 바로 요청한다
    localStorage.setItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN, 'student-token');
  });

  it('학생 토큰을 Authorization 헤더로 붙인다', async () => {
    mockJson({ data: { letters: [] } });

    await getReceivedLetters();

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get('Authorization')).toBe('Bearer student-token');
  });

  it('저장된 토큰이 없으면 먼저 발급받아 저장한다', async () => {
    localStorage.clear();
    mockJson({ data: { accessToken: 'issued-token' } });
    mockJson({ data: { letters: [] } });

    await getReceivedLetters();

    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/auth/student`);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
    expect(localStorage.getItem(STORAGE_KEYS.STUDENT_ACCESS_TOKEN)).toBe(
      'issued-token',
    );

    const headers = new Headers(fetchMock.mock.calls[1][1]?.headers);
    expect(headers.get('Authorization')).toBe('Bearer issued-token');
  });

  describe('createFeedback', () => {
    it('유형과 내용을 담아 POST 한다', async () => {
      mockJson({ data: { feedbackId: 'feedback-1' } });

      const result = await createFeedback({
        type: 'FEATURE',
        content: '알림 기능이 있으면 좋겠어요.',
      });

      expect(result).toEqual({ feedbackId: 'feedback-1' });

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe(FEEDBACK_BASE_URL);
      expect(options?.method).toBe('POST');
      expect(JSON.parse(options?.body as string)).toEqual({
        type: 'FEATURE',
        content: '알림 기능이 있으면 좋겠어요.',
      });
    });
  });

  describe('uploadFeedbackImages', () => {
    const makeFile = (name: string) =>
      new File(['x'], name, { type: 'image/jpeg' });

    const presignedOf = (names: string[]) =>
      names.map((name) => ({
        presignedUrl: `https://r2.test/upload/${name}`,
        finalUrl: `https://r2.test/feedback/student-1/${name}`,
        requiredHeaders: { 'Content-Type': 'image/jpeg' },
        success: true,
        failureReason: null,
      }));

    it('presigned를 받아 업로드하고 finalUrl 배열을 반환한다', async () => {
      mockJson({ data: presignedOf(['a.jpg', 'b.jpg']) });
      fetchMock.mockResponseOnce('', { status: 200 }); // PUT a.jpg
      fetchMock.mockResponseOnce('', { status: 200 }); // PUT b.jpg

      const result = await uploadFeedbackImages([
        makeFile('a.jpg'),
        makeFile('b.jpg'),
      ]);

      expect(fetchMock.mock.calls[0][0]).toBe(
        `${FEEDBACK_BASE_URL}/images/upload-url`,
      );
      expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual([
        { fileName: 'a.jpg', contentType: 'image/jpeg' },
        { fileName: 'b.jpg', contentType: 'image/jpeg' },
      ]);

      // presigned URL로 직접 PUT 한다
      expect(fetchMock.mock.calls[1][0]).toBe('https://r2.test/upload/a.jpg');
      expect(fetchMock.mock.calls[1][1]?.method).toBe('PUT');

      // 저장에 쓰는 값은 presignedUrl이 아니라 finalUrl이다
      expect(result).toEqual([
        'https://r2.test/feedback/student-1/a.jpg',
        'https://r2.test/feedback/student-1/b.jpg',
      ]);
    });

    it('항목이 하나라도 실패하면 업로드하지 않고 에러를 던진다', async () => {
      mockJson({
        data: [
          ...presignedOf(['a.jpg']),
          {
            presignedUrl: '',
            finalUrl: '',
            success: false,
            failureReason: 'TOO_MANY_FILES',
          },
        ],
      });

      await expect(uploadFeedbackImages([makeFile('a.jpg')])).rejects.toThrow(
        'TOO_MANY_FILES',
      );

      // 발급 요청 1건뿐 — PUT은 나가지 않았다
      expect(fetchMock.mock.calls).toHaveLength(1);
    });
  });

  describe('getReceivedLetters', () => {
    const letters: ReceivedLetter[] = [
      {
        id: 'letter-1',
        category: 'REPLY',
        title: '제목',
        preview: '미리보기',
        createdAt: '2026-08-01T00:00:00.000Z',
        isRead: false,
      },
    ];

    it('분류를 넘기면 쿼리스트링으로 전달한다', async () => {
      mockJson({ data: { letters } });

      await getReceivedLetters('REPLY');

      expect(fetchMock.mock.calls[0][0]).toBe(
        `${FEEDBACK_BASE_URL}/received?category=REPLY`,
      );
    });

    it('분류가 없으면 쿼리스트링 없이 요청한다', async () => {
      mockJson({ data: { letters } });

      const result = await getReceivedLetters();

      expect(fetchMock.mock.calls[0][0]).toBe(`${FEEDBACK_BASE_URL}/received`);
      expect(result).toEqual(letters);
    });

    it('letters가 없으면 빈 배열을 반환한다', async () => {
      mockJson({ data: {} });

      expect(await getReceivedLetters()).toEqual([]);
    });
  });

  describe('getReceivedLetter', () => {
    it('편지 상세를 반환한다', async () => {
      const detail = {
        id: 'letter-1',
        category: 'REPLY' as const,
        title: '제목',
        createdAt: '2026-08-01T00:00:00.000Z',
        body: '본문',
      };
      mockJson({ data: detail });

      const result = await getReceivedLetter('letter-1');

      expect(fetchMock.mock.calls[0][0]).toBe(
        `${FEEDBACK_BASE_URL}/received/letter-1`,
      );
      expect(result).toEqual(detail);
    });
  });

  describe('markReceivedLetterAsRead', () => {
    it('읽음 처리는 PATCH로 보낸다', async () => {
      mockJson({ data: null });

      await markReceivedLetterAsRead('letter-1');

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe(`${FEEDBACK_BASE_URL}/received/letter-1/read`);
      expect(options?.method).toBe('PATCH');
    });
  });

  describe('getSentFeedbacks', () => {
    it('보낸 편지 목록을 반환한다', async () => {
      const feedbacks: SentFeedback[] = [
        {
          id: 'feedback-1',
          type: 'BUG',
          content: '버그가 있어요',
          images: [],
          status: 'PENDING',
          createdAt: '2026-08-01T00:00:00.000Z',
        },
      ];
      mockJson({ data: { feedbacks } });

      expect(await getSentFeedbacks()).toEqual(feedbacks);
    });
  });
});
