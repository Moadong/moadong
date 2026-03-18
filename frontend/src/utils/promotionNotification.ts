import { PromotionArticle } from "@/types/promotion";

export const getLatestPromotionTime = (
    articles: PromotionArticle[]
): number => {
  if (!articles || articles.length === 0) return 0;

  return Math.max(
    ...articles.map((article) => 
        new Date(article.eventStartDate).getTime())
  );
};

export const getLastCheckedTime = (): number => {
  return Number(localStorage.getItem('promotion_last_checked_time') || 0);
};

export const setLastCheckedTime = (time: number): void => {
  localStorage.setItem('promotion_last_checked_time', String(time));
};