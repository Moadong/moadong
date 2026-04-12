import { formatKSTDate, formatKSTDateTime, formatKSTDateTimeFull } from './formatKSTDateTime';

describe('formatKSTDateTime', () => {
  it('유효한 날짜 문자열을 전달하면 한국 시간으로 포맷팅된 문자열을 반환한다', () => {
    const dateStr = '2023-10-26T10:00:00Z'; // UTC time
    const formatted = formatKSTDateTime(dateStr, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    // KST는 UTC+9 이므로 10:00:00Z는 19:00:00KST가 된다.
    // toContain '2023'와 '10'은 연도와 월이 포함되는지 확인하는 것으로,
    // toContain '26'와 '19'는 날짜와 시간이 포함되는지 확인하는 것
    expect(formatted).toContain('2023');
    expect(formatted).toContain('10');
    expect(formatted).toContain('26'); // 날짜는 26일
    expect(formatted).toMatch(/(오후|PM)\s?0?7/); // 시간은 오후 7시 (19시)
  });

  it('날짜 문자열이 비어있으면 빈 문자열을 반환한다', () => {
    expect(formatKSTDateTime('')).toBe('');
    expect(formatKSTDateTime(null as any)).toBe('');
    expect(formatKSTDateTime(undefined as any)).toBe('');
  });

  it('유효하지 않은 날짜 문자열을 전달하면 빈 문자열을 반환한다', () => {
    expect(formatKSTDateTime('invalid date')).toBe('');
  });

  it('options가 적용된 포맷팅을 반환한다', () => {
    const dateStr = '2023-10-26T10:00:00Z'; // UTC time
    const formatted = formatKSTDateTime(dateStr, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(formatted).toBe('2023년 10월 26일');
  });
});

describe('formatKSTDate', () => {
  it('날짜만 한국 시간으로 포맷팅된 문자열을 반환한다', () => {
    const dateStr = '2023-10-26T10:00:00Z'; // UTC time
    const formatted = formatKSTDate(dateStr);
    expect(formatted).toBe('10월 26일 목요일');
  });

  it('유효하지 않은 날짜 문자열은 빈 문자열을 반환한다', () => {
    expect(formatKSTDate('invalid')).toBe('');
  });
});

describe('formatKSTDateTimeFull', () => {
  it('전체 날짜와 시간을 한국 시간으로 포맷팅된 문자열을 반환한다', () => {
    const dateStr = '2023-10-26T10:00:00Z'; // UTC time
    const formatted = formatKSTDateTimeFull(dateStr);
    expect(formatted).toMatch(/10월 26일 \(목\) (오후|PM) 0?7:00/);
  });

  it('유효하지 않은 날짜 문자열은 빈 문자열을 반환한다', () => {
    expect(formatKSTDateTimeFull('invalid')).toBe('');
  });
});
