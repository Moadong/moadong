import type { NotionSearchItem } from '@/apis/calendarOAuth';
import {
  buildDateKeyFromDate,
  buildDefaultRedirectUri,
  buildMonthCalendarDays,
  convertGoogleEventToUnified,
  convertNotionEventToUnified,
  createState,
  dateFromKey,
  formatDateOnly,
  formatDateText,
  formatMonthLabel,
  maskToken,
  parseDateKey,
  parseNotionCalendarEvent,
  WEEKDAY_LABELS,
} from './calendarSyncUtils';

describe('calendarSyncUtils', () => {
  describe('기본 유틸', () => {
    it('redirect uri는 calendar-sync 경로를 포함한다', () => {
      expect(buildDefaultRedirectUri()).toContain('/admin/calendar-sync');
    });

    it('state 문자열을 생성한다', () => {
      const state = createState();
      expect(typeof state).toBe('string');
      expect(state.length).toBeGreaterThan(0);
    });

    it('토큰 마스킹은 앞 8자리/뒤 8자리만 노출한다', () => {
      const token = '12345678abcdefghijklmnop87654321';
      expect(maskToken(token)).toBe('12345678...87654321');
      expect(maskToken('short-token')).toBe('short-token');
    });
  });

  describe('날짜 유틸', () => {
    it('요일 라벨은 일~토 순서를 유지한다', () => {
      expect(WEEKDAY_LABELS).toEqual([
        '일',
        '월',
        '화',
        '수',
        '목',
        '금',
        '토',
      ]);
    });

    it('parseDateKey는 YYYY-MM-DD 형식을 그대로 반환한다', () => {
      expect(parseDateKey('2026-03-22')).toBe('2026-03-22');
    });

    it('parseDateKey는 ISO datetime을 YYYY-MM-DD로 정규화한다', () => {
      expect(parseDateKey('2026-03-22T06:25:00.000Z')).toBe('2026-03-22');
      expect(parseDateKey('Sun, 22 Mar 2026 06:25:00 GMT')).toBe('2026-03-22');
      expect(parseDateKey('invalid-date')).toBeNull();
    });

    it('date key와 Date 객체 변환이 일관된다', () => {
      const key = '2026-03-19';
      const date = dateFromKey(key);
      expect(buildDateKeyFromDate(date)).toBe(key);
    });

    it('월 캘린더 그리드는 주 단위(7개) 배수로 생성된다', () => {
      const days = buildMonthCalendarDays(new Date(2026, 2, 1));
      expect(days.length % 7).toBe(0);
      expect(buildDateKeyFromDate(days[0])).toBe('2026-03-01');
      expect(buildDateKeyFromDate(days[days.length - 1])).toBe('2026-04-04');
    });

    it('월 라벨은 YYYY년 MM월 형식이다', () => {
      expect(formatMonthLabel(new Date(2026, 2, 1))).toBe('2026년 03월');
    });

    it('유효하지 않은 날짜 텍스트는 원문을 반환한다', () => {
      expect(formatDateText(undefined)).toBe('-');
      expect(formatDateText('not-a-date')).toBe('not-a-date');
    });
  });

  describe('Notion 이벤트 변환', () => {
    const createNotionItem = (
      overrides?: Partial<NotionSearchItem>,
    ): NotionSearchItem => ({
      id: 'page-1',
      object: 'page',
      url: 'https://www.notion.so/example',
      properties: {
        날짜: {
          type: 'date',
          date: {
            start: '2026-03-19',
            end: null,
          },
        },
        이름: {
          type: 'title',
          title: [{ plain_text: '캘린더 테스트' }],
        },
      },
      ...overrides,
    });

    it('날짜/제목 속성이 있으면 캘린더 이벤트로 변환한다', () => {
      const item = createNotionItem();
      const event = parseNotionCalendarEvent(item);

      expect(event).not.toBeNull();
      expect(event?.id).toBe(item.id);
      expect(event?.title).toBe('캘린더 테스트');
      expect(event?.dateKey).toBe('2026-03-19');
    });

    it('title 속성이 없어도 기본 제목으로 변환한다', () => {
      const item = createNotionItem({
        properties: {
          날짜: {
            type: 'date',
            date: {
              start: '2026-03-19',
              end: null,
            },
          },
        } as NotionSearchItem['properties'],
      });

      const event = parseNotionCalendarEvent(item);
      expect(event?.title).toBe('(제목 없음)');
    });

    it('date 속성이 없거나 잘못된 경우 null을 반환한다', () => {
      const missingDate = createNotionItem({
        properties: {
          이름: {
            type: 'title',
            title: [{ plain_text: '제목만 있음' }],
          },
        } as NotionSearchItem['properties'],
      });
      const invalidDate = createNotionItem({
        properties: {
          날짜: {
            type: 'date',
            date: {
              start: 'invalid-date',
              end: null,
            },
          },
        } as NotionSearchItem['properties'],
      });

      expect(parseNotionCalendarEvent(missingDate)).toBeNull();
      expect(parseNotionCalendarEvent(invalidDate)).toBeNull();
    });
  });

  describe('통합 이벤트 변환', () => {
    it('Google 이벤트를 통합 이벤트로 변환한다', () => {
      const googleEvent = {
        id: 'event-1',
        title: '구글 캘린더 일정',
        start: '2026-04-15T10:00:00Z',
        end: '2026-04-15T11:00:00Z',
        url: 'https://calendar.google.com/event-1',
        description: '설명입니다',
        source: 'GOOGLE' as const,
      };

      const unified = convertGoogleEventToUnified(googleEvent);

      expect(unified).not.toBeNull();
      expect(unified?.id).toBe('google-event-1');
      expect(unified?.title).toBe('구글 캘린더 일정');
      expect(unified?.dateKey).toBe('2026-04-15');
      expect(unified?.source).toBe('GOOGLE');
    });

    it('Notion 이벤트를 통합 이벤트로 변환한다', () => {
      const notionEvent = {
        id: 'page-1',
        title: '노션 일정',
        start: '2026-04-16',
        dateKey: '2026-04-16',
        url: 'https://www.notion.so/page-1',
      };

      const unified = convertNotionEventToUnified(notionEvent);

      expect(unified.id).toBe('notion-page-1');
      expect(unified.title).toBe('노션 일정');
      expect(unified.source).toBe('NOTION');
    });

    it('잘못된 날짜의 Google 이벤트는 null을 반환한다', () => {
      const invalidEvent = {
        id: 'event-2',
        title: '잘못된 일정',
        start: 'invalid-date',
        end: 'invalid-date', // Add a dummy end for type correctness
        source: 'GOOGLE' as const,
      };
      expect(convertGoogleEventToUnified(invalidEvent)).toBeNull();
    });
  });

  describe('추가 날짜 포맷팅', () => {
    it('formatDateOnly는 YYYY-MM-DD를 한국식 날짜로 변환한다', () => {
      expect(formatDateOnly('2026-04-15')).toBe('2026. 4. 15.');
      expect(formatDateOnly('not-a-date')).toBe('not-a-date');
      expect(formatDateOnly(undefined)).toBe('-');
    });
  });
});