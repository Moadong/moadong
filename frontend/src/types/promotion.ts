export interface PromotionArticle {
  id: string;
  clubName: string;
  clubId: string;
  title: string;
  location: string;
  latitude?: number;
  longitude?: number;
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
