import { recruitmentDateParser } from './recruitmentDateParser';

describe('모집 마감 날짜 입력 처리', () => {
  it('사용자가 날짜와 시간을 정상 형식으로 입력하면 정확한 날짜로 변환된다', () => {
    const input = '2025.05.25 13:45';
    const result = new Date('2025-05-25T04:45:00Z');
    expect(recruitmentDateParser(input)).toEqual(result);
  });

  it('사용자가 자정(00:00) 시간을 입력해도 올바른 날짜로 처리된다', () => {
    const input = '2025.05.25 00:00';
    const result = new Date('2025-05-24T15:00:00Z');
    expect(recruitmentDateParser(input)).toEqual(result);
  });

  it('날짜와 시간 사이 공백이 없으면 입력 오류로 처리된다', () => {
    const input = '2025.05.2513:45';
    expect(() => recruitmentDateParser(input)).toThrow(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  });

  it('시간을 입력하지 않으면 오류 메시지를 보여준다', () => {
    const input = '2025.05.25 ';
    expect(() => recruitmentDateParser(input)).toThrow(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  });

  it('날짜를 입력하지 않으면 오류 메시지를 보여준다', () => {
    const input = ' 13:45';
    expect(() => recruitmentDateParser(input)).toThrow(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  });

  it('아무 값도 입력하지 않으면 null을 반환한다', () => {
    const input = '';
    expect(recruitmentDateParser(input)).toBeNull();
  });

  it("'미정'을 입력하면 null을 반환한다", () => {
    const input = '미정';
    expect(recruitmentDateParser(input)).toBeNull();
  });

  it('사용자가 지정된 형식이 아닌 날짜를 입력하면 오류를 안내한다', () => {
    const input = '1.1.1 1:1';
    expect(() => recruitmentDateParser(input)).toThrow(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  });
});
