import { PeaceTypeId } from '../data/peaceTypes';
import { PEACE_QUESTIONS } from '../data/questions';
import {
  calculatePeaceType,
  rankPeaceTypes,
  scorePeaceTypes,
} from './calculatePeaceType';

/** 문항별로 원하는 유형의 선택지 인덱스를 고른다. 없으면 테스트 데이터가 잘못된 것이므로 throw */
const choose = (plan: PeaceTypeId[]): number[] =>
  PEACE_QUESTIONS.map((q, i) => {
    const idx = q.options.findIndex((o) => o.type === plan[i]);
    if (idx < 0) throw new Error(`Q${q.id}에 ${plan[i]} 선택지가 없다`);
    return idx;
  });

describe('calculatePeaceType', () => {
  it('가장 많이 고른 유형을 반환한다', () => {
    // carer 6 (Q1 Q3 Q4 Q5 Q6 Q8) + daily 2 (Q2 Q7)
    const answers = choose([
      'carer',
      'daily',
      'carer',
      'carer',
      'carer',
      'carer',
      'daily',
      'carer',
    ]);
    expect(calculatePeaceType(answers)).toBe('carer');
  });

  it('우선순위 마지막 유형(탐구)도 단독 최고점이면 그대로 반환한다', () => {
    // explorer 6 (Q1 Q2 Q4 Q5 Q6 Q8) + daily 2 (Q3 Q7)
    const answers = choose([
      'explorer',
      'explorer',
      'daily',
      'explorer',
      'explorer',
      'explorer',
      'daily',
      'explorer',
    ]);
    expect(calculatePeaceType(answers)).toBe('explorer');
  });

  it('동점이면 TIE_BREAK_ORDER에서 앞선 유형을 고른다', () => {
    // energizer 4 (Q1 Q2 Q3 Q7) : carer 4 (Q4 Q5 Q6 Q8)
    // TIE_BREAK_ORDER: daily → embracer → energizer → expresser → carer → explorer
    const answers = choose([
      'energizer',
      'energizer',
      'energizer',
      'carer',
      'carer',
      'carer',
      'energizer',
      'carer',
    ]);
    expect(calculatePeaceType(answers)).toBe('energizer');
  });

  it('rankPeaceTypes는 점수 내림차순, 동점은 TIE_BREAK_ORDER 순으로 6개를 돌려준다', () => {
    // carer 6, daily 2, 나머지 0
    const answers = choose([
      'carer',
      'daily',
      'carer',
      'carer',
      'carer',
      'carer',
      'daily',
      'carer',
    ]);
    const ranked = rankPeaceTypes(answers);
    expect(ranked).toHaveLength(6);
    expect(ranked.slice(0, 2)).toEqual(['carer', 'daily']);
    // 0점 동점 4개는 우선순위 순: embracer → energizer → expresser → explorer
    expect(ranked.slice(2)).toEqual([
      'embracer',
      'energizer',
      'expresser',
      'explorer',
    ]);
  });

  it('scorePeaceTypes는 유형별 점수를 돌려주고 합은 문항 수다', () => {
    const answers = choose([
      'carer',
      'daily',
      'carer',
      'carer',
      'carer',
      'carer',
      'daily',
      'carer',
    ]);
    const scores = scorePeaceTypes(answers);
    expect(scores.carer).toBe(6);
    expect(scores.daily).toBe(2);
    expect(Object.values(scores).reduce((a, b) => a + b, 0)).toBe(
      PEACE_QUESTIONS.length,
    );
  });

  it('답 개수가 문항 수와 다르면 throw한다', () => {
    expect(() => calculatePeaceType([0, 1, 2])).toThrow();
    expect(() => calculatePeaceType([])).toThrow();
  });
});
