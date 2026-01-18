import { Question } from '@/types/application';

export const validateAnswers = (
  questions: Question[],
  getAnswersById: (id: number) => string[],
): number[] => {
  return questions
    .filter((q) => q.options.required)
    .filter((q) => {
      const answers = getAnswersById(q.id);
      return answers.length === 0 || answers.every((s) => s.trim() === '');
    })
    .map((q) => q.id);
};
