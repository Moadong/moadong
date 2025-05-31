// types/application.ts

export const QUESTION_TYPE_LIST = [
  'SHORT_TEXT',
  'CHOICE',
  'LONG_TEXT',
  'MULTI_CHOICE',
  'EMAIL',
  'PHONE_NUMBER',
  'NAME',
] as const;

export type QuestionType = (typeof QUESTION_TYPE_LIST)[number];

export interface Question {
  id: number;
  title: string;
  description: string;
  type: QuestionType;
  options: {
    required: boolean;
  };
  items?: { value: string }[];
}

export interface QuestionBuilderProps extends Question {
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onItemsChange?: (newItems: { value: string }[]) => void;
  onTypeChange?: (type: QuestionType) => void;
  onRequiredChange?: (required: boolean) => void;
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
}

export interface ApplicationFormData {
  form_title: string;
  questions: Question[];
}
