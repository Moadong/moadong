import { useState } from 'react';
import { AnswerItem } from '@/types/application';

export const useAnswers = () => {
  const [answers, setAnswers] = useState<AnswerItem[]>([]);

  const updateSingleAnswer = (id: number, value: string) => {
    setAnswers((prev) => [
      ...prev.filter((a) => a.id !== id),
      { id, answer: value },
    ]);
  };

  const updateMultiAnswer = (id: number, values: string[]) => {
    setAnswers((prev) => [
      ...prev.filter((a) => a.id !== id),
      ...values.map((v) => ({ id, answer: v })),
    ]);
  };

  const onAnswerChange = (id: number, value: string | string[]) => {
    if (Array.isArray(value)) {
      updateMultiAnswer(id, value);
    } else {
      updateSingleAnswer(id, value);
    }
  };

  const getAnswersById = (id: number) =>
    answers.filter((a) => a.id === id).map((a) => a.answer);

  return { onAnswerChange, getAnswersById };
};
