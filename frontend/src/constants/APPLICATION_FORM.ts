const APPLICATION_FORM = {
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
