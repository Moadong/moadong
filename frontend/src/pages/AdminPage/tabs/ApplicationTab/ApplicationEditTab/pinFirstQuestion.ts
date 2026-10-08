import { Question } from '@/types/application';

// 이름 질문(첫 질문)은 드래그 목록 밖에 고정돼 있다. 나머지 질문의 새 순서 앞에 다시 붙인다.
export const pinFirstQuestion = (
  questions: Question[],
  reorderedRest: Question[],
) => [...questions.slice(0, 1), ...reorderedRest];
