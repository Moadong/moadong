// 소개 페이지 쇼케이스에서 실제 학생·관리자 컴포넌트에 넣는 목업 데이터
import { addDays, format, startOfMonth, subDays } from 'date-fns';
import { inactiveCategoryIcons } from '@/assets/images/icons/category_button';
import { ApplicationStatus } from '@/types/applicants';
import type { Applicant, ApplicantsInfo } from '@/types/applicants';
import type { Question } from '@/types/application';
import { asApplicantId, asApplicationFormId } from '@/types/branded';
import type { ClubCalendarEvent, SNSPlatform } from '@/types/club';
import type { PromotionArticle } from '@/types/promotion';
import type {
  ClubStatisticsOverview,
  ClubStatisticsTrend,
} from '@/types/statistics';

const DATE = 'yyyy-MM-dd';

// 캘린더는 이번 달을 보여주므로 일정도 이번 달 기준으로 만든다
const monthStart = startOfMonth(new Date());
const dayOfMonth = (day: number) => format(addDays(monthStart, day - 1), DATE);

export const MOCK_CLUB_PROFILE = {
  clubId: 'moadong-intro',
  name: '모아밴드',
  logo: inactiveCategoryIcons.performance,
  category: '공연',
  recruitmentStatus: 'OPEN',
  socialLinks: {
    instagram: 'https://www.instagram.com/moaband',
    youtube: '',
    x: '',
  } as Record<SNSPlatform, string>,
  introDescription:
    '음악을 좋아하는 누구나 함께하는 밴드 동아리예요. 매주 합주하고, 학기마다 정기공연을 열어요.',
};

export const MOCK_CALENDAR_EVENTS: ClubCalendarEvent[] = [
  {
    id: 'e1',
    title: '정기 모임',
    start: dayOfMonth(4),
    source: 'GOOGLE',
    color: 'BLUE',
  },
  {
    id: 'e2',
    title: '신입 환영회',
    start: dayOfMonth(9),
    source: 'CUSTOM',
    color: 'PINK',
  },
  {
    id: 'e3',
    title: '공연 연습',
    start: dayOfMonth(13),
    end: dayOfMonth(15),
    source: 'NOTION',
    color: 'PURPLE',
  },
  {
    id: 'e4',
    title: '정기 모임',
    start: dayOfMonth(18),
    source: 'GOOGLE',
    color: 'BLUE',
  },
  {
    id: 'e5',
    title: 'MT',
    start: dayOfMonth(22),
    end: dayOfMonth(23),
    source: 'CUSTOM',
    color: 'MINT',
  },
];

/**
 * 홍보 게시판에 실제 동아리가 올렸던 공연·전시 글 (2026년 모아동 홍보 게시판 공개 글).
 * 실시간 글을 불러오지 못할 때 대신 보여 준다. 학교 행사(대동제 등)가 아닌 동아리 행사만 고른다.
 */
