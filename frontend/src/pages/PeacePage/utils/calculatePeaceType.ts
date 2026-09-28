import {
  PEACE_TYPE_IDS,
  PeaceTypeId,
  TIE_BREAK_ORDER,
} from '../data/peaceTypes';
import { PEACE_QUESTIONS } from '../data/questions';

/**
 * answers[i] = i번째 문항에서 고른 option 인덱스.
 * 각 답의 유형에 +1, 점수 내림차순으로 6개 유형을 돌려준다. 동점은 TIE_BREAK_ORDER 앞순위.
 * 8답이 모두 있을 때만 호출하는 것이 계약이다.
 */
export const rankPeaceTypes = (answers: number[]): PeaceTypeId[] => {
  if (answers.length !== PEACE_QUESTIONS.length) {
    throw new Error(
      `answers must have ${PEACE_QUESTIONS.length} items, got ${answers.length}`,
    );
  }

  const scores = Object.fromEntries(
    PEACE_TYPE_IDS.map((id) => [id, 0]),
  ) as Record<PeaceTypeId, number>;

  answers.forEach((optionIndex, i) => {
    const option = PEACE_QUESTIONS[i].options[optionIndex];
    scores[option.type] += 1;
  });

  // 안정 정렬이라 같은 점수끼리는 TIE_BREAK_ORDER 순서가 유지된다
  return [...TIE_BREAK_ORDER].sort((a, b) => scores[b] - scores[a]);
};

/** 최고점 유형 하나 */
export const calculatePeaceType = (answers: number[]): PeaceTypeId =>
  rankPeaceTypes(answers)[0];
