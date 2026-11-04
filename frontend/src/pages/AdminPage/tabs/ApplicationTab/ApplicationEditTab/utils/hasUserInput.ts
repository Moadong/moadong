import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import { ApplicationFormData } from '@/types/application';

/**
 * AI 초안으로 덮어쓰기 전에 확인을 받을 만큼 사용자가 쓴 내용이 있는지.
 * 이름 질문은 기본 제목이 채워져 있어서 빼고 본다. 순서를 바꿀 수 있어 위치가 아니라 id로 뺀다.
 */
export const hasUserInput = (formData: ApplicationFormData) =>
  formData.title.trim() !== '' ||
  formData.description.trim() !== '' ||
  (formData.questions ?? []).some(
    (q) =>
      q.id !== NAME_QUESTION_ID &&
      (q.title.trim() !== '' || q.description.trim() !== ''),
  );
