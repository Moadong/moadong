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

  it('행사 시작일 당일 시작 시각 전이어도 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-25T00:01:00Z'));

    const result = getDDay('2026-03-25T14:00:00Z', '2026-03-27T00:00:00Z');

    expect(result).toBe(0);
  });

  it('행사 시작 하루 전이면 D-1 반환', () => {
    jest.setSystemTime(new Date('2026-03-24T00:00:00Z'));

    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T00:00:00Z');

    expect(result).toBe(1);
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

  it('행사 종료 후이면 -1 반환', () => {
    jest.setSystemTime(new Date('2026-03-28T00:00:00Z'));

    const result = getDDay('2026-03-25T00:00:00Z', '2026-03-27T00:00:00Z');

    expect(result).toBe(-1);
  });
});
