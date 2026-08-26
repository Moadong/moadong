import type { ClubCalendarEvent } from '@/types/club';
import { expandEventOccurrences } from './eventOccurrences';

const range = {
  start: new Date(2026, 2, 1), // 2026-03-01
  end: new Date(2026, 2, 31), // 2026-03-31
};

const baseEvent = (
  overrides: Partial<ClubCalendarEvent>,
): ClubCalendarEvent => ({
  id: 'event-1',
  title: '정기모임',
  start: '2026-03-10',
  source: 'CUSTOM',
  ...overrides,
});

const dateKeysOf = (events: ClubCalendarEvent[]) =>
  expandEventOccurrences(events, range.start, range.end).map(
    (occurrence) => occurrence.dateKey,
  );

describe('expandEventOccurrences', () => {
  it('SINGLE(eventType 없음 포함)은 start 하루만 전개한다', () => {
    expect(dateKeysOf([baseEvent({})])).toEqual(['2026-03-10']);
    expect(dateKeysOf([baseEvent({ eventType: 'SINGLE' })])).toEqual([
      '2026-03-10',
    ]);
  });

  it('범위 밖 SINGLE은 제외한다', () => {
    expect(dateKeysOf([baseEvent({ start: '2026-04-01' })])).toEqual([]);
  });

  it('PERIOD는 start~end 각 날로 전개한다', () => {
    expect(
      dateKeysOf([
        baseEvent({
          eventType: 'PERIOD',
          start: '2026-03-30',
          end: '2026-04-02',
        }),
      ]),
    ).toEqual(['2026-03-30', '2026-03-31']);
  });

  it('MULTI는 dates 각각으로 전개한다', () => {
    expect(
      dateKeysOf([
        baseEvent({
          eventType: 'MULTI',
          dates: ['2026-03-10', '2026-03-16', '2026-04-01'],
        }),
      ]),
    ).toEqual(['2026-03-10', '2026-03-16']);
  });

  it('RECURRING WEEKLY는 지정 요일마다 전개한다 (금·토)', () => {
    const keys = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2026-03-10',
        recurrence: { frequency: 'WEEKLY', weekdays: [5, 6] },
      }),
    ]);
    // 2026-03-10(화) 이후 금·토: 13,14,20,21,27,28
    expect(keys).toEqual([
      '2026-03-13',
      '2026-03-14',
      '2026-03-20',
      '2026-03-21',
      '2026-03-27',
      '2026-03-28',
    ]);
  });

  it('WEEKLY에서 요일 미지정이면 시작일 요일을 따른다', () => {
    const keys = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2026-03-10', // 화요일
        recurrence: { frequency: 'WEEKLY' },
      }),
    ]);
    expect(keys).toEqual([
      '2026-03-10',
      '2026-03-17',
      '2026-03-24',
      '2026-03-31',
    ]);
  });

  it('recurrence.end 이후에는 전개하지 않는다', () => {
    const keys = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2026-03-10',
        recurrence: { frequency: 'WEEKLY', end: '2026-03-20' },
      }),
    ]);
    expect(keys).toEqual(['2026-03-10', '2026-03-17']);
  });

  it('excludedDates는 전개에서 제외한다 (이 일정만 삭제)', () => {
    const keys = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2026-03-10',
        recurrence: { frequency: 'WEEKLY', excludedDates: ['2026-03-17'] },
      }),
    ]);
    expect(keys).toEqual(['2026-03-10', '2026-03-24', '2026-03-31']);
  });

  it('RECURRING MONTHLY는 매월 시작일의 일(day)에 전개한다', () => {
    const keys = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2026-01-10',
        recurrence: { frequency: 'MONTHLY' },
      }),
    ]);
    expect(keys).toEqual(['2026-03-10']);
  });

  it('RECURRING YEARLY는 매년 같은 월/일에 전개한다', () => {
    const inRange = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2025-03-15',
        recurrence: { frequency: 'YEARLY' },
      }),
    ]);
    expect(inRange).toEqual(['2026-03-15']);

    const outOfRange = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2025-05-15',
        recurrence: { frequency: 'YEARLY' },
      }),
    ]);
    expect(outOfRange).toEqual([]);
  });

  it('시리즈 시작 전에는 전개하지 않는다', () => {
    const keys = dateKeysOf([
      baseEvent({
        eventType: 'RECURRING',
        start: '2026-03-20',
        recurrence: { frequency: 'WEEKLY', weekdays: [0, 1, 2, 3, 4, 5, 6] },
      }),
    ]);
    expect(keys[0]).toBe('2026-03-20');
    expect(keys).toHaveLength(12); // 3/20~3/31
  });
});
