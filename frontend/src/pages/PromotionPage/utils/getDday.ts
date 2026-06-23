const stripTime = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const getDDay = (eventStartDate: string, eventEndDate: string) => {
  const today = stripTime(new Date());
  const startDate = stripTime(new Date(eventStartDate));
  const endDate = stripTime(new Date(eventEndDate));

  if (today < startDate) {
    const remainingDays = Math.round(
      (startDate.getTime() - today.getTime()) / ONE_DAY_MS,
    );
    return remainingDays;
  }

  if (today >= startDate && today <= endDate) {
    return 0;
  }

  return -1;
};
