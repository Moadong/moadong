import {
  FeedbackEligibility,
  FeedbackPrompt,
  FeedbackRating,
  FeedbackResponseResult,
  FeedbackTriggerType,
} from '@/types/feedbackPrompt';

const RATINGS: FeedbackRating[] = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';
const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/** 서버 문항을 화면에 넣기 전에 최소 계약을 검증한다. */
export const parseFeedbackEligibility = (
  value: unknown,
  triggerType: FeedbackTriggerType,
): FeedbackPrompt | null => {
  if (!isRecord(value) || value.eligible !== true || !isRecord(value.prompt)) {
    return null;
  }
  const prompt = value.prompt;
  const expectedAudience = triggerType.startsWith('ADMIN_') ? 'ADMIN' : 'USER';
  if (
    !isText(prompt.id) ||
    !isText(prompt.title) ||
    prompt.triggerType !== triggerType ||
    prompt.audience !== expectedAudience ||
    prompt.active !== true ||
    !Array.isArray(prompt.ratingOptions) ||
    prompt.ratingOptions.length < 1 ||
    prompt.ratingOptions.length > 3
  ) {
    return null;
  }
  const ratings = new Set<string>();
  for (const option of prompt.ratingOptions) {
    if (
      !isRecord(option) ||
      !RATINGS.includes(option.rating as FeedbackRating) ||
      !isText(option.label) ||
      typeof option.displayOrder !== 'number' ||
      typeof option.requiresFollowUp !== 'boolean' ||
      ratings.has(option.rating as string)
    ) return null;
    ratings.add(option.rating as string);
  }
  if (prompt.followUp === null) {
    return prompt.ratingOptions.some((option) =>
      isRecord(option) && option.requiresFollowUp === true,
    ) ? null : (prompt as unknown as FeedbackPrompt);
  }
  if (!isRecord(prompt.followUp) || !Array.isArray(prompt.followUp.reasonOptions)) return null;
  const { commentMaxLength, reasonOptions } = prompt.followUp;
  if (!Number.isInteger(commentMaxLength) || (commentMaxLength as number) < 0 || (commentMaxLength as number) > 500) return null;
  const reasons = new Set<string>();
  for (const reason of reasonOptions) {
    if (!isRecord(reason) || !isText(reason.id) || !isText(reason.label) || typeof reason.active !== 'boolean' || typeof reason.displayOrder !== 'number' || reasons.has(reason.id as string)) return null;
    reasons.add(reason.id as string);
  }
  if (reasonOptions.filter((reason) => isRecord(reason) && reason.active === true).length > 8) return null;
  return prompt as unknown as FeedbackPrompt;
};

export const parseFeedbackResponse = (value: unknown): FeedbackResponseResult | null => {
  if (!isRecord(value) || !isText(value.responseId)) return null;
  return { responseId: value.responseId, message: typeof value.message === 'string' ? value.message : undefined };
};

export const asFeedbackEligibility = (value: unknown): FeedbackEligibility | null =>
  isRecord(value) && typeof value.eligible === 'boolean'
    ? (value as unknown as FeedbackEligibility)
    : null;
