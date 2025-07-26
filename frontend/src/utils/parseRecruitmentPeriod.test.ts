import { parseRecruitmentPeriod } from './recruitmentPeriodParser.ts';

describe('parseRecruitmentPeriod 함수 테스트', () => {
  it('올바른 형식의 날짜를 파싱한다.', () => {
    const input = '2024.03.20 14:00 ~ 2024.03.25 18:00';
    const result = parseRecruitmentPeriod(input);

    expect(result.recruitmentStart).toEqual(new Date('2024-03-20T14:00:00'));
    expect(result.recruitmentEnd).toEqual(new Date('2024-03-25T18:00:00'));
  });

  it('날짜가 기간형식이 아닌 단일 날짜 형식인 경우 null을 반환한다.', () => {
    const input = '2024.03.20 14:00';
    const result = parseRecruitmentPeriod(input);

    expect(result.recruitmentStart).toBeNull();
    expect(result.recruitmentEnd).toBeNull();
  });

  it('빈 문자열이라면 null을 반환한다.', () => {
    const input = '';
    const result = parseRecruitmentPeriod(input);

    expect(result.recruitmentStart).toBeNull();
    expect(result.recruitmentEnd).toBeNull();
  });

  it('날짜 사이 ~가 없다면 null을 반환한다.', () => {
    const input = '2024.03.20 14:00 - 2024.03.25 18:00';
    const result = parseRecruitmentPeriod(input);

    expect(result.recruitmentStart).toBeNull();
    expect(result.recruitmentEnd).toBeNull();
  });
});
