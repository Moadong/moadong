const getDeadlineText = (
  recruitmentStart: Date | null,
  recruitmentEnd: Date | null,
  today: Date = new Date(),
): string => {
  if (
    recruitmentStart &&
    recruitmentEnd &&
    today >= recruitmentStart &&
    today <= recruitmentEnd
  ) {
    const diffTime = recruitmentEnd.getTime() - today.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? `D-${days}` : 'D-Day';
  }
  return '모집 마감';
};

export default getDeadlineText;
