import { parse, isValid } from 'date-fns';

export const parseRecruitmentDateString = (s: string): Date => {
  const regex = /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/;
  if (!regex.test(s)) {
    throw new Error(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  }
  const date = parse(s + ' +0000', 'yyyy.MM.dd HH:mm X', new Date());
  if (!isValid(date)) {
    throw new Error(
      '유효하지 않은 날짜 형식입니다. 형식은 "YYYY.MM.DD HH:mm" 이어야 합니다.',
    );
  }
  return date;
};

export const parseRecruitmentPeriod = (
  periodStr: string,
): { recruitmentStart: Date | null; recruitmentEnd: Date | null } => {
  const parts = periodStr.split('~').map((s) => s.trim());
  if (parts.length !== 2) {
    return { recruitmentStart: null, recruitmentEnd: null };
  }

  return {
    recruitmentStart: parseRecruitmentDateString(parts[0]),
    recruitmentEnd: parseRecruitmentDateString(parts[1]),
  };
};
