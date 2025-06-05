import { ApplicationFormData } from '@/types/application';

const INITIAL_FORM_DATA: ApplicationFormData = {
  title: '',
  questions: [
    {
      id: 1,
      title: '',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
    },
    {
      id: 2,
      title: '',
      description: '',
      type: 'CHOICE',
      options: { required: true },
      items: [{ value: '' }, { value: '' }],
    },
  ],
};

export default INITIAL_FORM_DATA;
