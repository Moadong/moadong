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
export default APPLICATION_FORM;