const CDN = 'https://cdn.moadong.com/promotion';
export const MOCK_PROMOTIONS: PromotionArticle[] = [
  {
    id: '6ae4580aa9be71734de95e04',
    clubName: '테크니칼',
    clubId: '67ee1e07b35e3c267e3c2478',
    title: '테크니칼 정기 공연',
    location: '바이널언더그라운드',
    latitude: 35.1363864,
    longitude: 129.1019273,
    eventStartDate: '2026-11-07T09:00:00Z',
    eventEndDate: '2026-11-07T11:00:00Z',
    description:
      '11월 7일 토요일 18시 더 바이널 언더그라운드에서 밴드동아리 테크니칼의 정기 공연이 예정되어 있습니다!',
    images: [
      `${CDN}/67ee1e07b35e3c267e3c2478/2026/10/3d816e90-b3d8-4557-b4be-59d1a9b51cca-everytime-1793340987643.jpg`,
    ],
  },
  {
    id: '6ab2c4f765552f598675ee10',
    clubName: '송웨이브',
    clubId: '67ebf9f75c8623081055881c',
    title: '🌊🎵송웨이브 광안리 버스킹🌊🎶',
    location: '부산광역시 수영구 광안해변로 21 호메르스 호텔 앞',
    latitude: 35.1530585,
    longitude: 129.1182604,
    eventStartDate: '2026-09-23T09:30:00Z',
    eventEndDate: '2026-09-23T11:30:00Z',
    description:
      '어쿠스틱 통기타 밴드 동아리 송웨이브가 가을을 맞이하여 광안리 바닷가에서 버스킹 공연을 합니다.',
    images: [
      `${CDN}/articles/6ab2c4f765552f598675ee10/2026/09/738babda-969f-4579-90c5-7ce4a0dcceee-1000015553.jpg`,
    ],
  },
  {
    id: '6aa3a5101be3f8604e68bd68',
    clubName: 'UCDC',
    clubId: '6873bd299033815c4391192e',
    title: '🇰🇷유시디시 34회 발표회🇰🇷',
    location: '부경대학교 대학극장 (D21)',
    latitude: 35.1323825,
    longitude: 129.1049924,
    eventStartDate: '2026-09-11T10:00:00Z',
    eventEndDate: '2026-09-11T12:30:00Z',
    description: 'UCDC의 연중 가장 큰 무대, 1년에 단 한 번 열리는 발표회예요.',
    images: [
      `${CDN}/articles/6aa3a5101be3f8604e68bd68/2026/09/d1eb0db5-cf17-4b15-999b-d2dfc3eb9b71-1.jpg`,
    ],
  },
  {
    id: '6a1d8036fab60821276371b9',
    clubName: '네오쇼크',
    clubId: '67e54ae51cfd27718dd40bde',
    title: '🍀 네오쇼크 2026 1학기 정기공연 🍀',
    location: '부경대학교 대학극장',
    latitude: 35.1323825,
    longitude: 129.1049924,
    eventStartDate: '2026-06-02T09:30:00Z',
    eventEndDate: '2026-06-02T11:30:00Z',
    description: '2026 1학기 네오쇼크 정기공연이 찾아옵니다!',
    images: [
      `${CDN}/articles/6a1d8036fab60821276371b9/2026/06/06ee8e7d-7096-46ee-9cb3-3493f305edd2-1.jpg`,
    ],
  },
];

/** 운영진 쪽에서 홍보 글 하나를 보여 줄 때 쓰는 실제 동아리 정기 공연 글 */
export const MOCK_PROMOTION: PromotionArticle = MOCK_PROMOTIONS[0];

const applicant = (
  id: string,
  name: string,
  status: ApplicationStatus,
  daysAgo: number,
  memo = '',
): Applicant => ({
  id: asApplicantId(id),
  status,
  answers: [{ id: 1, value: name }],
  memo,
  createdAt: subDays(new Date(), daysAgo).toISOString(),
  applicationFormId: asApplicationFormId('form-intro'),
});

export const MOCK_APPLICANTS: Applicant[] = [
  // 부경대 캠퍼스(대연·용당)와 학교 이름에서 따온 이름
  applicant(
    'a1',
    '김부경',
    ApplicationStatus.SUBMITTED,
    0,
    '보컬 지원 · 버스킹 경험 있음',
  ),
  applicant(
    'a2',
    '이대연',
    ApplicationStatus.INTERVIEW_SCHEDULED,
    1,
    '드럼 3년',
  ),
  applicant(
    'a3',
    '박용당',
    ApplicationStatus.ACCEPTED,
    2,
    '베이스 처음이지만 열정 최고',
  ),
];

export const MOCK_APPLICANT_SUMMARY: Pick<
  ApplicantsInfo,
  'total' | 'reviewRequired' | 'scheduledInterview' | 'accepted' | 'declined'
