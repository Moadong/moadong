jest.mock('@/constants/feedbackPrompt', () => ({
  isAdminFeedbackPromptEnabled: true,
  isUserFeedbackPromptEnabled: true,
}));
jest.mock('@/apis/feedbackPrompt', () => ({
  getFeedbackEligibility: jest.fn(),
  dismissFeedbackPrompt: jest.fn(),
}));

import { getFeedbackEligibility } from '@/apis/feedbackPrompt';
import {
  beginFeedbackSubmit,
  clearFeedbackPromptSession,
  endFeedbackSubmit,
  getFeedbackPromptSession,
  requestFeedbackPrompt,
} from './feedbackPromptController';

const getEligibility = getFeedbackEligibility as jest.MockedFunction<
  typeof getFeedbackEligibility
>;

const prompt = {
  id: 'prompt-1', title: '도움이 되었나요?', active: true,
  triggerType: 'ADMIN_CLUB_INFO_UPDATED', audience: 'ADMIN',
  ratingOptions: [{ rating: 'POSITIVE', label: '네', displayOrder: 1, requiresFollowUp: false }],
  followUp: null,
};

describe('feedback prompt controller', () => {
  beforeEach(() => {
    clearFeedbackPromptSession();
    endFeedbackSubmit();
    document.body.innerHTML = '';
    getEligibility.mockReset();
  });

  it('reserves one eligibility slot while a request is pending', async () => {
    let resolve!: (value: unknown) => void;
    getEligibility.mockReturnValueOnce(new Promise((done) => { resolve = done; }) as never);
    const first = requestFeedbackPrompt({ eventId: 'one', triggerType: 'ADMIN_CLUB_INFO_UPDATED', clubId: 'club', sourcePath: '/admin', accessToken: 'token' });
    const second = requestFeedbackPrompt({ eventId: 'two', triggerType: 'ADMIN_CLUB_INFO_UPDATED', clubId: 'club', sourcePath: '/admin', accessToken: 'token' });
    expect(getEligibility).toHaveBeenCalledTimes(1);
    resolve({ eligible: true, prompt });
    await Promise.all([first, second]);
    expect(getFeedbackPromptSession()?.prompt.id).toBe('prompt-1');
  });

  it('does not request another prompt while a response is being submitted', async () => {
    beginFeedbackSubmit();
    await requestFeedbackPrompt({ eventId: 'submitting', triggerType: 'ADMIN_CLUB_INFO_UPDATED', clubId: 'club', sourcePath: '/admin', accessToken: 'token' });
    expect(getEligibility).not.toHaveBeenCalled();
  });
});
