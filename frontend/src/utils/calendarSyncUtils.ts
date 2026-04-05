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
export const createState = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

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
 * 날짜 전용 문자열(YYYY-MM-DD)을 표시용 텍스트로 변환한다.
 * 시간대 영향 없이 날짜만 표시한다.
 */
export const formatDateOnly = (dateKey?: string) => {
  if (!dateKey) return '-';
  // YYYY-MM-DD 형식 검증
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return dateKey;
  }
  const [year, month, day] = dateKey.split('-');
  return `${year}. ${parseInt(month, 10)}. ${parseInt(day, 10)}.`;
};

/**
 * 다양한 날짜 문자열을 `YYYY-MM-DD` 키로 정규화한다.
 * - 순수 날짜 문자열(YYYY-MM-DD)은 그대로 반환
 * - datetime 문자열은 ISO 8601 형식에서 날짜 부분 추출
 * - 타임존에 관계없이 의도된 날짜를 정확히 반환
 * 유효하지 않은 값이면 null을 반환한다.
 */
export const parseDateKey = (dateText: string) => {
  // 순수 날짜 형식(시간 없음)만 그대로 반환 - 종일 이벤트
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    return dateText;
  }

  // ISO 8601 datetime 형식에서 날짜 부분만 추출
  // 예: 2026-04-01T00:30:00+09:00 → 2026-04-01
  // 예: 2026-04-01T15:30:00Z → 2026-04-01
  const isoDateMatch = dateText.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDateMatch) {
    return isoDateMatch[1];
  }

  // ISO 형식이 아니면 Date 파싱 후 로컬 날짜 추출
  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
