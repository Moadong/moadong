import { http, HttpResponse } from 'msw';

const MOCK_CLUB_ID = 'mock-club-id';

const ok = <T>(data: T) =>
  HttpResponse.json({
    statuscode: '200',
    message: 'ok',
    data,
  });

const buildTrendPoints = () => [
  {
    date: '2026-07-03',
    detailViews: 12,
    averageDetailDurationSeconds: 31,
    applicants: 1,
  },
  {
    date: '2026-07-04',
    detailViews: 18,
    averageDetailDurationSeconds: 44,
    applicants: 3,
  },
  {
    date: '2026-07-05',
    detailViews: 21,
    averageDetailDurationSeconds: 39,
    applicants: 2,
  },
  {
    date: '2026-07-06',
    detailViews: 17,
    averageDetailDurationSeconds: 52,
    applicants: 4,
  },
  {
    date: '2026-07-07',
    detailViews: 25,
    averageDetailDurationSeconds: 48,
    applicants: 3,
  },
  {
    date: '2026-07-08',
    detailViews: 16,
    averageDetailDurationSeconds: 36,
    applicants: 1,
  },
  {
    date: '2026-07-09',
    detailViews: 19,
    averageDetailDurationSeconds: 50,
    applicants: 3,
  },
];

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

    return ok({
      clubId: MOCK_CLUB_ID,
      clubName: '모아동 밴드',
      from,
      to,
      totalDetailViews: 128,
      averageDetailDurationSeconds: 43,
      totalApplicants: 17,
    });
  }),

  http.get('/api/club/statistics/trend', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from') ?? '2026-07-03';
    const to = url.searchParams.get('to') ?? '2026-07-09';

    return ok({
      clubId: MOCK_CLUB_ID,
      from,
      to,
      points: buildTrendPoints(),
    });
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
