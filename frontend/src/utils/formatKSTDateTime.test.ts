import {
  formatKSTDate,
  formatKSTDateTime,
  formatKSTDateTimeFull,
} from './formatKSTDateTime';

describe('formatKSTDateTime', () => {
  it('UTC 시간을 KST로 변환한다', () => {
    const utc = '2026-03-25T00:00:00Z';

    const result = formatKSTDateTime(utc, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // 00:00 UTC → 09:00 KST
    expect(result).toMatch(/09|9/);
  });

  it('날짜 포맷 옵션이 정상 적용된다', () => {
    const utc = '2026-03-25T00:00:00Z';

    const result = formatKSTDateTime(utc, {
      month: 'long',
      day: 'numeric',
    });

    expect(result).toContain('3월');
    expect(result).toContain('25');
  });

  it('빈 값이면 빈 문자열 반환', () => {
    expect(formatKSTDateTime('', {})).toBe('');
  });
});

describe('formatKSTDate', () => {
  it('KST 기준 날짜만 올바르게 반환한다', () => {
    const utc = '2026-03-25T16:00:00Z';
    // → KST: 3월 26일

    const result = formatKSTDate(utc);

    expect(result).toContain('3월');
    expect(result).toContain('26'); // 날짜 변환 확인
  });
});

describe('formatKSTDateTimeFull', () => {
  it('날짜 + 시간 포맷이 정상 적용된다', () => {
    const utc = '2026-03-25T00:00:00Z';
    // → KST: 09:00

    const result = formatKSTDateTimeFull(utc);

    expect(result).toContain('3월');
    expect(result).toContain('25');
    expect(result).toMatch(/(오전|오후|AM|PM)/); // 한국 시간 포맷 또는 영어 시간 포맷 허용
  });

  it('날짜 경계가 넘어가는 경우도 올바르게 처리한다', () => {
    const utc = '2026-03-25T16:00:00Z';
    // → KST: 3월 26일 01:00

    const result = formatKSTDateTimeFull(utc);

    expect(result).toContain('26'); // 날짜 넘어갔는지 확인
  });
});
