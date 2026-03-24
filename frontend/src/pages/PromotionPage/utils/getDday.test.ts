import { getDDay } from './getDday';

describe('getDDay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('행사 시작 전이면 D-n 반환', () => {
    jest.setSystemTime(new Date('2026-03-20'));

    const result = getDDay(
      '2026-03-25',
      '2026-03-27'
    );

    expect(result).toBe(5);
  });

  it('행사 시작일이면 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-25'));

    const result = getDDay(
      '2026-03-25',
      '2026-03-27'
    );

    expect(result).toBe(0);
  });

  it('행사 중간 날짜도 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-26'));

    const result = getDDay(
      '2026-03-25',
      '2026-03-27'
    );

    expect(result).toBe(0);
  });

  it('행사 마지막 날도 D-Day (0) 반환', () => {
    jest.setSystemTime(new Date('2026-03-27'));

    const result = getDDay(
      '2026-03-25',
      '2026-03-27'
    );

    expect(result).toBe(0);
  });

  it('행사 종료 후이면 -1 반환', () => {
    jest.setSystemTime(new Date('2026-03-28'));

    const result = getDDay(
      '2026-03-25',
      '2026-03-27'
    );

    expect(result).toBe(-1);
  });
});