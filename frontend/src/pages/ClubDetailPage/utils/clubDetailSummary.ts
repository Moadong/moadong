// 동아리 상세 화면의 요약 정보(모집 상태 문구, 분과, 성과 정렬, 업데이트 시점)를 만드는 함수 모음
import { differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Award, RecruitmentStatus } from '@/types/club';
import { getAwardSortValue } from '@/utils/awardHelpers';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';

// 종료일이 이보다 멀면 사실상 상시 모집으로 본다 (getDeadlineText와 같은 기준)
const ALWAYS_THRESHOLD_DAYS = 365;
// 마감까지 이 일수 이하로 남으면 강조한다
const URGENT_THRESHOLD_DAYS = 3;
const DAYS_PER_WEEK = 7;
// 이보다 오래되면 "N주 전" 대신 날짜로 보여준다
const RELATIVE_LABEL_MAX_DAYS = 30;

const DIVISION_LABEL: Record<string, string> = {
  중동: '중앙동아리',
  과동: '과동아리',
};

export const getDivisionLabel = (division?: string): string | null => {
  if (!division?.trim()) return null;
  return DIVISION_LABEL[division] ?? division;
};

const safeParse = (value?: string | null): Date | null => {
  if (!value) return null;
  try {
    return recruitmentDateParser(value);
  } catch {
    return null;
  }
};

const formatDay = (date: Date) => format(date, 'M월 d일 (E)', { locale: ko });

const formatDayTime = (date: Date) => {
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  return format(date, hasTime ? 'M월 d일 (E) HH:mm' : 'M월 d일 (E)', {
    locale: ko,
  });
};

export interface RecruitmentSummary {
  /** 모집중·상시모집·모집예정·모집마감 */
  label: string;
  /** 상태 옆에 붙는 한 줄 설명. 예: "D-3 · 11월 28일 (금) 마감" */
  detail: string | null;
  /** 마감이 임박했는지(3일 이내). 강조 색에 쓴다 */
  isUrgent: boolean;
  /** 정보 목록에 보여줄 모집 기간. 상시 모집이거나 날짜가 없으면 null */
  period: string | null;
}

export const getRecruitmentSummary = (
  status: RecruitmentStatus,
  startValue?: string | null,
  endValue?: string | null,
  today: Date = new Date(),
): RecruitmentSummary => {
  const start = safeParse(startValue);
  const end = safeParse(endValue);
  const isEffectivelyAlways =
    status === 'ALWAYS' ||
    (!!end && differenceInCalendarDays(end, today) > ALWAYS_THRESHOLD_DAYS);

  const period =
    start && end && !isEffectivelyAlways
      ? `${formatDayTime(start)} ~ ${formatDayTime(end)}`
      : null;

  if (status === 'CLOSED') {
    return {
      label: '모집마감',
      detail: end ? `${format(end, 'yyyy년 M월')} 모집이 끝났어요` : null,
      isUrgent: false,
      period,
    };
  }

  if (status === 'UPCOMING') {
    return {
      label: '모집예정',
      detail: start ? `${formatDayTime(start)} 시작` : null,
      isUrgent: false,
      period,
    };
  }

  if (isEffectivelyAlways) {
    return {
      label: status === 'ALWAYS' ? '상시모집' : '모집중',
      detail: '언제든 지원할 수 있어요',
      isUrgent: false,
      period: null,
    };
  }

  if (!end) {
    return { label: '모집중', detail: null, isUrgent: false, period };
  }

  const days = differenceInCalendarDays(end, today);
  const dDay = days > 0 ? `D-${days}` : 'D-Day';
  return {
    label: '모집중',
    detail: `${dDay} · ${formatDay(end)} 마감`,
    isUrgent: days <= URGENT_THRESHOLD_DAYS,
    period,
  };
};

/** 최신 학기가 위로 오도록 정렬한다. 학기 정보가 없는 항목은 뺀다 */
export const sortAwardsByLatest = (awards?: Award[]): Award[] =>
  (awards ?? [])
    .filter(
      (award) =>
        !!award?.year &&
        !!award?.semesterTerm &&
        award.achievements?.some((item) => item.trim()),
    )
    .sort((a, b) => getAwardSortValue(b) - getAwardSortValue(a));

/** "오늘 업데이트", "3일 전 업데이트", "2026년 3월 3일 업데이트" */
export const getUpdatedLabel = (
  value?: string | null,
  today: Date = new Date(),
): string | null => {
  const date = safeParse(value);
  if (!date) return null;

  const days = differenceInCalendarDays(today, date);
  if (days <= 0) return '오늘 업데이트';
  if (days < DAYS_PER_WEEK) return `${days}일 전 업데이트`;
  if (days < RELATIVE_LABEL_MAX_DAYS)
    return `${Math.floor(days / DAYS_PER_WEEK)}주 전 업데이트`;
  return `${format(date, 'yyyy년 M월 d일')} 업데이트`;
};

/** SNS 주소에서 계정 이름만 뽑는다. 예: https://instagram.com/pknu_hurrah?igsh=1 → pknu_hurrah */
export const getSocialHandle = (url: string): string => {
  const path = url.split(/[?#]/)[0];
  return path.split('/').filter(Boolean).pop() ?? '';
};
