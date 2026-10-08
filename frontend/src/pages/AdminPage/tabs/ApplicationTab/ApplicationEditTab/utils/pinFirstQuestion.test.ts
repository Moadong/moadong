import { Question } from '@/types/application';
import { pinFirstQuestion } from './pinFirstQuestion';

const question = (id: number): Question => ({
  id,
  title: '',
  description: '',
  type: 'SHORT_TEXT',
  options: { required: false },
  items: [],
});

describe('pinFirstQuestion', () => {
  it('나머지 질문 순서를 바꿔도 이름 질문은 맨 앞에 남는다', () => {
    const questions = [question(1), question(2), question(5), question(9)];
    const reordered = [question(9), question(2), question(5)];

    expect(pinFirstQuestion(questions, reordered).map((q) => q.id)).toEqual([
      1, 9, 2, 5,
    ]);
  });

  it('질문이 없으면 새 순서만 돌려준다', () => {
    const reordered = [question(2), question(1)];

    expect(pinFirstQuestion([], reordered)).toEqual(reordered);
  });
});
