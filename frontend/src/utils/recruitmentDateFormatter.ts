import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatRecruitmentDateTime = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'yyyy년 MM월 dd일 (eee) HH:mm', { locale: ko });
};
