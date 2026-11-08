// 소개 페이지 쇼케이스에서 실제 학생·관리자 컴포넌트에 넣는 목업 데이터
import { addDays, format, startOfMonth, subDays } from 'date-fns';
import { inactiveCategoryIcons } from '@/assets/images/icons/category_button';
import { festivalMock } from '@/mocks/data/festivalMock';
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
 * 홍보 게시판에 실제로 올라갔던 총동연·총학생회 행사 기록(동아리 소개 한마당, 대동제 청해제).
 * 지어낸 포스터 대신 실제 포스터와 일정을 쓴다.
 */
export const MOCK_PROMOTIONS: PromotionArticle[] = [...festivalMock].reverse();

/** 운영진 쪽에서 홍보 글 하나를 보여줄 때 쓰는 대동제 청해제 */
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

/** 첫 번째 지원자의 상태가 이 순서로 바뀌며 상태 관리를 보여준다 */
export const APPLICANT_STATUS_CYCLE = [
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.INTERVIEW_SCHEDULED,
  ApplicationStatus.ACCEPTED,
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
