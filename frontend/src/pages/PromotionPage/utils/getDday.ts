import { toZonedTime } from 'date-fns-tz';
import { startOfDay, differenceInCalendarDays } from 'date-fns';

const KST_TIMEZONE = 'Asia/Seoul';

export const getDDay = (eventStartDate: string, eventEndDate: string) => {
  const now = new Date();
  const kstNow = toZonedTime(now, KST_TIMEZONE);
  const kstStartDate = toZonedTime(new Date(eventStartDate), KST_TIMEZONE);
  const kstEndDate = toZonedTime(new Date(eventEndDate), KST_TIMEZONE);

  const startOfTodayKst = startOfDay(kstNow);
  const startOfEventDateKst = startOfDay(kstStartDate);
  const startOfEndDateKst = startOfDay(kstEndDate);

  if (startOfTodayKst < startOfEventDateKst) {
    const remainingDays = differenceInCalendarDays(startOfEventDateKst, startOfTodayKst);
    return remainingDays;
  }

  if (startOfTodayKst >= startOfEventDateKst && startOfTodayKst <= startOfEndDateKst) {
    return 0;
  }

  return -1;
};
