import getDeadlineText from './getDeadLineText';

const recruitmentStart = new Date('2025-04-01');
const recruitmentEnd = new Date('2025-04-10');

describe('getDeadlineText 함수 테스트', () => {
  it.each([
    ['오늘이 모집 종료일인 경우', '2025-04-10', 'D-Day'],
    ['모집 종료일까지 5일 남은 경우', '2025-04-05', 'D-5'],
    ['오늘이 모집 종료일 이후인 경우', '2025-04-11', '모집 마감'],
    ['모집 시작일이 아직 남은 경우', '2025-03-30', '모집 전'],
  ])('%s', (_, todayStr, expected) => {
    const today = new Date(todayStr);
    expect(getDeadlineText(recruitmentStart, recruitmentEnd, today)).toBe(
      expected,
    );
  });

  it('모집 기간이 null인 경우 모집 마감을 반환해야 한다', () => {
    expect(getDeadlineText(null, null)).toBe('모집 마감');
  });
});
