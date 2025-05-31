import * as Styled from './QuestionTitle.styles';

interface QuestionTitleProps {
  id: number;
  title: string;
  required?: boolean;
  mode: 'builder' | 'answer';
  onChange?: (value: string) => void;
}

const QuestionTitle = ({
  id,
  title,
  required,
  mode,
  onChange,
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
        onChange={(e) => onChange?.(e.target.value)}
      />
      {mode === 'answer' && required && <QuestionRequired />}
    </QuestionTitleContainer>
  );
};

export default QuestionTitle;
