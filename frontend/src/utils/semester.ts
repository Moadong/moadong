import { SemesterTerm, SemesterTermType } from '@/types/club';

/**
 * 0-indexed 월(`Date.getMonth()`, 1월=0 … 12월=11)로 학기를 판정한다.
 * 백엔드 판정 규칙(1-indexed `month < 7` → FIRST)과 동일하게 맞추기 위해
 * 0-indexed 기준 `< 6`(1~6월)을 FIRST, 그 외(7~12월)를 SECOND로 본다.
 */
export const getSemesterTerm = (month0Indexed: number): SemesterTermType =>
  month0Indexed < 6 ? SemesterTerm.FIRST : SemesterTerm.SECOND;
