import API_BASE_URL from '@/constants/api';
import {
  FeedbackDismissRequest,
  FeedbackEligibility,
  FeedbackResponseRequest,
  FeedbackResponseResult,
  FeedbackTriggerType,
} from '@/types/feedbackPrompt';
import { fetchWithTimeout } from './utils/fetchWithTimeout';
import { handleResponse } from './utils/apiHelpers';

const BASE_URL = `${API_BASE_URL}/api/feedback-prompts`;
export interface FeedbackRequestIdentity {
  anonymousClientId?: string;
  accessToken?: string;
}

const request = (identity: FeedbackRequestIdentity, url: string, options: RequestInit, timeout: number) =>
  fetchWithTimeout(
    url,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(identity.accessToken ? { Authorization: `Bearer ${identity.accessToken}` } : {}),
        ...(options.headers ?? {}),
      },
      credentials: identity.accessToken ? 'include' : 'same-origin',
    },
    timeout,
  );

export const getFeedbackEligibility = async (
  triggerType: FeedbackTriggerType,
  clubId: string | undefined,
  identity: FeedbackRequestIdentity,
) => {
  const query = new URLSearchParams({ triggerType });
  if (clubId) query.set('clubId', clubId);
  if (identity.anonymousClientId) query.set('anonymousClientId', identity.anonymousClientId);
  const response = await request(identity, `${BASE_URL}/eligibility?${query}`, {}, 5_000);
  return handleResponse<FeedbackEligibility>(response);
};

export const submitFeedbackResponse = async (
  promptId: string,
  payload: FeedbackResponseRequest,
  identity: FeedbackRequestIdentity,
) => {
  const response = await request(identity, `${BASE_URL}/${encodeURIComponent(promptId)}/responses`, {
    method: 'POST', body: JSON.stringify(payload),
  }, 10_000);
  return handleResponse<FeedbackResponseResult>(response);
};

export const dismissFeedbackPrompt = async (
  promptId: string,
  payload: FeedbackDismissRequest,
  identity: FeedbackRequestIdentity,
) => {
  const response = await request(identity, `${BASE_URL}/${encodeURIComponent(promptId)}/dismiss`, {
    method: 'POST', body: JSON.stringify(payload),
  }, 3_000);
  await handleResponse(response);
};
