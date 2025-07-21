import { ApplicationFormData } from '@/types/application';

type QuestionType =
  | 'CHOICE'
  | 'MULTI_CHOICE'
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'PHONE_NUMBER'
  | 'EMAIL'
  | 'NAME';

interface QuestionOptions {
  required: boolean;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  type: QuestionType;
  options: QuestionOptions;
  items?: { value: string }[];
}

export const mockData: ApplicationFormData = {
  title: '2025_2_지원서',
  description: '2025_2_지원서 설문지입니다.',
  questions: [
    {
      id: 1,
      title: '개인정보 제 3자 제공 동의',
      description: '동의를 거부하실 수 있으나 설문 참여가 불가능합니다.',
      type: 'CHOICE',
      options: {
        required: true,
      },
      items: [
        { value: '선택 1번입니다' },
        { value: '선택 2번입니다' },
        { value: '선택 3번입니다' },
      ],
    },
    {
      id: 2,
      title: '객관식 다중 선택',
      description: '질문지 밑 설명입니다~~.',
      type: 'MULTI_CHOICE',
      options: {
        required: true,
      },
      items: [
        { value: '선택 1번입니다' },
        { value: '선택 2번입니다' },
        { value: '선택 3번입니다' },
      ],
    },
    {
      id: 3,
      title: '주관식 단답형',
      description: '주관식 단답형 질문입니다.',
      type: 'SHORT_TEXT',
      options: {
        required: true,
      },
      items: [{ value: '' }],
    },
    {
      id: 4,
      title: '주관식 단답형',
      description: '주관식 단답형 질문입니다.',
      type: 'SHORT_TEXT',
      options: {
        required: true,
      },
      items: [{ value: '주관식은 500자 이하여야 합니다.' }],
    },
    {
      id: 5,
      title: '주관식 서술형',
      description: '자유롭게 서술해주세요.',
      type: 'LONG_TEXT',
      options: {
        required: false,
      },
      items: [
        {
          value:
            '주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.주관식 서술형은 500자 이하여야 합니다.',
        },
      ],
    },
    {
      id: 6,
      title: '이메일 주소',
      description: '이메일을 입력해주세요.',
      type: 'EMAIL',
      options: {
        required: true,
      },
      items: [{ value: '' }],
    },
    {
      id: 105,
      title: '전화번호 입력',
      description: '휴대전화 번호를 입력해주세요.',
      type: 'PHONE_NUMBER',
      options: {
        required: false,
      },
      items: [{ value: '' }],
    },
    {
      id: 106,
      title: '이름 입력',
      description: '이름을 입력해주세요.',
      type: 'NAME',
      options: {
        required: true,
      },
      items: [{ value: '' }],
    },
  ],
};
