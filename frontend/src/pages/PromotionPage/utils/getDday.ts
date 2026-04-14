import { formatInTimeZone } from 'date-fns-tz';
import { differenceInCalendarDays } from 'date-fns';

const KST_TIMEZONE = 'Asia/Seoul';

export const getDDay = (eventStartDate: string, eventEndDate: string) => {
  const now = new Date();
  
  // KST 기준으로 현재 날짜와 시작/종료 날짜를 'yyyy-MM-dd' 형식의 문자열로 변환
  const todayStr = formatInTimeZone(now, KST_TIMEZONE, 'yyyy-MM-dd');
  const startStr = formatInTimeZone(new Date(eventStartDate), KST_TIMEZONE, 'yyyy-MM-dd');
  const endStr = formatInTimeZone(new Date(eventEndDate), KST_TIMEZONE, 'yyyy-MM-dd');

  // 시작 전인 경우 (KST 날짜 문자열 비교)
  if (todayStr < startStr) {
    // differenceInCalendarDays는 두 날짜의 달력상 차이를 구함
    // 시스템 타임존의 영향을 피하기 위해 UTC 기준의 날짜 객체를 만들어 비교
    return differenceInCalendarDays(
      new Date(`${startStr}T00:00:00Z`),
      new Date(`${todayStr}T00:00:00Z`)
    );
  }

  // 진행 중인 경우 (시작일 당일 포함)
  if (todayStr >= startStr && todayStr <= endStr) {
    return 0;
  }

  // 종료된 경우
  return -1;
};
