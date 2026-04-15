export const getDDay = (eventStartDate: string, eventEndDate: string) => {
  const now = new Date();
  const eventStart = new Date(eventStartDate);
  const eventEnd = new Date(eventEndDate);

  // Helper function to compare if two dates are on the same calendar day
  const isSameCalendarDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // 1. If the current date is after the event end date, the event is over.
  //    Using `eventEnd.getTime()` ensures precise comparison up to the last millisecond of the event.
  if (now.getTime() > eventEnd.getTime()) {
    return -1;
  }

  // 2. If the current calendar day is the same as the event start calendar day, it's D-Day.
  //    This handles the case where the event starts later today, or is ongoing today.
  if (isSameCalendarDay(now, eventStart)) {
    return 0;
  }

  // 3. If the current time is before the event start time (meaning event is in the future),
  //    calculate remaining days.
  if (now.getTime() < eventStart.getTime()) {
    // Normalize `now` and `eventStart` to midnight of their respective days for calculation
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const eventStartMidnight = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate()).getTime();

    const timeDifference = eventStartMidnight - nowMidnight;
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return remainingDays;
  }

  // 4. If none of the above, and the current time is within the event period,
  //    it means the event started on a previous day and is still ongoing.
  //    This covers cases like eventStart: 2026-03-25, now: 2026-03-26 (event is ongoing)
  if (now.getTime() >= eventStart.getTime() && now.getTime() <= eventEnd.getTime()) {
      return 0; // Event is ongoing (D-Day)
  }

  // Should not reach here if logic is sound, but as a fallback
  return -1;
};