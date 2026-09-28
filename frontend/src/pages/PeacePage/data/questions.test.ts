import {
  isPeaceTypeId,
  PEACE_TYPE_IDS,
  PEACE_TYPES,
  PeaceTypeId,
  TIE_BREAK_ORDER,
} from './peaceTypes';
import { PEACE_QUESTIONS } from './questions';

describe('평화 유형 데이터', () => {
  it('유형은 6개이고 ID와 레코드 키가 일치한다', () => {
    expect(PEACE_TYPE_IDS).toHaveLength(6);
    expect(Object.keys(PEACE_TYPES).sort()).toEqual([...PEACE_TYPE_IDS].sort());
    PEACE_TYPE_IDS.forEach((id) => expect(PEACE_TYPES[id].id).toBe(id));
  });

  it('동점 우선순위는 6개 유형을 정확히 한 번씩 담는다', () => {
    expect([...TIE_BREAK_ORDER].sort()).toEqual([...PEACE_TYPE_IDS].sort());
  });

  it('분과 색 인덱스는 1~6에서 서로 겹치지 않는다', () => {
    const indexes = PEACE_TYPE_IDS.map((id) => PEACE_TYPES[id].colorIndex);
    expect([...indexes].sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('모든 유형에 결과 상세 콘텐츠가 채워져 있다', () => {
    PEACE_TYPE_IDS.forEach((id) => {
      const t = PEACE_TYPES[id];
      expect(t.strengths).toHaveLength(3);
      expect(t.smallActions).toHaveLength(3);
      [
        t.description,
        t.shinesWhen,
        t.caution,
        t.partnerReason,
        t.divisionIntro,
      ].forEach((text) => expect(text.length).toBeGreaterThan(10));
    });
  });

  it('모든 유형에 카드 심볼이 있다', () => {
    PEACE_TYPE_IDS.forEach((id) =>
      expect(PEACE_TYPES[id].symbol.length).toBeGreaterThan(0),
    );
  });

  it('파트너 유형은 서로를 가리키고 자기 자신이 아니다', () => {
    PEACE_TYPE_IDS.forEach((id) => {
      const partner = PEACE_TYPES[id].partner;
      expect(partner).not.toBe(id);
      expect(PEACE_TYPES[partner].partner).toBe(id);
    });
  });

  it('isPeaceTypeId는 정의된 ID만 통과시킨다', () => {
    expect(isPeaceTypeId('carer')).toBe(true);
    expect(isPeaceTypeId('abc')).toBe(false);
    expect(isPeaceTypeId(null)).toBe(false);
  });
});

describe('평화 질문 데이터', () => {
  it('8문항이고 각 문항은 4지선다다', () => {
    expect(PEACE_QUESTIONS).toHaveLength(8);
    PEACE_QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
      expect(q.options).toHaveLength(4);
    });
  });

  it('유형별 선택지 등장 횟수는 기획과 같다', () => {
    const counts = {} as Record<PeaceTypeId, number>;
    PEACE_QUESTIONS.flatMap((q) => q.options).forEach((o) => {
      counts[o.type] = (counts[o.type] ?? 0) + 1;
    });
    expect(counts).toEqual({
      carer: 6,
      embracer: 5,
      daily: 5,
      explorer: 6,
      energizer: 5,
      expresser: 5,
    });
  });
});
