export const FEEDBACK_TRIGGER_TYPES = {
  ADMIN_CLUB_BASIC_INFO_CREATED: 'ADMIN_CLUB_BASIC_INFO_CREATED',
  ADMIN_CLUB_INFO_UPDATED: 'ADMIN_CLUB_INFO_UPDATED',
  ADMIN_RECRUITMENT_INFO_SAVED: 'ADMIN_RECRUITMENT_INFO_SAVED',
  USER_CLUB_DETAIL_EXIT: 'USER_CLUB_DETAIL_EXIT',
  GENERAL_FEEDBACK: 'GENERAL_FEEDBACK',
} as const;

export type FeedbackTriggerType =
  (typeof FEEDBACK_TRIGGER_TYPES)[keyof typeof FEEDBACK_TRIGGER_TYPES];
export type FeedbackAudience = 'ADMIN' | 'USER';
export type FeedbackRating = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface FeedbackRatingOption {
  rating: FeedbackRating;
  label: string;
  displayOrder: number;
  requiresFollowUp: boolean;
}

export interface FeedbackReasonOption {
  id: string;
  label: string;
  displayOrder: number;
  active: boolean;
}

export interface FeedbackFollowUp {
  reasonQuestion?: string;
  reasonOptions: FeedbackReasonOption[];
  commentQuestion?: string;
  commentPlaceholder?: string;
  commentMaxLength: number;
}

export interface FeedbackPrompt {
  id: string;
  triggerType: FeedbackTriggerType;
  audience: FeedbackAudience;
  title: string;
  description?: string;
  ratingOptions: FeedbackRatingOption[];
  followUp: FeedbackFollowUp | null;
  active: boolean;
}

export interface FeedbackEligibility {
  eligible: boolean;
  reason?: string;
  prompt?: FeedbackPrompt;
}

export interface FeedbackClientContext {
  path: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
  appWebView: boolean;
}

export interface FeedbackResponseRequest {
  triggerType: FeedbackTriggerType;
  clubId?: string;
  anonymousClientId?: string;
  rating: FeedbackRating;
  reasonOptionIds: string[];
  comment?: string;
  clientContext?: FeedbackClientContext;
}

export interface FeedbackDismissRequest {
  triggerType: FeedbackTriggerType;
  clubId?: string;
  anonymousClientId?: string;
}

export interface FeedbackResponseResult {
  responseId: string;
  message?: string;
}
