import { STORAGE_KEYS } from '@/constants/storageKeys';
import { getFeedbackAnonymousClientId } from './feedbackPromptIdentity';

describe('getFeedbackAnonymousClientId', () => {
  beforeEach(() => localStorage.clear());

  it('creates and persists one UUID for all feedback requests', () => {
    const first = getFeedbackAnonymousClientId();
    expect(first).toMatch(/^[0-9a-f-]{36}$/i);
    expect(localStorage.getItem(STORAGE_KEYS.FEEDBACK_PROMPT_ANONYMOUS_ID)).toBe(first);
    expect(getFeedbackAnonymousClientId()).toBe(first);
  });

  it('replaces malformed stored values', () => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_PROMPT_ANONYMOUS_ID, 'not-a-uuid');
    expect(getFeedbackAnonymousClientId()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
