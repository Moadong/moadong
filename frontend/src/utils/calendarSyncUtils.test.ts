import type {
  GoogleCalendarEvent,
  NotionSearchItem,
} from '@/apis/calendarOAuth';
import type { ClubCalendarEvent } from '@/types/club';
import {
  buildDateKeyFromDate,
  buildDefaultRedirectUri,
  buildMonthCalendarDays,
  convertCustomEventToUnified,
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

    it('유효한 날짜는 한국어 로케일로 포맷한다', () => {
      const result = formatDateText('2026-03-19T10:30:00Z');
      expect(result).toContain('2026');
      expect(result).toContain('3');
      expect(result).toContain('19');
    });

    it('formatDateOnly는 YYYY-MM-DD를 표시용 형식으로 변환한다', () => {
      expect(formatDateOnly('2026-03-19')).toBe('2026. 3. 19.');
      expect(formatDateOnly('2026-12-25')).toBe('2026. 12. 25.');
    });

    it('formatDateOnly는 잘못된 형식이면 원문을 반환한다', () => {
      expect(formatDateOnly(undefined)).toBe('-');
      expect(formatDateOnly('invalid')).toBe('invalid');
      expect(formatDateOnly('2026/03/19')).toBe('2026/03/19');
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
    it('Google 이벤트를 통합 형식으로 변환한다', () => {
      const googleEvent: GoogleCalendarEvent = {
        id: 'google-event-1',
        title: 'Google 미팅',
        start: '2026-03-20T10:00:00Z',
        end: '2026-03-20T11:00:00Z',
        url: 'https://calendar.google.com/event?id=google-event-1',
        description: '팀 회의',
        source: 'GOOGLE',
      };

      const unified = convertGoogleEventToUnified(googleEvent);

      expect(unified).not.toBeNull();
      expect(unified?.id).toBe('google-google-event-1');
      expect(unified?.title).toBe('Google 미팅');
      expect(unified?.dateKey).toBe('2026-03-20');
      expect(unified?.source).toBe('GOOGLE');
      expect(unified?.description).toBe('팀 회의');
      expect(unified?.url).toBe(googleEvent.url);
    });

    it('Google 이벤트의 날짜가 유효하지 않으면 null을 반환한다', () => {
      const googleEvent: GoogleCalendarEvent = {
        id: 'google-event-2',
        title: 'Invalid Event',
        start: 'invalid-date',
        end: '2026-03-20T11:00:00Z',
        source: 'GOOGLE',
      };

      const unified = convertGoogleEventToUnified(googleEvent);

      expect(unified).toBeNull();
    });

    it('Notion 이벤트를 통합 형식으로 변환한다', () => {
      const notionEvent = {
        id: 'notion-page-1',
        title: 'Notion 작업',
        start: '2026-03-21',
        dateKey: '2026-03-21',
        end: '2026-03-22',
        url: 'https://www.notion.so/page-1',
      };

      const unified = convertNotionEventToUnified(notionEvent);

      expect(unified.id).toBe('notion-notion-page-1');
      expect(unified.title).toBe('Notion 작업');
      expect(unified.dateKey).toBe('2026-03-21');
      expect(unified.source).toBe('NOTION');
      expect(unified.start).toBe('2026-03-21');
      expect(unified.end).toBe('2026-03-22');
      expect(unified.url).toBe(notionEvent.url);
    });

    it('Notion 이벤트의 선택적 필드가 없어도 변환한다', () => {
      const notionEvent = {
        id: 'notion-page-2',
        title: '간단한 작업',
        start: '2026-03-23',
        dateKey: '2026-03-23',
      };

      const unified = convertNotionEventToUnified(notionEvent);

      expect(unified.id).toBe('notion-notion-page-2');
      expect(unified.title).toBe('간단한 작업');
      expect(unified.source).toBe('NOTION');
      expect(unified.end).toBeUndefined();
      expect(unified.url).toBeUndefined();
    });

    it('커스텀 이벤트를 통합 형식으로 변환한다', () => {
      const customEvent: ClubCalendarEvent = {
        id: '1',
        title: '직접 입력 일정',
        start: '2026-04-01',
        end: '2026-04-02',
        url: 'https://example.com',
        description: '설명',
        source: 'CUSTOM',
      };

      const unified = convertCustomEventToUnified(customEvent);

      expect(unified).not.toBeNull();
      expect(unified?.id).toBe('custom-1');
      expect(unified?.title).toBe('직접 입력 일정');
      expect(unified?.dateKey).toBe('2026-04-01');
      expect(unified?.source).toBe('CUSTOM');
      expect(unified?.end).toBe('2026-04-02');
      expect(unified?.url).toBe('https://example.com');
      expect(unified?.description).toBe('설명');
    });

    it('커스텀 이벤트의 날짜가 유효하지 않으면 null을 반환한다', () => {
      const customEvent: ClubCalendarEvent = {
        id: '2',
        title: 'Invalid',
        start: 'invalid-date',
        source: 'CUSTOM',
      };

      const unified = convertCustomEventToUnified(customEvent);

      expect(unified).toBeNull();
    });
  });
});
