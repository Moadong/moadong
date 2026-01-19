import { Award, SemesterTerm } from '@/types/club';

export const formatSemesterLabel = (award: Award): string | null => {
  const semesterValue = (award as any)?.semesterTerm || award?.semester;

  if (award?.year && semesterValue) {
    const semesterLabel =
      semesterValue === SemesterTerm.FIRST ? '1학기' : '2학기';
    return `${award.year} ${semesterLabel}`;
  }
  return null;
};

export const getAwardKey = (award: Award, index: number): string => {
  const semesterValue = (award as any)?.semesterTerm || award?.semester;
  return `${award.year}-${semesterValue}-${index}`;
};
