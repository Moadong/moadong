import getDeadlineText from './getDeadLineText';

describe('getDeadlineText 함수 테스트', () => {
  it('오늘이 모집 종료일인 경우 D-Day를 반환해야 한다', () => {
    const recruitmentStart = new Date('2025-04-01');
    const recruitmentEnd = new Date('2025-04-10');
    const today = new Date('2025-04-10');
    expect(getDeadlineText(recruitmentStart, recruitmentEnd, today)).toBe(
      'D-Day',
    );
  });

  it('모집 종료일까지 5일 남은 경우 D-5를 반환해야 한다', () => {
    const recruitmentStart = new Date('2025-04-01');
    const recruitmentEnd = new Date('2025-04-10');
    const today = new Date('2025-04-05');
    expect(getDeadlineText(recruitmentStart, recruitmentEnd, today)).toBe(
      'D-5',
    );
  });

  it('오늘이 모집 종료일 이후인 경우 모집 마감을 반환해야 한다', () => {
    const recruitmentStart = new Date('2025-04-01');
    const recruitmentEnd = new Date('2025-04-10');
    const today = new Date('2025-04-11');
    expect(getDeadlineText(recruitmentStart, recruitmentEnd, today)).toBe(
      '모집 마감',
    );
  });

  it('모집 기간이 null인 경우 모집 마감을 반환해야 한다', () => {
    expect(getDeadlineText(null, null)).toBe('모집 마감');
  });
});
