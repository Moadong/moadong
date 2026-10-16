import type { GoogleCalendarEvent } from '@/apis/calendarOAuth';
import type { ClubCalendarEvent } from '@/types/club';
import type { NotionCalendarEvent } from './calendarSyncUtils';
import { mergeCalendarEvents } from './mergeCalendarEvents';

const googleEvent: GoogleCalendarEvent = {
  id: 'g1',
  title: 'Google 미팅',
  start: '2026-03-20T10:00:00Z',
  end: '2026-03-20T11:00:00Z',
  source: 'GOOGLE',
};

const notionEvent: NotionCalendarEvent = {
  id: 'n1',
  title: 'Notion 작업',
  start: '2026-03-21',
  dateKey: '2026-03-21',
};

const customEvent: ClubCalendarEvent = {
  id: 'c1',
  title: '정기모임',
  start: '2026-03-02',
  source: 'CUSTOM',
  eventType: 'RECURRING',
  recurrence: { frequency: 'WEEKLY', weekdays: [5] },
};

const merge = (overrides = {}) =>
  mergeCalendarEvents({
    googleCalendarEvents: [googleEvent],
    notionCalendarEvents: [notionEvent],
    customCalendarEvents: [customEvent],
    hiddenCalendarEvents: [],
    ...overrides,
  });

describe('mergeCalendarEvents', () => {
  it('세 소스를 하나의 목록으로 합친다', () => {
    const merged = merge();
    expect(merged).toHaveLength(3);
    expect(merged.map((event) => event.source)).toEqual([
      'GOOGLE',
      'NOTION',
      'CUSTOM',
    ]);
  });

  it('연동 이벤트는 발생일 기준 단일 일정으로 변환한다', () => {
    const [google, notion] = merge();

    expect(google).toMatchObject({
      id: 'google-g1',
      eventType: 'SINGLE',
      start: '2026-03-20', // datetime → 날짜로 정규화
    });
    expect(notion).toMatchObject({
      id: 'notion-n1',
      eventType: 'SINGLE',
      start: '2026-03-21',
    });
  });

  it('커스텀 이벤트는 반복 규칙을 유지한 원형 그대로 둔다', () => {
    const custom = merge().find((event) => event.source === 'CUSTOM');

    expect(custom).toMatchObject({
      id: 'c1',
      eventType: 'RECURRING',
      recurrence: { frequency: 'WEEKLY', weekdays: [5] },
    });
  });

  it('숨긴 연동 이벤트는 제외한다', () => {
    const merged = merge({
      hiddenCalendarEvents: [
        { source: 'GOOGLE' as const, eventId: 'g1' },
        { source: 'NOTION' as const, eventId: 'n1' },
      ],
    });

    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe('CUSTOM');
  });

  it('다른 소스의 같은 id는 숨김 대상이 아니다', () => {
    const merged = merge({
      hiddenCalendarEvents: [{ source: 'NOTION' as const, eventId: 'g1' }],
    });

    expect(merged).toHaveLength(3);
  });

  it('날짜를 해석할 수 없는 Google 이벤트는 제외한다', () => {
    const merged = merge({
      googleCalendarEvents: [{ ...googleEvent, start: 'invalid-date' }],
    });

    expect(merged.some((event) => event.source === 'GOOGLE')).toBe(false);
  });
});
