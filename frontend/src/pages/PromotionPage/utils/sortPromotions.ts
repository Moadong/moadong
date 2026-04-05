import { PromotionArticle } from '@/types/promotion';

export const sortPromotions = (
  articles: PromotionArticle[],
  now: number = Date.now(),
) => {
  return [...articles].sort((a, b) => {
    const aStart = new Date(a.eventStartDate).getTime();
    const aEnd = new Date(a.eventEndDate).getTime();
    const bStart = new Date(b.eventStartDate).getTime();
    const bEnd = new Date(b.eventEndDate).getTime();

    const getStatusWeight = (start: number, end: number) => {
      if (start <= now && end >= now) return 1; // 진행 중
      if (start > now) return 2; // 예정
      return 3; // 종료
    };

    const aStatusWeight = getStatusWeight(aStart, aEnd);
    const bStatusWeight = getStatusWeight(bStart, bEnd);

    if (aStatusWeight !== bStatusWeight) return aStatusWeight - bStatusWeight;
    if (aStatusWeight === 2) return aStart - bStart;
    if (aStatusWeight === 3) return bStart - aStart;
    return aStart - bStart;
  });
};