> = {
  total: 37,
  reviewRequired: 12,
  scheduledInterview: 9,
  accepted: 13,
  declined: 3,
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    title: '지원 동기를 적어주세요',
    description: '자유롭게 적어주세요.',
    type: 'LONG_TEXT',
    options: { required: true },
    items: [],
  },
  {
    id: 2,
    title: '활동 가능한 요일을 골라주세요',
    description: '',
    type: 'MULTI_CHOICE',
    options: { required: false },
    items: [{ value: '월요일' }, { value: '수요일' }, { value: '목요일' }],
  },
];

const TREND_DAYS = 14;
const TREND_VIEWS = [
  38, 42, 35, 51, 64, 58, 72, 80, 76, 95, 110, 104, 128, 141,
];
const TREND_APPLICANTS = [0, 1, 0, 2, 1, 2, 3, 2, 4, 3, 5, 4, 5, 5];

export const MOCK_STATISTICS_TREND: ClubStatisticsTrend = {
  clubId: 'moadong-intro',
  from: format(subDays(new Date(), TREND_DAYS - 1), DATE),
  to: format(new Date(), DATE),
  points: TREND_VIEWS.map((detailViews, index) => ({
    date: format(subDays(new Date(), TREND_DAYS - 1 - index), DATE),
    detailViews,
    averageDetailDurationSeconds: 80 + index * 3,
    applicants: TREND_APPLICANTS[index],
  })),
};

export const MOCK_STATISTICS_OVERVIEW: ClubStatisticsOverview = {
  clubId: 'moadong-intro',
  clubName: '모아동',
  from: MOCK_STATISTICS_TREND.from,
  to: MOCK_STATISTICS_TREND.to,
  totalDetailViews: TREND_VIEWS.reduce((sum, value) => sum + value, 0),
  averageDetailDurationSeconds: 96,
  uniqueDetailVisitors: 486,
  averageDetailDurationSecondsPerVisitor: 142,
  totalApplicants: TREND_APPLICANTS.reduce((sum, value) => sum + value, 0),
};

/** 지원서 화면에서 한 글자씩 써지는 지원 동기 예시 */
export const APPLY_MOTIVATION_EXAMPLES = [
  '다양한 전공 친구들과 함께 프로젝트를 해 보고 싶어서 지원했어요!',
];

/** 지원서 화면에서 미리 골라 둔 활동 가능 요일 */
export const APPLY_SELECTED_DAYS = ['수요일', '목요일'];

/** 잠금화면에 차례로 도착하는 구독 동아리 새 소식 알림 (제목은 동아리 이름, 내용은 동아리가 올린 소식) */
export const SUBSCRIBE_NOTIFICATIONS = [
  {
    id: 'notice-band',
    title: '모아밴드',
    body: '📢 2학기 신입 부원 모집을 시작했어요! 마감 전에 지원해 보세요.',
  },
  {
    id: 'notice-film',
    title: '모아필름',
    body: '📸 정기 사진전에 초대합니다 · 학생회관 1층 로비',
  },
];

/** AI 초안 데모에서 채워지는 지원서 제목 */
export const AI_DRAFT_TITLE = '모아밴드 신입 부원 모집';

/** AI 초안 데모에서 하나씩 나타나는 질문 */
export const AI_DRAFT_QUESTIONS: Question[] = [
  {
    id: 1,
    title: '이름과 학번을 알려주세요',
    description: '',
    type: 'SHORT_TEXT',
    options: { required: true },
    items: [],
  },
  {
    id: 2,
    title: '어떤 파트를 하고 싶나요?',
    description: '처음이어도 괜찮아요.',
    type: 'CHOICE',
    options: { required: true },
    items: [
      { value: '보컬' },
      { value: '기타' },
      { value: '베이스' },
      { value: '드럼' },
    ],
  },
  {
    id: 3,
    title: '지원한 이유를 한 줄로 적어주세요',
    description: '',
    type: 'SHORT_TEXT',
    options: { required: false },
    items: [],
  },
];

