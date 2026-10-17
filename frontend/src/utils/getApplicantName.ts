import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import { AnswerItem } from '@/types/application';

/** 지원자 답변 중 이름 질문의 답. 이름 질문은 어디로든 옮길 수 있어서 첫 번째 답이 이름이라는 보장이 없다 */
export const getApplicantName = (answers: AnswerItem[]) =>
  answers.find((answer) => answer.id === NAME_QUESTION_ID)?.value;
