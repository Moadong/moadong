import { parseFeedbackEligibility } from './feedbackPromptValidation';

const event = { triggerType: 'USER_CLUB_DETAIL_EXIT' as const };
const prompt = () => ({
  id: 'p1', title: '도움이 되었나요?', description: '', active: true,
  triggerType: event.triggerType, audience: 'USER',
  ratingOptions: [{ rating: 'POSITIVE', label: '네', displayOrder: 1, requiresFollowUp: false }],
  followUp: null,
});

describe('feedback eligibility contract', () => {
  it('accepts a single rating and no follow-up', () => {
    expect(parseFeedbackEligibility({ eligible: true, prompt: prompt() }, event.triggerType)?.id).toBe('p1');
  });
  it('does not display ineligible or mismatched prompts', () => {
    expect(parseFeedbackEligibility({ eligible: false }, event.triggerType)).toBeNull();
    expect(parseFeedbackEligibility({ eligible: true, prompt: { ...prompt(), audience: 'ADMIN' } }, event.triggerType)).toBeNull();
  });
  it('rejects duplicate ratings and a missing required follow-up', () => {
    const p = prompt();
    expect(parseFeedbackEligibility({ eligible: true, prompt: { ...p, ratingOptions: [...p.ratingOptions, ...p.ratingOptions] } }, event.triggerType)).toBeNull();
    p.ratingOptions[0].requiresFollowUp = true;
    expect(parseFeedbackEligibility({ eligible: true, prompt: p }, event.triggerType)).toBeNull();
  });
  it('allows zero comment length and no reasons, rejects invalid limits', () => {
    const p = { ...prompt(), followUp: { reasonOptions: [], commentMaxLength: 0 } };
    expect(parseFeedbackEligibility({ eligible: true, prompt: p }, event.triggerType)).not.toBeNull();
    p.followUp.commentMaxLength = 501;
    expect(parseFeedbackEligibility({ eligible: true, prompt: p }, event.triggerType)).toBeNull();
  });
});
