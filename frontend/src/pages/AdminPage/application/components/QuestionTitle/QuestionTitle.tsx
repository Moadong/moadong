import * as Styled from './QuestionTitle.styles';

interface QuestionTitleProps {
  id: number;
  title: string;
  required?: boolean;
  mode: 'builder' | 'answer';
  onTitleChange?: (value: string) => void;
}

const QuestionTitle = ({
  id,
  title,
  required,
  mode,
  onTitleChange,
}: QuestionTitleProps) => {
  return (
    <QuestionTitleContainer>
      {id && <QuestionTitleId>{id}.</QuestionTitleId>}
      <QuestionTitleText
        type='text'
        value={title}
        placeholder='질문 제목을 입력하세요'
        aria-label='질문 제목'
        readOnly={mode === 'answer'}
        onChange={(e) => onTitleChange?.(e.target.value)}
      />
      {mode === 'answer' && required && <QuestionRequired />}
    </QuestionTitleContainer>
  );
};

export default QuestionTitle;
