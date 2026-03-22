import { formatRecruitmentDateTime } from './recruitmentDateFormatter';

describe('formatRecruitmentDateTime', () => {
  // 현재 날짜 반환 테스트를 위해 시스템 시간을 고정합니다.
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('정상적인 날짜 객체를 받으면 지정된 형식으로 포맷팅해야 한다', () => {
    // 2024년 5월 15일 수요일 14시 30분
    const date = new Date(2024, 4, 15, 14, 30);
    expect(formatRecruitmentDateTime(date)).toBe('2024년 05월 15일 (수) 14:30');
  });

  it('오전 시간대와 한 자릿수 날짜를 올바르게 처리해야 한다 (padStart 확인)', () => {
    // 2024년 1월 5일 금요일 09시 05분
    const date = new Date(2024, 0, 5, 9, 5);
    expect(formatRecruitmentDateTime(date)).toBe('2024년 01월 05일 (금) 09:05');
  });

  it('일요일(배열의 시작)과 토요일(배열의 끝) 요일을 정확히 반환해야 한다', () => {
    const sunday = new Date(2024, 4, 12); // 일요일
    const saturday = new Date(2024, 4, 18); // 토요일

    expect(formatRecruitmentDateTime(sunday)).toContain('(일)');
    expect(formatRecruitmentDateTime(saturday)).toContain('(토)');
  });

  it('연말/연초 등 엣지 케이스를 올바르게 처리해야 한다', () => {
    const newYear = new Date(2024, 11, 31, 23, 59);
    expect(formatRecruitmentDateTime(newYear)).toBe(
      '2024년 12월 31일 (화) 23:59',
    );
  });

  it('date가 null 또는 undefined일 경우 현재 날짜를 반환해야 한다', () => {
    const mockDate = new Date(2026, 2, 21, 14, 0);
    jest.setSystemTime(mockDate);

    expect(formatRecruitmentDateTime(null)).toBe('2026년 03월 21일 (토) 14:00');
    expect(formatRecruitmentDateTime(undefined)).toBe(
      '2026년 03월 21일 (토) 14:00',
    );
    expect(formatRecruitmentDateTime()).toBe('2026년 03월 21일 (토) 14:00');
  });
});
