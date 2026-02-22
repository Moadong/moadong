import { ApplicationFormData, ApplicationFormMode } from '@/types/application';

const ALLOWED_EXTERNAL_URLS = [
  'https://forms.gle/',
  'https://docs.google.com/forms/',
  'https://form.naver.com/',
  'https://naver.me/',
  'https://everytime.kr/',
];

export interface ApplicationFormErrors {
  title?: string;
  description?: string;
  questions?: Record<number, string>;
  externalUrl?: string;
}

export const validateApplicationForm = (
  formData: ApplicationFormData,
  mode: ApplicationFormMode,
  externalUrl: string,
): ApplicationFormErrors => {
  const errors: ApplicationFormErrors = {};

  if (!formData.title?.trim()) {
    errors.title = '지원서 제목을 입력해주세요.';
  } else if (formData.title.length > 50) {
    errors.title = '지원서 제목은 최대 50자까지 입력할 수 있습니다.';
  }

  if (!formData.description?.trim()) {
    errors.description = '지원서 설명을 입력해주세요.';
  } else if (formData.description.length > 3000) {
    errors.description = '지원서 설명은 최대 3000자까지 입력할 수 있습니다.';
  }

  if (mode === ApplicationFormMode.INTERNAL) {
    const questionErrors: Record<number, string> = {};

    formData.questions?.forEach((q) => {
      if (!q.title.trim()) {
        questionErrors[q.id] = '질문 제목을 입력해주세요.';
      } else if (
        (q.type === 'CHOICE' || q.type === 'MULTI_CHOICE') &&
        q.items.some((item) => !item.value.trim())
      ) {
        questionErrors[q.id] = '선택지에 빈 항목이 있습니다.';
      }
    });

    if (Object.keys(questionErrors).length > 0) {
      errors.questions = questionErrors;
    }
  }

  if (mode === ApplicationFormMode.EXTERNAL) {
    if (!externalUrl.trim()) {
      errors.externalUrl = '외부 지원서 링크를 입력해주세요.';
    } else if (
      !ALLOWED_EXTERNAL_URLS.some((url) => externalUrl.startsWith(url))
    ) {
      errors.externalUrl =
        'Google Forms, Naver Form 또는 Everytime 링크여야 합니다.';
    }
  }

  return errors;
};

export const hasErrors = (errors: ApplicationFormErrors): boolean =>
  Object.keys(errors).length > 0;
