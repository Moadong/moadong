import { useSyncExternalStore } from 'react';
import {
  getFeedbackPromptSession,
  subscribeFeedbackPrompt,
} from '@/feedbackPrompt/feedbackPromptController';

export const useFeedbackPrompt = () =>
  useSyncExternalStore(
    subscribeFeedbackPrompt,
    getFeedbackPromptSession,
    getFeedbackPromptSession,
  );
