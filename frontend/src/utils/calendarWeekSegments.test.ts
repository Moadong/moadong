import type { ClubCalendarEvent } from '@/types/club';
import { buildWeekEventSegments } from './calendarWeekSegments';

/** 2026-03-15(일) ~ 2026-03-21(토) */
const week = Array.from(
  { length: 7 },
  (_, index) => new Date(2026, 2, 15 + index),
);

const event = (overrides: Partial<ClubCalendarEvent>): ClubCalendarEvent => ({
  id: 'event-1',
  title: '일정',
  start: '2026-03-16',
  source: 'CUSTOM',
  ...overrides,
});

describe('buildWeekEventSegments', () => {
  it('기간 일정은 하나의 연속 막대로 만든다', () => {
    const segments = buildWeekEventSegments(
      [
        event({
          id: 'mt',
          title: 'MT',
          eventType: 'PERIOD',
          start: '2026-03-16',
          end: '2026-03-20',
        }),
      ],
      week,
    );

    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatchObject({
      title: 'MT',
      startIndex: 1, // 월요일
      span: 5, // 16~20
      lane: 0,
      dateKey: '2026-03-16',
    });
  });

  it('주 경계를 넘는 기간 일정은 해당 주 범위로 잘린다', () => {
    const segments = buildWeekEventSegments(
      [
        event({
          id: 'long',
          title: '장기',
          eventType: 'PERIOD',
          start: '2026-03-10',
          end: '2026-03-25',
        }),
      ],
      week,
    );

    expect(segments[0]).toMatchObject({
      startIndex: 0,
      span: 7,
      dateKey: '2026-03-15',
    });
  });

  it('기간 밖의 주에는 막대를 만들지 않는다', () => {
    const segments = buildWeekEventSegments(
      [
        event({
          id: 'past',
          eventType: 'PERIOD',
          start: '2026-03-01',
          end: '2026-03-05',
        }),
      ],
      week,
    );

    expect(segments).toHaveLength(0);
  });

  it('단일 일정은 span 1 칩으로 만든다', () => {
    const segments = buildWeekEventSegments(
      [event({ id: 'single', title: '회의', start: '2026-03-18' })],
      week,
    );

    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatchObject({
      title: '회의',
      startIndex: 3, // 수요일
      span: 1,
    });
  });

  it('다중 일정은 날짜마다 별도 칩으로 만든다', () => {
    const segments = buildWeekEventSegments(
      [
        event({
          id: 'multi',
          title: '특별모임',
          eventType: 'MULTI',
          dates: ['2026-03-15', '2026-03-18', '2026-04-01'],
        }),
      ],
      week,
    );

    expect(segments).toHaveLength(2);
    expect(segments.map((segment) => segment.startIndex)).toEqual([0, 3]);
    expect(segments.every((segment) => segment.span === 1)).toBe(true);
  });

  it('겹치는 일정은 서로 다른 lane에 배정한다', () => {
    const segments = buildWeekEventSegments(
      [
        event({
          id: 'mt',
          title: 'MT',
          eventType: 'PERIOD',
          start: '2026-03-16',
          end: '2026-03-20',
        }),
        event({ id: 'single', title: '회의', start: '2026-03-18' }),
      ],
      week,
    );

    const mt = segments.find((segment) => segment.eventId === 'mt');
    const single = segments.find((segment) => segment.eventId === 'single');
    expect(mt?.lane).toBe(0);
    expect(single?.lane).toBe(1);
  });

  it('겹치지 않는 일정은 같은 lane을 재사용한다', () => {
    const segments = buildWeekEventSegments(
      [
        event({ id: 'a', title: 'A', start: '2026-03-15' }),
        event({ id: 'b', title: 'B', start: '2026-03-20' }),
      ],
      week,
    );

    expect(segments.every((segment) => segment.lane === 0)).toBe(true);
  });

  it('반복 일정은 해당 주의 발생일마다 칩으로 만든다', () => {
    const segments = buildWeekEventSegments(
      [
        event({
          id: 'recurring',
          title: '정기모임',
          eventType: 'RECURRING',
          start: '2026-03-02',
          recurrence: { frequency: 'WEEKLY', weekdays: [5, 6] },
        }),
      ],
      week,
    );

    expect(segments.map((segment) => segment.dateKey)).toEqual([
      '2026-03-20',
      '2026-03-21',
    ]);
  });

  describe('visibleMonth를 주면 그 달 밖으로 색이 새지 않는다', () => {
    /** 2026-08-30(일) ~ 2026-09-05(토): 8월 그리드의 마지막 주이자 9월 그리드의 첫 주 */
    const crossMonthWeek = Array.from(
      { length: 7 },
      (_, index) => new Date(2026, 7, 30 + index),
    );

    const crossMonthEvent = event({
      id: 'festival',
      title: '축제',
      eventType: 'PERIOD',
      start: '2026-08-25',
      end: '2026-09-10',
    });

    it('8월을 보고 있으면 8월 31일에서 끊는다', () => {
      const segments = buildWeekEventSegments(
        [crossMonthEvent],
        crossMonthWeek,
        new Date(2026, 7, 1),
      );

      expect(segments[0]).toMatchObject({
        startIndex: 0,
        span: 2, // 8/30, 8/31
        dateKey: '2026-08-30',
      });
    });

    it('9월을 보고 있으면 9월 1일부터 시작한다', () => {
      const segments = buildWeekEventSegments(
        [crossMonthEvent],
        crossMonthWeek,
        new Date(2026, 8, 1),
      );

      expect(segments[0]).toMatchObject({
        startIndex: 2, // 9/1
        span: 5, // 9/1 ~ 9/5
        dateKey: '2026-09-01',
      });
    });

    it('visibleMonth가 없으면 주 전체를 그대로 덮는다', () => {
      const segments = buildWeekEventSegments(
        [crossMonthEvent],
        crossMonthWeek,
      );

      expect(segments[0]).toMatchObject({ startIndex: 0, span: 7 });
    });
  });
});
