export interface PromotionArticle {
  clubName: string;
  clubId: string;
  title: string;
  location: string;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  images: string[];
  isFestival?: boolean; // 동소한 페이지용
}

export interface CreatePromotionArticleRequest {
  clubId: string;
  title: string;
  location: string;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  images: string[];
}
