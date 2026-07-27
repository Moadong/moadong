import { Award, SemesterTerm, SemesterTermType } from '@/types/club';
import {
  formatSemesterLabel,
  generateSemesterOptions,
  getAwardKey,
  getAwardSortValue,
} from './awardHelpers';

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

  const currentYear = new Date().getFullYear();

  const validAward2024First = createAward(2024, SemesterTerm.FIRST);
  const validAward2024Second = createAward(2024, SemesterTerm.SECOND);
  const validAward2023First = createAward(2023, SemesterTerm.FIRST);
  const validAward2023Second = createAward(2023, SemesterTerm.SECOND);
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

  describe('getAwardSortValue', () => {
    it('1학기는 2학기보다 작은 값을 반환해야 한다', () => {
      const first = getAwardSortValue(validAward2024First);
      const second = getAwardSortValue(validAward2024Second);

      expect(first).toBeLessThan(second);
    });

    it('연도가 클수록 더 큰 값을 반환해야 한다', () => {
      const award2023 = getAwardSortValue(validAward2023First);
      const award2024 = getAwardSortValue(validAward2024First);

      expect(award2023).toBeLessThan(award2024);
    });

    it('이전 연도의 2학기보다 다음 연도의 1학기가 더 커야 한다', () => {
      const prev2nd = getAwardSortValue(validAward2023Second);
      const next1st = getAwardSortValue(validAward2024First);

      expect(prev2nd).toBeLessThan(next1st);
    });
  });

  describe('generateSemesterOptions', () => {
    it('현재 연도 기준 -3년 ~ +1년 범위의 옵션을 반환해야 한다', () => {
      const options = generateSemesterOptions([]);
      const years = [...new Set(options.map((o) => o.year))];

      expect(years).toEqual([
        currentYear - 3,
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
      ]);
    });

    it('각 연도에 1학기와 2학기가 포함되어야 한다', () => {
      const options = generateSemesterOptions([]);

      expect(options).toHaveLength(10);
      expect(
        options.filter((o) => o.semesterTerm === SemesterTerm.FIRST),
      ).toHaveLength(5);
      expect(
        options.filter((o) => o.semesterTerm === SemesterTerm.SECOND),
      ).toHaveLength(5);
    });

    it('이미 존재하는 학기는 옵션에서 제외해야 한다', () => {
      const options = generateSemesterOptions([validAward2024First]);

      expect(
        options.some(
          (o) => o.year === 2024 && o.semesterTerm === SemesterTerm.FIRST,
        ),
      ).toBe(false);
    });

    it('여러 기존 수상이 있을 때 해당 학기들을 모두 제외해야 한다', () => {
      const existing = [validAward2024First, validAward2024Second];
      const options = generateSemesterOptions(existing);

      expect(options.some((o) => o.year === 2024)).toBe(false);
      expect(options).toHaveLength(8);
    });

    it('기존 수상이 없으면 전체 옵션을 반환해야 한다', () => {
      const options = generateSemesterOptions([]);

      expect(options).toHaveLength(10);
    });

    it('label 형식이 올바르게 생성되어야 한다', () => {
      const options = generateSemesterOptions([]);
      const first = options.find(
        (o) => o.year === currentYear && o.semesterTerm === SemesterTerm.FIRST,
      );
      const second = options.find(
        (o) => o.year === currentYear && o.semesterTerm === SemesterTerm.SECOND,
      );

      expect(first?.label).toBe(`${currentYear} 1학기`);
      expect(second?.label).toBe(`${currentYear} 2학기`);
    });
  });
});
