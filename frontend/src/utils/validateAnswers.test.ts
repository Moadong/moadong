import { validateAnswers } from './validateAnswers';
import { Question } from '@/types/application';

describe('validateAnswers', () => {
  it('should return empty array when all required questions are answered', () => {
    const questions: Question[] = [
      {
        id: 1,
        title: 'Q1',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
      {
        id: 2,
        title: 'Q2',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['Answer 1'];
      if (id === 2) return ['Answer 2'];
      return [];
    };

    const result = validateAnswers(questions, getAnswersById);
    expect(result).toEqual([]);
  });

  it('should return IDs of unanswered required questions', () => {
    const questions: Question[] = [
      {
        id: 1,
        title: 'Q1',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
      {
        id: 2,
        title: 'Q2',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['Answer 1'];
      if (id === 2) return [];
      return [];
    };

    const result = validateAnswers(questions, getAnswersById);
    expect(result).toEqual([2]);
  });

  it('should ignore non-required questions', () => {
    const questions: Question[] = [
      {
        id: 1,
        title: 'Q1',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
      {
        id: 2,
        title: 'Q2',
        description: '',
        type: 'TEXT',
        options: { required: false },
        items: [],
      },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['Answer 1'];
      if (id === 2) return [];
      return [];
    };

    const result = validateAnswers(questions, getAnswersById);
    expect(result).toEqual([]);
  });

  it('should treat empty or whitespace-only answers as unanswered', () => {
    const questions: Question[] = [
      {
        id: 1,
        title: 'Q1',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
      {
        id: 2,
        title: 'Q2',
        description: '',
        type: 'TEXT',
        options: { required: true },
        items: [],
      },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['   '];
      if (id === 2) return ['Answer 2'];
      return [];
    };

    const result = validateAnswers(questions, getAnswersById);
    expect(result).toEqual([1]);
  });
});
