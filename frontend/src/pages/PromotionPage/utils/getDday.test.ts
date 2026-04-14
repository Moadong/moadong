import { getDDay } from './getDday';

describe('getDDay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('행사 시작 전이면 D-n 반환', () => {
    jest.setSystemTime(new Date('2026-03-20T00:00:00Z'));

    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T00:00:00Z');

    expect(result).toBe(5);
  });

  it('행사 시작일이면 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-25T00:00:00Z'));

    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T00:00:00Z');

    expect(result).toBe(0);
  });

  it('행사 중간 날짜도 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-26T12:00:00Z'));

    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T00:00:00Z');

    expect(result).toBe(0);
  });

  it('행사 마지막 날도 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-27T00:00:00Z'));

    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T23:59:59Z');

    expect(result).toBe(0);
  });

  it('행사 시작일, 시스템 로컬 시간과 이벤트 시작일의 UTC 날짜 차이로 D-1이 되는 버그 수정', () => {
    // Simulate KST timezone where it's 2026-03-25 08:00:00 KST (user's D-day)
    // which is 2026-03-24 23:00:00Z UTC
    jest.setSystemTime(new Date('2026-03-25T08:00:00+09:00'));

    // eventStartDate is 2026-03-25T00:00:00Z (UTC date string)
    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T00:00:00Z');

    // With the fix, it should now return 0 (D-Day)
    expect(result).toBe(0);
  });
});
