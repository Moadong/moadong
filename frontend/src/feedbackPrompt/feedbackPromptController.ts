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
const listeners = new Set<() => void>();
const consumedEvents = new Set<string>();
const notify = () => listeners.forEach((listener) => listener());

export const subscribeFeedbackPrompt = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getFeedbackPromptSession = () => activeSession;
export const clearFeedbackPromptSession = () => {
  activeSession = null;
  notify();
};

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
  if (activeSession || consumedEvents.has(eventId) || document.visibilityState === 'hidden') return;
  consumedEvents.add(eventId);
  if (consumedEvents.size > 100) consumedEvents.delete(consumedEvents.values().next().value as string);
  const identity = isAdmin
    ? accessToken ? { accessToken } : null
    : (() => {
      const anonymousClientId = getFeedbackAnonymousClientId();
      return anonymousClientId ? { anonymousClientId } : null;
    })();
  if (!identity) return;
  try {
    const eligibility = await getFeedbackEligibility(triggerType, clubId, identity);
    const prompt = parseFeedbackEligibility(eligibility, triggerType);
    if (!prompt || activeSession) return;
    activeSession = { prompt, triggerType, clubId, sourcePath, identity };
    notify();
  } catch {
    // 선택적 설문은 원래 작업을 방해하지 않는다.
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
