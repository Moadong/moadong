import { http, HttpResponse, passthrough } from 'msw';
import type { CreateFeedbackRequest } from '@/types/feedback';
import {
  receivedLetterDetailsMock,
  receivedLettersMock,
  sentFeedbacksMock,
} from '../data/feedbackMock';

const MOCK_CLUB_ID = 'mock-club-id';
const MOCK_R2_ORIGIN = 'https://mock-r2.moadong.local';

const ok = <T>(data: T) =>
  HttpResponse.json({
    statuscode: '200',
    message: 'ok',
    data,
  });

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const dateKeyToUtcDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const buildTrendPoints = (from: string, to: string) => {
  const start = dateKeyToUtcDate(from);
  const end = dateKeyToUtcDate(to);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const points = [];
  for (
    const date = new Date(start);
    date.getTime() <= end.getTime();
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const day = date.getUTCDate();
    points.push({
      date: toDateKey(date),
      detailViews: 10 + ((day * 7) % 18),
      averageDetailDurationSeconds: 30 + ((day * 5) % 25),
      applicants: (day % 5) + 1,
    });
  }

  return points;
};

// 모든 MSW 핸들러를 여기에 통합
export const handlers = [
  http.post('/auth/user/find/club', () => ok({ clubId: MOCK_CLUB_ID })),

  http.post('/auth/user/login', () =>
    ok({
      accessToken: 'mock-access-token',
      clubId: MOCK_CLUB_ID,
      allowedPersonalInformation: true,
    }),
  ),

  http.post('/auth/user/refresh', () =>
    ok({
      accessToken: 'mock-access-token',
    }),
  ),

  http.put('/auth/user/allow/personal-information', () => ok(null)),

  http.get('/auth/user/logout', () => ok(null)),

  http.put('/auth/user/', () => ok(null)),

  // 우체통용 익명 학생 토큰. 실제로도 만료가 없는 JWT를 준다
  http.post('/auth/student', () => ok({ accessToken: 'mock-student-token' })),

  // '/api/club/:clubId'가 목록 엔드포인트(/api/club/search/)까지 매칭해 버리므로 먼저 실제 API로 흘려보낸다
  http.get('/api/club/search/', () => passthrough()),

  http.get('/api/club/:clubId', ({ params }) =>
    ok({
      club: {
        id: params.clubId,
        name: '모아동 밴드',
        logo: '',
        cover: '',
        tags: ['공연', '밴드'],
        recruitmentStatus: 'OPEN',
        division: '중앙동아리',
        category: '공연',
        introduction: '함께 무대를 만드는 밴드 동아리',
        description: {
          introDescription: '음악을 좋아하는 사람들이 모여 공연을 준비합니다.',
          activityDescription: '정기 합주와 교내외 공연을 진행합니다.',
          awards: [],
          idealCandidate: {
            tags: ['성실함', '협업'],
            content: '합주에 꾸준히 참여할 수 있는 분',
          },
          benefits: '',
          faqs: [],
        },
        state: 'OPEN',
        feeds: [],
        presidentName: '홍길동',
        presidentPhoneNumber: '010-0000-0000',
        recruitmentForm: '',
        recruitmentStart: '2026-07-01T00:00:00',
        recruitmentEnd: '2026-07-31T23:59:59',
        recruitmentTarget: '전학년',
        externalApplicationUrl: '',
        socialLinks: {
          instagram: '',
          youtube: '',
          x: '',
        },
        hasCalendarConnection: false,
      },
    }),
  ),

  http.get('/api/club/statistics/overview', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') ?? '2026-07-03';
    const to = url.searchParams.get('to') ?? '2026-07-09';
    const points = buildTrendPoints(from, to);

    return ok({
      clubId: MOCK_CLUB_ID,
      clubName: '모아동 밴드',
      from,
      to,
      totalDetailViews: points.reduce(
        (sum, point) => sum + point.detailViews,
        0,
      ),
      averageDetailDurationSeconds: 43,
      uniqueDetailVisitors: 38,
      averageDetailDurationSecondsPerVisitor: 74,
      totalApplicants: points.reduce((sum, point) => sum + point.applicants, 0),
    });
  }),

  http.post(
    '/api/analytics/club-detail/duration',
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get('/api/club/statistics/trend', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') ?? '2026-07-03';
    const to = url.searchParams.get('to') ?? '2026-07-09';

    return ok({
      clubId: MOCK_CLUB_ID,
      from,
      to,
      points: buildTrendPoints(from, to),
    });
  }),

  http.post('/api/student/feedback', async ({ request }) => {
    const payload = (await request.json()) as CreateFeedbackRequest;
    const feedbackId = `feedback-${sentFeedbacksMock.length + 1}`;

    // 보낸 편지 탭에서 방금 보낸 편지가 보이도록 목 데이터에 쌓아둔다
    sentFeedbacksMock.unshift({
      id: feedbackId,
      type: payload.type,
      content: payload.content,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    return ok({ feedbackId });
  }),

  http.post('/api/student/feedback/images/upload-url', async ({ request }) => {
    const uploadRequests = (await request.json()) as {
      fileName: string;
      contentType: string;
    }[];

    return ok(
      uploadRequests.map((item, index) => ({
        presignedUrl: `${MOCK_R2_ORIGIN}/upload/${index}-${item.fileName}`,
        finalUrl: `${MOCK_R2_ORIGIN}/feedback/mock-student/${index}-${item.fileName}`,
        requiredHeaders: { 'Content-Type': item.contentType },
        success: true,
        failureReason: null,
      })),
    );
  }),

  // presigned URL로 직접 올리는 단계. 실제로는 R2가 받는다
  http.put(
    `${MOCK_R2_ORIGIN}/upload/*`,
    () => new HttpResponse(null, { status: 200 }),
  ),

  http.get('/api/student/feedback/received', ({ request }) => {
    const category = new URL(request.url).searchParams.get('category');
    const letters = category
      ? receivedLettersMock.filter((letter) => letter.category === category)
      : receivedLettersMock;

    return ok({ letters });
  }),

  http.get('/api/student/feedback/received/:letterId', ({ params }) => {
    const letter = receivedLetterDetailsMock[String(params.letterId)];

    if (!letter) {
      return HttpResponse.json(
        { statuscode: '404', message: 'not found', data: null },
        { status: 404 },
      );
    }

    return ok(letter);
  }),

  http.patch('/api/student/feedback/received/:letterId/read', ({ params }) => {
    const letter = receivedLettersMock.find(
      (item) => item.id === String(params.letterId),
    );

    if (letter) letter.isRead = true;

    return ok(null);
  }),

  http.get('/api/student/feedback/sent', () =>
    ok({ feedbacks: sentFeedbacksMock }),
  ),

  http.get('/api/student/feedback/sent/:feedbackId', ({ params }) => {
    const feedback = sentFeedbacksMock.find(
      (item) => item.id === String(params.feedbackId),
    );

    if (!feedback) {
      return HttpResponse.json(
        { statuscode: '404', message: 'not found', data: null },
        { status: 404 },
      );
    }

    return ok(feedback);
  }),

  http.get('/api/club/statistics/search-keywords', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') ?? '2026-07-03';
    const to = url.searchParams.get('to') ?? '2026-07-09';

    return ok({
      from,
      to,
      keywords: [
        { keyword: '밴드', count: 34 },
        { keyword: '공연', count: 23 },
        { keyword: '보컬', count: 18 },
        { keyword: '기타', count: 14 },
        { keyword: '드럼', count: 9 },
      ],
    });
  }),
];
