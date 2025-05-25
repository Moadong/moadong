export const stringToDate = (s: string): Date => {
  const [datePart, timePart] = s.split(' ') as [string, string];
  const isoDate = datePart.replace(/\./g, '-');
  return new Date(`${isoDate}T${timePart}:00`);
};

export const parseRecruitmentPeriod = (
  periodStr: string,
): { recruitmentStart: Date | null; recruitmentEnd: Date | null } => {
  const parts = periodStr.split('~').map((s) => s.trim());
  if (parts.length !== 2) {
    return { recruitmentStart: null, recruitmentEnd: null };
  }

  return {
    recruitmentStart: stringToDate(parts[0]),
    recruitmentEnd: stringToDate(parts[1]),
  };
};
