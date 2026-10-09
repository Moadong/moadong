import { Question } from '@/types/application';
import { createQuestionId } from './createQuestionId';

const question = (id: number): Question => ({
  id,
  title: '',
  description: '',
  type: 'SHORT_TEXT',
  options: { required: false },
  items: [],
});

const NOW = 1_800_000_000_000;

describe('createQuestionId', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('지운 질문의 id를 다시 쓰지 않는다', () => {
    // [1, 2, 3]에서 3을 지운 뒤 추가해도 3을 받지 않는다
    const id = createQuestionId([question(1), question(2)]);

    expect(id).not.toBe(3);
    expect(id).toBe(NOW);
  });

  it('시계가 뒤로 가 기존 id가 더 커도 기존 id와 겹치지 않는다', () => {
    const id = createQuestionId([question(1), question(NOW + 10)]);

    expect(id).toBe(NOW + 11);
  });

  it('질문이 없으면 현재 시각을 쓴다', () => {
    expect(createQuestionId([])).toBe(NOW);
  });
});
