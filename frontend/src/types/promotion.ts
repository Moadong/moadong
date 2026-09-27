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

export interface PromotionImageUploadRequest {
  fileName: string;
  contentType: string;
}

/**
 * presigned URL 발급 결과. 요청 배열과 순서가 1:1로 대응한다.
 * 확장자·contentType이 허용 목록 밖이면 그 항목만 success=false, presignedUrl=null로 온다.
 */
export interface PromotionPresignedData {
  presignedUrl: string | null;
  finalUrl: string;
  /** 서명에 포함된 헤더. 스토리지 PUT에 그대로 실어야 한다 */
  requiredHeaders: Record<string, string>;
  success: boolean;
  failureReason: string | null;
}
