import { validateAnswers } from './useValidateAnswers';

describe('validateAnswers', () => {
  it('should return an empty array if all required questions have answers', () => {
    const questions = [
      { id: 1, options: { required: true } },
      { id: 2, options: { required: false } },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['answer1'];
      return [];
    };

    expect(validateAnswers(questions as any, getAnswersById)).toEqual([]);
  });

  it('should return the ids of required questions with no answers', () => {
    const questions = [
      { id: 1, options: { required: true } },
      { id: 2, options: { required: false } },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return [];
      return [];
    };

    expect(validateAnswers(questions as any, getAnswersById)).toEqual([1]);
  });

  it('should return the ids of required questions with empty string answers', () => {
    const questions = [
      { id: 1, options: { required: true } },
      { id: 2, options: { required: false } },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['   '];
      return [];
    };

    expect(validateAnswers(questions as any, getAnswersById)).toEqual([1]);
  });

  it('should handle multiple required questions with missing answers', () => {
    const questions = [
      { id: 1, options: { required: true } },
      { id: 2, options: { required: true } },
      { id: 3, options: { required: false } },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['answer'];
      if (id === 2) return [];
      return [];
    };

    expect(validateAnswers(questions as any, getAnswersById)).toEqual([2]);
  });

  it('should handle multiple required questions with mixed answers', () => {
    const questions = [
      { id: 1, options: { required: true } },
      { id: 2, options: { required: true } },
      { id: 3, options: { required: true } },
    ];
    const getAnswersById = (id: number) => {
      if (id === 1) return ['answer1'];
      if (id === 2) return [];
      if (id === 3) return ['   '];
      return [];
    };

    expect(validateAnswers(questions as any, getAnswersById)).toEqual([2, 3]);
  });
});
