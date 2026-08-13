/** 사용자가 보내는 피드백의 유형 */
export type FeedbackType = 'BUG' | 'FEATURE' | 'QUESTION' | 'CHEER';

/** 받은 편지의 분류 */
export type LetterCategory = 'REPLY' | 'UPDATE' | 'STORY';

/** 보낸 피드백의 처리 상태 */
export type SentFeedbackStatus = 'PENDING' | 'REPLIED';

export interface CreateFeedbackRequest {
  type: FeedbackType;
  content: string;
  /** upload-url 응답의 finalUrl 배열. 선택 필드라 없으면 생략한다 */
  images?: string[];
}

export interface CreateFeedbackResponse {
  feedbackId: string;
}

export interface ReceivedLetter {
  id: string;
  category: LetterCategory;
  title: string;
  preview: string;
  createdAt: string;
  isRead: boolean;
}

/** 받은 편지 상세. 답장(REPLY)일 때만 내가 보낸 편지가 함께 온다 */
export interface ReceivedLetterDetail {
  id: string;
  category: LetterCategory;
  title: string;
  createdAt: string;
  body: string;
  myFeedback?: {
    id: string;
    type: FeedbackType;
    content: string;
    createdAt: string;
  };
}

export interface SentFeedback {
  id: string;
  type: FeedbackType;
  content: string;
  /** 첨부한 사진의 최종 URL. 첨부가 없으면 빈 배열이다 */
  images: string[];
  status: SentFeedbackStatus;
  createdAt: string;
}
