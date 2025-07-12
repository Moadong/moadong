import { ApplicationFormData } from '@/types/application';

const INITIAL_FORM_DATA: ApplicationFormData = {
  title: '',
  questions: [
    //맨 처음은 이름
    {
      id: 1,
      title: '이름',
      description: '지원자의 이름을 입력해주세요.',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: 2,
      title: '',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: 3,
      title: '',
      description: '',
      type: 'CHOICE',
      options: { required: true },
      items: [{ value: '' }, { value: '' }],
    },
  ],
};

export default INITIAL_FORM_DATA;
