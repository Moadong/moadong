export function parseRecruitmentPeriod(periodStr: string): {
  recruitmentStart: Date | null;
  recruitmentEnd: Date | null;
} {
  const parts = periodStr.split('~').map((s) => s.trim());
  if (parts.length !== 2) {
    return { recruitmentStart: null, recruitmentEnd: null };
  }

  const convertToDate = (s: string): Date => {
    const [datePart, timePart] = s.split(' ');
    const isoDate = datePart.replace(/\./g, '-');
    return new Date(`${isoDate}T${timePart}:00`);
  };

  return {
    recruitmentStart: convertToDate(parts[0]),
    recruitmentEnd: convertToDate(parts[1]),
  };
}
