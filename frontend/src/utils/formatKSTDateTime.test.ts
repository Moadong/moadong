import {
  formatApplicationEditedAt,
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

describe('formatApplicationEditedAt', () => {
  it('"YYYY. M. D 오전/오후 H:MM" 형식으로 반환한다', () => {
    // 2025-07-01T03:46:00Z → KST 2025-07-01 12:46 (오후)
    const result = formatApplicationEditedAt('2025-07-01T03:46:00Z');
    expect(result).toBe('2025. 7. 1 오후 12:46');
  });

  it('자정(00:00 KST)은 오전 12:00으로 반환한다', () => {
    // 2025-07-01T15:00:00Z → KST 2025-07-02 00:00
    const result = formatApplicationEditedAt('2025-07-01T15:00:00Z');
    expect(result).toBe('2025. 7. 2 오전 12:00');
  });

  it('UTC 날짜 경계를 넘는 경우 KST 기준으로 처리한다', () => {
    // 2025-07-01T16:00:00Z → KST 2025-07-02 01:00 (오전)
    const result = formatApplicationEditedAt('2025-07-01T16:00:00Z');
    expect(result).toBe('2025. 7. 2 오전 1:00');
  });

  it('빈 문자열이면 빈 문자열을 반환한다', () => {
    expect(formatApplicationEditedAt('')).toBe('');
  });

  it('유효하지 않은 날짜면 빈 문자열을 반환한다', () => {
    expect(formatApplicationEditedAt('not-a-date')).toBe('');
  });
});

describe('formatKSTDateTimeFull', () => {
  it('날짜 + 시간 포맷이 정상 적용된다', () => {
    const utc = '2026-03-25T00:00:00Z';
    // → KST: 09:00

    const result = formatKSTDateTimeFull(utc);

    expect(result).toContain('3월');
    expect(result).toContain('25');
    expect(result).toMatch(/오전|오후/); // 한국 시간 포맷
  });

  it('날짜 경계가 넘어가는 경우도 올바르게 처리한다', () => {
    const utc = '2026-03-25T16:00:00Z';
    // → KST: 3월 26일 01:00

    const result = formatKSTDateTimeFull(utc);

    expect(result).toContain('26'); // 날짜 넘어갔는지 확인
  });
});
