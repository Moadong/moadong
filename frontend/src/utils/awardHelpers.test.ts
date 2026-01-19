import { Award, SemesterTerm, SemesterTermType } from '@/types/club';
import { formatSemesterLabel, getAwardKey } from './awardHelpers';

describe('awardHelpers', () => {
  const createAward = (
    year: number,
    semesterTerm: SemesterTermType,
    achievements: string[] = [],
  ): Award => ({
    year,
    semesterTerm,
    achievements,
  });

  const validAward2024First = createAward(2024, SemesterTerm.FIRST);
  const validAward2024Second = createAward(2024, SemesterTerm.SECOND);
  const validAward2023First = createAward(2023, SemesterTerm.FIRST);
  const validAward2025Second = createAward(2025, SemesterTerm.SECOND);

  describe('formatSemesterLabel', () => {
    it('1학기를 올바른 형식으로 반환해야 한다', () => {
      expect(formatSemesterLabel(validAward2024First)).toBe('2024 1학기');
    });

    it('2학기를 올바른 형식으로 반환해야 한다', () => {
      expect(formatSemesterLabel(validAward2024Second)).toBe('2024 2학기');
    });

    it('year가 없으면 null을 반환해야 한다', () => {
      const award: Partial<Award> = {
        semesterTerm: SemesterTerm.FIRST,
        achievements: [],
      };

      expect(formatSemesterLabel(award as Award)).toBeNull();
    });

    it('semesterTerm이 없으면 null을 반환해야 한다', () => {
      const award: Partial<Award> = {
        year: 2024,
        achievements: [],
      };

      expect(formatSemesterLabel(award as Award)).toBeNull();
    });

    it('year와 semesterTerm이 모두 없으면 null을 반환해야 한다', () => {
      const award: Partial<Award> = {
        achievements: [],
      };

      expect(formatSemesterLabel(award as Award)).toBeNull();
    });

    it('award가 null이면 null을 반환해야 한다', () => {
      expect(formatSemesterLabel(null as unknown as Award)).toBeNull();
    });

    it('award가 undefined이면 null을 반환해야 한다', () => {
      expect(formatSemesterLabel(undefined as unknown as Award)).toBeNull();
    });

    it('다양한 연도를 올바르게 처리해야 한다', () => {
      expect(formatSemesterLabel(validAward2023First)).toBe('2023 1학기');
      expect(formatSemesterLabel(validAward2025Second)).toBe('2025 2학기');
    });
  });

  describe('getAwardKey', () => {
    it('year, semesterTerm, index를 조합한 고유 키를 생성해야 한다', () => {
      expect(getAwardKey(validAward2024First, 0)).toBe('2024-FIRST-0');
    });

    it('인덱스가 다르면 다른 키를 생성해야 한다', () => {
      const key1 = getAwardKey(validAward2024First, 0);
      const key2 = getAwardKey(validAward2024First, 1);

      expect(key1).not.toBe(key2);
      expect(key1).toBe('2024-FIRST-0');
      expect(key2).toBe('2024-FIRST-1');
    });

    it('학기가 다르면 다른 키를 생성해야 한다', () => {
      expect(getAwardKey(validAward2024First, 0)).toBe('2024-FIRST-0');
      expect(getAwardKey(validAward2024Second, 0)).toBe('2024-SECOND-0');
    });

    it('연도가 다르면 다른 키를 생성해야 한다', () => {
      const award2024 = createAward(2024, SemesterTerm.FIRST);

      expect(getAwardKey(validAward2023First, 0)).toBe('2023-FIRST-0');
      expect(getAwardKey(award2024, 0)).toBe('2024-FIRST-0');
    });

    it('큰 인덱스 숫자를 올바르게 처리해야 한다', () => {
      expect(getAwardKey(validAward2024First, 999)).toBe('2024-FIRST-999');
    });
  });
});
