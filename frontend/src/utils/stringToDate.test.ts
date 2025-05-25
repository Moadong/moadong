import { stringToDate } from './stringToDate';

describe('stringToDate 함수 테스트', () => {
  it('날짜와 시간이 포함된 문자열을 Date 객체로 정확히 바꾼다', () => {
    const input = '2025.05.25 13:45';
    const result = new Date('2025-05-25T13:45:00');
    expect(stringToDate(input)).toEqual(result);
  });

  it('자정 시간 "YYYY.MM.DD 00:00" 형식을 올바르게 Date 객체로 변환한다', () => {
    const input = '2025.05.25 00:00';
    const result = new Date('2025-05-25T00:00:00');
    expect(stringToDate(input)).toEqual(result);
  });

  it('공백이 없는 문자열이 주어지면 예외를 발생시킨다.', () => {
    const input = '2025.05.2513:45';
    expect(() => stringToDate(input)).toThrow(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  });

  it('시간 형식이 누락된 경우 예외가 발생한다', () => {
    const input = '2025.05.25 ';
    expect(() => stringToDate(input)).toThrow(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  });
});
