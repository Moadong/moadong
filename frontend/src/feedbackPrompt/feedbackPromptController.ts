import {
  dismissFeedbackPrompt,
  getFeedbackEligibility,
  FeedbackRequestIdentity,
} from '@/apis/feedbackPrompt';
import {
  isAdminFeedbackPromptEnabled,
  isUserFeedbackPromptEnabled,
} from '@/constants/feedbackPrompt';
import { getFeedbackAnonymousClientId } from '@/utils/feedbackPromptIdentity';
import { parseFeedbackEligibility } from '@/utils/feedbackPromptValidation';
import { FeedbackPrompt, FeedbackTriggerType } from '@/types/feedbackPrompt';

export interface FeedbackPromptSession {
  prompt: FeedbackPrompt;
  triggerType: FeedbackTriggerType;
  clubId?: string;
  sourcePath: string;
  identity: FeedbackRequestIdentity;
}

let activeSession: FeedbackPromptSession | null = null;
let isCheckingEligibility = false;
let isSubmittingFeedback = false;
const listeners = new Set<() => void>();
const consumedEvents = new Set<string>();
const notify = () => listeners.forEach((listener) => listener());
const isDocumentVisible = () => document.visibilityState === 'visible';

export const subscribeFeedbackPrompt = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getFeedbackPromptSession = () => activeSession;
export const clearFeedbackPromptSession = () => {
  activeSession = null;
  notify();
};
export const beginFeedbackSubmit = () => {
  isSubmittingFeedback = true;
};
export const endFeedbackSubmit = () => {
  isSubmittingFeedback = false;
};
export const isFeedbackSubmitInProgress = () => isSubmittingFeedback;

interface RequestFeedbackOptions {
  eventId: string;
  triggerType: FeedbackTriggerType;
  clubId?: string;
  sourcePath: string;
  accessToken?: string;
}

export const requestFeedbackPrompt = async ({
  eventId,
  triggerType,
  clubId,
  sourcePath,
  accessToken,
}: RequestFeedbackOptions) => {
  const isAdmin = triggerType.startsWith('ADMIN_');
  if ((isAdmin && !isAdminFeedbackPromptEnabled) || (!isAdmin && !isUserFeedbackPromptEnabled)) return;
  if (
    activeSession ||
    isCheckingEligibility ||
    isSubmittingFeedback ||
    consumedEvents.has(eventId) ||
    !isDocumentVisible() ||
    document.querySelector('[data-overlay-kind="blocking"], [data-overlay-kind="survey"]')
  ) return;
  consumedEvents.add(eventId);
  if (consumedEvents.size > 100) consumedEvents.delete(consumedEvents.values().next().value as string);
  const identity = isAdmin
    ? accessToken ? { accessToken } : null
    : (() => {
      const anonymousClientId = getFeedbackAnonymousClientId();
      return anonymousClientId ? { anonymousClientId } : null;
    })();
  if (!identity) return;
  isCheckingEligibility = true;
  try {
    const eligibility = await getFeedbackEligibility(triggerType, clubId, identity);
    const prompt = parseFeedbackEligibility(eligibility, triggerType);
    if (
      !prompt ||
      activeSession ||
      !isDocumentVisible() ||
      document.querySelector('[data-overlay-kind="blocking"], [data-overlay-kind="survey"]')
    ) return;
    activeSession = { prompt, triggerType, clubId, sourcePath, identity };
    notify();
  } catch {
    // 선택적 설문은 원래 작업을 방해하지 않는다.
  } finally {
    isCheckingEligibility = false;
  }
};

export const dismissActiveFeedbackPrompt = () => {
  const session = activeSession;
  clearFeedbackPromptSession();
  if (!session) return;
  void dismissFeedbackPrompt(session.prompt.id, {
    triggerType: session.triggerType,
    clubId: session.clubId,
    anonymousClientId: session.identity.anonymousClientId,
  }, session.identity).catch(() => undefined);
};
