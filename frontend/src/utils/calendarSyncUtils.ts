import type {
  GoogleCalendarEvent,
  NotionSearchItem,
} from '@/apis/calendarOAuth';

/**
 * CalendarSyncTab 전용 유틸
 * - OAuth 보조 유틸(redirect/state/token 표시)
 * - 캘린더 날짜 계산 유틸
 * - Notion page -> 캘린더 이벤트 변환 유틸
 */

export const WEEKDAY_LABELS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
] as const;

/** 현재 origin 기준 CalendarSync 콜백 URI를 만든다. */
export const buildDefaultRedirectUri = () =>
  `${window.location.origin}/admin/calendar-sync`;

/** OAuth state용 난수 문자열을 생성한다. */
export const createState = () =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

/** 토큰 표시용 마스킹 문자열을 만든다. */
export const maskToken = (token: string) => {
  if (token.length <= 16) return token;
  return `${token.slice(0, 8)}...${token.slice(-8)}`;
};

/**
 * 날짜/시간 문자열을 한국어 로케일 텍스트로 변환한다.
 * 파싱 실패 시 원문을 그대로 반환한다.
 */
export const formatDateText = (dateText?: string) => {
  if (!dateText) return '-';
  try {
    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) {
      return dateText;
    }
    return date.toLocaleString('ko-KR');
  } catch {
    return dateText;
  }
};

/**
 * 다양한 날짜 문자열을 `YYYY-MM-DD` 키로 정규화한다.
 * - 순수 날짜 문자열(YYYY-MM-DD)은 그대로 반환
 * - datetime 문자열은 UTC 기준으로 파싱하여 날짜 추출
 * 유효하지 않은 값이면 null을 반환한다.
 */
export const parseDateKey = (dateText: string) => {
  // 순수 날짜 형식(시간 없음)만 그대로 반환 - 종일 이벤트
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    return dateText;
  }

  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return null;

  const utcYear = parsed.getUTCFullYear();
  const utcMonth = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const utcDay = String(parsed.getUTCDate()).padStart(2, '0');
  return `${utcYear}-${utcMonth}-${utcDay}`;
};

export const buildDateKeyFromDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const dateFromKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 월 기준 캘린더 그리드(주 시작~주 끝 포함) 날짜 배열을 생성한다.
 */
export const buildMonthCalendarDays = (month: Date) => {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  const gridEnd = new Date(monthEnd);
  gridEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

  const days: Date[] = [];
  const oneDayMs = 24 * 60 * 60 * 1000;
  for (
    let timestamp = gridStart.getTime();
    timestamp <= gridEnd.getTime();
    timestamp += oneDayMs
  ) {
    days.push(new Date(timestamp));
  }
  return days;
};

/** 월 라벨을 `YYYY년 MM월` 형식으로 포맷한다. */
export const formatMonthLabel = (month: Date) =>
  `${month.getFullYear()}년 ${String(month.getMonth() + 1).padStart(2, '0')}월`;

/** Notion page에서 추출한 캘린더 이벤트 모델. */
export interface NotionCalendarEvent {
  id: string;
  title: string;
  start: string;
  dateKey: string;
  end?: string;
  url?: string;
}

export interface UnifiedCalendarEvent {
  id: string;
  title: string;
  start: string;
  dateKey: string;
  end?: string;
  url?: string;
  source: 'GOOGLE' | 'NOTION';
  description?: string;
}

/**
 * Notion page 응답을 캘린더 이벤트로 변환한다.
 * - date 타입 속성이 없거나
 * - 날짜 파싱 불가한 경우 null을 반환한다.
 */
export const parseNotionCalendarEvent = (
  item: NotionSearchItem,
): NotionCalendarEvent | null => {
  const properties = item.properties;
  if (!properties) return null;

  const entries = Object.values(properties) as Array<Record<string, unknown>>;
  const dateProperty = entries.find(
    (property) =>
      property?.type === 'date' &&
      typeof (property.date as { start?: string } | undefined)?.start ===
        'string',
  ) as { date?: { start?: string; end?: string } } | undefined;

  const start = dateProperty?.date?.start;
  if (!start) return null;
  const dateKey = parseDateKey(start);
  if (!dateKey) return null;

  const titleProperty = entries.find(
    (property) => property?.type === 'title' && Array.isArray(property.title),
  ) as { title?: Array<{ plain_text?: string }> } | undefined;

  const title =
    titleProperty?.title
      ?.map((segment) => segment.plain_text ?? '')
      .join('')
      .trim() || '(제목 없음)';

  return {
    id: item.id,
    title,
    start,
    dateKey,
    end: dateProperty?.date?.end,
    url: item.url,
  };
};

export const convertGoogleEventToUnified = (
  event: GoogleCalendarEvent,
): UnifiedCalendarEvent | null => {
  const dateKey = parseDateKey(event.start);
  if (!dateKey) return null;

  return {
    id: `google-${event.id}`,
    title: event.title,
    start: event.start,
    end: event.end,
    dateKey,
    url: event.url,
    description: event.description,
    source: 'GOOGLE',
  };
};

export const convertNotionEventToUnified = (
  event: NotionCalendarEvent,
): UnifiedCalendarEvent => ({
  id: `notion-${event.id}`,
  title: event.title,
  start: event.start,
  end: event.end,
  dateKey: event.dateKey,
  url: event.url,
  source: 'NOTION',
});
