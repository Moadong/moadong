import formatTimeAgo from './formatTimeAgo';

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

describe('formatTimeAgo', () => {
  it('5일 전을 한국어로 표시한다', () => {
    expect(formatTimeAgo(daysAgo(5))).toBe('5일 전');
  });

  it('1일 전을 한국어로 표시한다', () => {
    expect(formatTimeAgo(daysAgo(1))).toBe('1일 전');
  });

  it('분 단위도 한국어로 표시한다', () => {
    expect(formatTimeAgo(minutesAgo(30))).toBe('30분 전');
  });

  it('방금 전은 초 단위로 표시한다', () => {
    expect(formatTimeAgo(new Date().toISOString())).toMatch(/초 전$/);
  });
});
