// 지원 안내 페이지의 시간 흐름(지금 지원 → 마감 → 오디션·면접·발표 → 첫 모임)을 한 줄 타임라인으로 만드는 함수
import { differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ApplyMethod } from '@/pages/ClubDetailPage/hooks/useApplyGuide';
import { RecruitmentStatus } from '@/types/club';
import { ClubRecruitmentGuide } from '@/types/clubInsights';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';

// 종료일이 이보다 멀면 상시 모집으로 본다 (getRecruitmentSummary와 같은 기준)
const ALWAYS_THRESHOLD_DAYS = 365;

export type TimelineState = 'done' | 'now' | 'next';

export interface TimelineItem {
  label: string;
  date?: string;
  place?: string;
  description?: string;
  state: TimelineState;
}

const safeParse = (value?: string | null) => {
  if (!value) return null;
  try {
    return recruitmentDateParser(value);
  } catch {
    return null;
  }
};

const formatDayTime = (date: Date) => {
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  return format(date, hasTime ? 'M월 d일 (E) HH:mm' : 'M월 d일 (E)', {
    locale: ko,
  });
};

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;
const RIEUL_JONGSEONG = 8;

/** 받침에 따라 '로'/'으로'를 붙인다. 받침이 없거나 ㄹ이면 '로' (예: 네이버 폼으로, 외부 지원서로) */
export const withRo = (word: string) => {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return `${word}로`;
  const jong = (code - HANGUL_START) % JONGSEONG_COUNT;
  return jong === 0 || jong === RIEUL_JONGSEONG ? `${word}로` : `${word}으로`;
};

/** 지원하기 버튼이 실제로 어디로 보내는지 한 줄로 말한다 */
export const describeApplyMethod = (
  method?: ApplyMethod,
): { title: string; description: string } => {
  switch (method?.kind) {
    case 'EXTERNAL':
      return {
        title: `${withRo(method.platform)} 지원`,
        description: `아래 버튼을 누르면 동아리가 만든 ${method.platform} 페이지가 열려요`,
      };
    case 'MULTIPLE':
      return {
        title: '지원서 골라서 작성',
        description: `지원서가 ${method.count}개 있어요. 아래 버튼을 누르고 하나를 골라요`,
      };
    case 'CONTACT':
      return {
        title: '동아리에 직접 연락',
        description: '동아리 인스타그램이나 연락처로 지원 의사를 알려 주세요',
      };
    default:
      return {
        title: '모아동에서 지원서 작성',
        description: '아래 버튼을 누르면 모아동 안에서 바로 작성해요',
      };
  }
};

interface BuildTimelineParams {
  status: RecruitmentStatus;
  start?: string | null;
  end?: string | null;
  method?: ApplyMethod;
  schedule?: ClubRecruitmentGuide['schedule'];
  now?: Date;
}

export const buildApplyTimeline = ({
  status,
  start,
  end,
  method,
  schedule = [],
  now = new Date(),
}: BuildTimelineParams): TimelineItem[] => {
  const startDate = safeParse(start);
  const endDate = safeParse(end);
  const isAlways =
    status === 'ALWAYS' ||
    (status === 'OPEN' &&
      (!endDate ||
        differenceInCalendarDays(endDate, now) > ALWAYS_THRESHOLD_DAYS));
  const apply = describeApplyMethod(method);

  // 지난 모집이면 일정 전체가 지난 기록이다
  const laterState: TimelineState = status === 'CLOSED' ? 'done' : 'next';
  const later: TimelineItem[] = schedule.map((item) => ({
    ...item,
    state: laterState,
  }));

  if (status === 'CLOSED') {
    return [
      ...(startDate
        ? [
            {
              label: '모집 시작',
              date: formatDayTime(startDate),
              state: 'done' as const,
            },
          ]
        : []),
      ...(endDate
        ? [
            {
              label: '지원 마감',
              date: formatDayTime(endDate),
              state: 'done' as const,
            },
          ]
        : []),
      ...later,
    ];
  }

  if (status === 'UPCOMING') {
    return [
      {
        label: '모집 시작',
        date: startDate ? formatDayTime(startDate) : undefined,
        state: 'next',
      },
      { label: apply.title, description: apply.description, state: 'next' },
      ...(endDate
        ? [
            {
              label: '지원 마감',
              date: formatDayTime(endDate),
              state: 'next' as const,
            },
          ]
        : []),
      ...later,
    ];
  }

  return [
    { label: apply.title, description: apply.description, state: 'now' },
    ...(!isAlways && endDate
      ? [
          {
            label: '지원 마감',
            date: formatDayTime(endDate),
            state: 'next' as const,
          },
        ]
      : []),
    ...later,
  ];
};
