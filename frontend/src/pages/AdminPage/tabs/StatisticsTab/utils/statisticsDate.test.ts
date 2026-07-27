import {
  getRecentDateRange,
  getTodayKstDateKey,
  validateStatisticsDateRange,
} from './statisticsDate';

describe('statisticsDate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('KST 기준 오늘 날짜 키를 반환한다', () => {
    jest.setSystemTime(new Date('2026-07-08T15:30:00Z'));

    expect(getTodayKstDateKey()).toBe('2026-07-09');
  });

  it('최근 N일 범위는 종료일을 포함한다', () => {
    jest.setSystemTime(new Date('2026-07-08T15:30:00Z'));

    expect(getRecentDateRange(7)).toEqual({
      startDate: '2026-07-03',
      endDate: '2026-07-09',
    });
  });

  it('종료일이 KST 오늘 이후면 검증 오류를 반환한다', () => {
    jest.setSystemTime(new Date('2026-07-08T15:30:00Z'));

    expect(
      validateStatisticsDateRange({
        startDate: '2026-07-09',
        endDate: '2026-07-10',
      }),
    ).toBe('오늘 이후 날짜는 조회할 수 없습니다.');
  });

  it('조회 기간이 370일을 초과하면 검증 오류를 반환한다', () => {
    jest.setSystemTime(new Date('2026-07-08T15:30:00Z'));

    expect(
      validateStatisticsDateRange({
        startDate: '2025-07-04',
        endDate: '2026-07-09',
      }),
    ).toBe('최대 370일까지 조회할 수 있습니다.');
  });
});
