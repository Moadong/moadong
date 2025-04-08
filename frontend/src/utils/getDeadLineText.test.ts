import getDeadlineText from './getDeadLineText';

describe('getDeadlineText 함수 테스트', () => {
  test.each([
    [
      new Date('2025-04-01'),
      new Date('2025-04-10'),
      new Date('2025-04-10'),
      'D-Day',
    ],
    [
      new Date('2025-04-01'),
      new Date('2025-04-10'),
      new Date('2025-04-05'),
      'D-5',
    ],
    [
      new Date('2025-04-01'),
      new Date('2025-04-10'),
      new Date('2025-04-11'),
      '모집 마감',
    ],
    [null, null, new Date('2025-04-10'), '모집 마감'],
  ])(
    'recruitmentStart: %s, recruitmentEnd: %s, today: %s => %s',
    (recruitmentStart, recruitmentEnd, today, expectedResult) => {
      expect(getDeadlineText(recruitmentStart, recruitmentEnd, today)).toBe(
        expectedResult,
      );
    },
  );
});
