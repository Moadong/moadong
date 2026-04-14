const getKSTDateComponents = (date: Date) => {
    // Convert the date to its UTC milliseconds
    const utcMs = date.getTime();
    // KST is UTC+9. So, to get the KST "local" time from UTC, add 9 hours in milliseconds.
    const kstMs = utcMs + (9 * 60 * 60 * 1000); 
    // Create a new Date object from this adjusted timestamp. 
    // This Date object will have its getUTC* methods reflecting the KST date.
    const kstDate = new Date(kstMs); 
    return {
        year: kstDate.getUTCFullYear(),
        month: kstDate.getUTCMonth(),
        date: kstDate.getUTCDate()
    };
};

const getStartOfDayKSTMs = (date: Date) => {
    const { year, month, date: day } = getKSTDateComponents(date);
    // Now construct a new UTC Date object using these KST components at 00:00:00 UTC
    // This will represent the start of the KST day, in UTC milliseconds.
    return Date.UTC(year, month, day);
};

export const getDDay = (eventStartDateStr: string, eventEndDateStr: string) => {
  const now = new Date();
  const todayMs = getStartOfDayKSTMs(now);
  
  const eventStart = new Date(eventStartDateStr);
  const eventStartDayMs = getStartOfDayKSTMs(eventStart);
  
  const eventEnd = new Date(eventEndDateStr);
  const eventEndDayMs = getStartOfDayKSTMs(eventEnd);

  if (todayMs < eventStartDayMs) {
    const remainingTimeUntilStart = eventStartDayMs - todayMs;
    const remainingDays = Math.floor(remainingTimeUntilStart / (1000 * 60 * 60 * 24));
    return remainingDays;
  }

  if (todayMs >= eventStartDayMs && todayMs <= eventEndDayMs) {
    return 0;
  }

  return -1;
};

