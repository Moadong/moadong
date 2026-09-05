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

/**
 * 생성·수정 공통 바디. 전부 필수.
 * clubId는 필수값이지만 동아리 관리자 요청에서는 서버가 토큰의 동아리로 덮어쓴다.
 * 생성은 images가 빈 배열이어도 되고, 수정은 1개 이상이어야 한다.
 */
export interface CreatePromotionArticleRequest {
  clubId: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  images: string[];
}

export type UpdatePromotionArticleRequest = CreatePromotionArticleRequest;

export interface CreatePromotionArticleResponse {
  articleId: string;
}

export interface PromotionImageUploadResponse {
  imageUrl: string;
}
