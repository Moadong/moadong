export interface PromotionArticle {
  clubName: string;
  clubId: string;
  title: string;
  location: string;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  images: string[];
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
