import { QUESTION_LABEL_MAP } from '@/constants/APPLICATION_FORM';

export type QuestionType = keyof typeof QUESTION_LABEL_MAP;

export interface Question {
  id: number;
  title: string;
  description: string;
  type: QuestionType;
  options: {
    required: boolean;
  };
  items: { value: string }[];
}

export interface QuestionBuilderProps extends Question {
  readOnly: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onItemsChange?: (newItems: { value: string }[]) => void;
  onTypeChange?: (type: QuestionType) => void;
  onRequiredChange?: (required: boolean) => void;
  onRemoveQuestion: () => void;
}

interface QuestionComponentProps {
  id: number;
  title: string;
  description: string;
  required: boolean;
  mode: 'builder' | 'answer';
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
}

export interface TextProps extends QuestionComponentProps {
  answer?: string;
  onAnswerChange?: (value: string) => void;
}

export interface ChoiceProps extends QuestionComponentProps {
  items?: { value: string }[];
  isMulti?: boolean;
  onItemsChange?: (newItems: { value: string }[]) => void;
  answer?: string | string[];
  onAnswerChange?: (value: string[] | string) => void;
}

export interface ApplicationFormData {
  title: string;
  description: string;
  questions: Question[];
}

export interface AnswerItem {
  id: number;
  value: string;
}

export interface ApplicationForm {
  id: string;
  title: string;
}