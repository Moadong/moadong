const KST_TIME_ZONE = 'Asia/Seoul';
const MAX_STATISTICS_RANGE_DAYS = 370;
const DATE_KEY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: KST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export interface StatisticsDateRange {
  from: string;
  to: string;
}

export const toUtcDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateKeyToUtcDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const getTodayKstDateKey = () => {
  const parts = DATE_KEY_FORMATTER.formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
};

export const getRecentDateRange = (days: number): StatisticsDateRange => {
  const today = getTodayKstDateKey();
  const start = dateKeyToUtcDate(today);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return {
    from: toUtcDateKey(start),
    to: today,
  };
};

const getInclusiveDays = (from: string, to: string) => {
  const fromTime = dateKeyToUtcDate(from).getTime();
  const toTime = dateKeyToUtcDate(to).getTime();
  return Math.floor((toTime - fromTime) / (1000 * 60 * 60 * 24)) + 1;
};

export const validateStatisticsDateRange = ({
  from,
  to,
}: StatisticsDateRange) => {
  if (!from || !to) {
    return '시작일과 종료일을 선택해주세요.';
  }
  if (from > to) {
    return '시작일은 종료일보다 늦을 수 없습니다.';
  }
  if (to > getTodayKstDateKey()) {
    return '오늘 이후 날짜는 조회할 수 없습니다.';
  }
  if (getInclusiveDays(from, to) > MAX_STATISTICS_RANGE_DAYS) {
    return '최대 370일까지 조회할 수 있습니다.';
  }
  return null;
};
