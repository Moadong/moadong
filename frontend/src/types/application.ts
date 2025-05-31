export type QuestionType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'CHOICE'
  | 'MULTI_CHOICE'
  | 'EMAIL'
  | 'PHONE_NUMBER'
  | 'NAME';

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

export interface ShortTextProps extends QuestionComponentProps {
  answer?: string;
  onAnswerChange?: (value: string) => void;
}

export interface ChoiceProps extends QuestionComponentProps {
  items?: { value: string }[];
  isMulti?: boolean;
  onItemsChange?: (newItems: { value: string }[]) => void;
}
