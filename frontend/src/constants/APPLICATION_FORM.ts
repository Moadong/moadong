export const APPLICATION_FORM = {
  QUESTION_TITLE: {
    placeholder: '질문 제목을 입력해주세요(최대 20자)',
    maxLength: 20,
  },
  QUESTION_DESCRIPTION: {
    placeholder: '질문 설명을 입력해주세요(최대 300자)',
    maxLength: 300,
  },
  SHORT_TEXT: {
    placeholder: '답변입력란(최대 20자)',
    maxLength: 20,
  },
  LONG_TEXT: {
    placeholder: '답변입력란(최대 500자)',
    maxLength: 500,
  },
  CHOICE: {
    placeholder: '항목(최대 20자)',
    maxLength: 20,
  },
} as const;

export const QUESTION_LABEL_MAP = {
  SHORT_TEXT: '단답형',
  LONG_TEXT: '장문형',
  CHOICE: '객관식',
  MULTI_CHOICE: '객관식',
  EMAIL: '이메일',
  PHONE_NUMBER: '전화번호',
  NAME: '이름',
} as const;

const DROPDOWN_QUESTION_TYPES = ['LONG_TEXT', 'SHORT_TEXT', 'CHOICE'] as const;

export const DROPDOWN_OPTIONS = DROPDOWN_QUESTION_TYPES.map((type) => ({
  value: type,
  label: QUESTION_LABEL_MAP[type],
}));
