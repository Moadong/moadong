import { Award, SemesterTerm, SemesterTermType } from '@/types/club';

export const formatSemesterLabel = (award: Award): string | null => {
  if (award?.year && award?.semesterTerm) {
    const semesterLabel =
      award.semesterTerm === SemesterTerm.FIRST ? '1학기' : '2학기';
    return `${award.year} ${semesterLabel}`;
  }
  return null;
};

export const getAwardKey = (award: Award, index: number): string =>
  `${award.year}-${award.semesterTerm}-${index}`;

export const getAwardSortValue = (award: Award): number => {
  const semesterValue = award.semesterTerm === SemesterTerm.FIRST ? 1 : 2;
  return award.year * 10 + semesterValue;
};

export interface SemesterOption {
  year: number;
  semesterTerm: SemesterTermType;
  label: string;
}

const SEMESTER_PAST_YEARS = 3;
const SEMESTER_FUTURE_YEARS = 1;

export const generateSemesterOptions = (
  existingAwards: Award[],
): SemesterOption[] => {
  const currentYear = new Date().getFullYear();
  const options: SemesterOption[] = [];

  for (
    let year = currentYear - SEMESTER_PAST_YEARS;
    year <= currentYear + SEMESTER_FUTURE_YEARS;
    year++
  ) {
    options.push({
      year,
      semesterTerm: SemesterTerm.FIRST,
      label: `${year} 1학기`,
    });
    options.push({
      year,
      semesterTerm: SemesterTerm.SECOND,
      label: `${year} 2학기`,
    });
  }

  return options.filter(
    (opt) =>
      !existingAwards.some(
        (a) => a.year === opt.year && a.semesterTerm === opt.semesterTerm,
      ),
  );
};
