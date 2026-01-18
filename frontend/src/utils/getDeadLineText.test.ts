import getDeadlineText from './getDeadLineText';

describe('getDeadlineText 함수 테스트', () => {
  it.each([
    [
      '오늘이 모집 종료일인 경우',
      new Date('2025-04-01'),
      new Date('2025-04-10'),
      '2025-04-10',
      'OPEN',
      'D-Day',
    ],
    [
      '모집 종료일까지 5일 남은 경우',
      new Date('2025-04-01'),
      new Date('2025-04-10'),
      '2025-04-05',
      'OPEN',
      'D-5',
    ],
    [
      '오늘이 모집 종료일 이후인 경우',
      new Date('2025-04-01'),
      new Date('2025-04-10'),
      '2025-04-11',
      'CLOSED',
      '모집 마감',
    ],
    [
      '모집 시작일이 아직 남은 경우 (시간 포함)',
      new Date('2025-04-01T09:00:00'),
      new Date('2025-04-10'),
      '2025-03-30',
      'UPCOMING',
      '4월 1일 09:00 모집 시작',
    ],
    [
      '모집 시작 시간이 00:00인 경우',
      new Date('2025-04-01T00:00:00'),
      new Date('2025-04-10'),
      '2025-03-30',
      'UPCOMING',
      '4월 1일 모집 시작',
    ],
  ])(
    '%s',
    (
      _,
      recruitmentStart,
      recruitmentEnd,
      todayStr,
      recruitmentStatus,
      expected,
    ) => {
      const today = new Date(todayStr);
      expect(
        getDeadlineText(
          recruitmentStart,
          recruitmentEnd,
          recruitmentStatus,
          today,
        ),
      ).toBe(expected);
    },
  );

  it('모집 기간이 null인 경우 모집 마감을 반환해야 한다', () => {
    expect(getDeadlineText(null, null, 'CLOSED')).toBe('모집 마감');
  });

  it('모집 중 상태인데 모집 종료일까지 1년 이상 남으면 상시 모집을 반환해야 한다', () => {
    expect(
      getDeadlineText(
        new Date('2025-01-01'),
        new Date('2027-01-01'),
        'OPEN',
        new Date('2025-01-01'),
      ),
    ).toBe('상시 모집');
  });
});
