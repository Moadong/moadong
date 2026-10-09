import { Question } from '@/types/application';

// 지원자 답변은 질문 id로 질문을 찾는다. 지운 질문의 id를 새 질문이 다시 받으면
// 옛 답변이 새 질문에 붙으므로, 남은 질문 최댓값이 아니라 시간 기반으로 만든다.
// 시계가 뒤로 가 Date.now()가 기존 id보다 작아도 기존 id와 겹치지 않게 최댓값+1과 비교한다.
export const createQuestionId = (questions: Question[]) =>
  Math.max(Date.now(), ...questions.map((q) => q.id + 1));
