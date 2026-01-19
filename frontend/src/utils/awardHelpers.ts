import { Award, SemesterTerm } from '@/types/club';

export const formatSemesterLabel = (award: Award): string | null => {
  if (award?.year && award?.semester) {
    const semesterLabel =
      award.semester === SemesterTerm.FIRST ? '1학기' : '2학기';
    return `${award.year} ${semesterLabel}`;
  }
  return null;
};

export const getAwardKey = (award: Award, index: number): string =>
  `${award.year}-${award.semester}-${index}`;
