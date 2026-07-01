import { SemesterTerm } from '@/types/club';
import { getSemesterTerm } from './semester';

describe('getSemesterTerm', () => {
  it('1~6월(0-indexed 0~5)은 FIRST를 반환한다', () => {
    for (let month = 0; month <= 5; month += 1) {
      expect(getSemesterTerm(month)).toBe(SemesterTerm.FIRST);
    }
  });

  it('7~12월(0-indexed 6~11)은 SECOND를 반환한다', () => {
    for (let month = 6; month <= 11; month += 1) {
      expect(getSemesterTerm(month)).toBe(SemesterTerm.SECOND);
    }
  });

  it('6월/7월 경계에서 백엔드 규칙과 일치한다 (800-7 방지)', () => {
    expect(getSemesterTerm(5)).toBe(SemesterTerm.FIRST); // 6월
    expect(getSemesterTerm(6)).toBe(SemesterTerm.SECOND); // 7월
  });
});