/** 운영진 첫 화면에서 차례로 새로 지원하는 사람 이름 (부경대 캠퍼스·학교 앞 동네에서 따왔다) */
export const ARRIVING_APPLICANTS = [
  { name: '정부캉', memo: '기타 · 축제 공연 경험' },
  { name: '한광안', memo: '보컬 지원' },
  { name: '윤경성', memo: '키보드 2년' },
  { name: '강남천', memo: '드럼은 처음이에요' },
  { name: '조대연', memo: '베이스 · 합주 경험 있음' },
  { name: '임용당', memo: '보컬 · 자작곡 있음' },
];

export interface SearchResultClub {
  name: string;
  category: string;
  /** OPEN·ALWAYS·CLOSED·UPCOMING */
  recruitmentStatus: string;
  introduction: string;
  tags: string[];
  /** inactiveCategoryIcons의 키 */
  icon: keyof typeof inactiveCategoryIcons;
}

/** 검색 데모: 검색어마다 나오는 예시 동아리 (지어낸 이름) */
export const SEARCH_SCENARIOS: {
  keyword: string;
  results: SearchResultClub[];
}[] = [
  {
    keyword: '밴드',
    results: [
      {
        name: '모아밴드',
        category: '공연',
        recruitmentStatus: 'OPEN',
        introduction: '음악을 좋아하는 누구나 함께하는 밴드 동아리',
        tags: ['밴드', '정기공연'],
        icon: 'performance',
      },
      {
        name: '사운드모아',
        category: '공연',
        recruitmentStatus: 'ALWAYS',
        introduction: '어쿠스틱부터 록까지 함께 합주해요',
        tags: ['어쿠스틱'],
        icon: 'performance',
      },
    ],
  },
  {
    keyword: '농구',
    results: [
      {
        name: '모아농구단',
        category: '운동',
        recruitmentStatus: 'OPEN',
        introduction: '주 2회 체육관에서 함께 농구해요',
        tags: ['농구', '친목'],
        icon: 'sport',
      },
      {
        name: '덩크모아',
        category: '운동',
        recruitmentStatus: 'CLOSED',
        introduction: '대학 리그에 나가는 농구 동아리',
        tags: ['리그'],
        icon: 'sport',
      },
    ],
  },
  {
    keyword: '봉사',
    results: [
      {
        name: '모아나눔',
        category: '봉사',
        recruitmentStatus: 'ALWAYS',
        introduction: '지역 아이들과 함께하는 교육 봉사',
        tags: ['교육봉사'],
        icon: 'volunteer',
      },
      {
        name: '모아그린',
        category: '봉사',
        recruitmentStatus: 'OPEN',
        introduction: '캠퍼스 플로깅과 환경 정화 봉사',
        tags: ['환경'],
        icon: 'volunteer',
      },
    ],
  },
];

/** 운영진 지원서 상세 데모에서 차례로 넘겨 보는 지원자와 답변 (질문은 AI_DRAFT_QUESTIONS의 id) */
export const REVIEW_APPLICANTS: {
  id: string;
  name: string;
  answers: Record<number, string[]>;
}[] = [
  {
    id: 'review-1',
    name: '김부경',
    answers: {
      1: ['김부경 / 202512345'],
      2: ['보컬'],
      3: ['축제 무대에서 노래해 보고 싶어요! 버스킹 경험이 있어요.'],
    },
  },
  {
    id: 'review-2',
    name: '이대연',
    answers: {
      1: ['이대연 / 202498765'],
      2: ['드럼'],
      3: ['고등학교 밴드부에서 3년 동안 드럼을 쳤어요.'],
    },
  },
  {
    id: 'review-3',
    name: '박용당',
    answers: {
      1: ['박용당 / 202533333'],
      2: ['베이스'],
      3: ['베이스는 처음이지만 꼭 배워 보고 싶어요.'],
    },
  },
];
