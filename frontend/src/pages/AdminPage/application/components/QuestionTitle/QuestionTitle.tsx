import * as Styled from './QuestionTitle.styles';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';

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
    <Styled.QuestionTitleContainer>
      {id && <Styled.QuestionTitleId>{id}.</Styled.QuestionTitleId>}
      <Styled.QuestionTitleText
        type='text'
        value={title}
        maxLength={APPLICATION_FORM.QUESTION_TITLE.maxLength}
        placeholder={APPLICATION_FORM.QUESTION_TITLE.placeholder}
        aria-label='질문 제목'
        readOnly={mode === 'answer'}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= APPLICATION_FORM.QUESTION_TITLE.maxLength) {
            onTitleChange?.(value);
          }
        }}
      />
      {mode === 'answer' && required && <Styled.QuestionRequired />}
    </Styled.QuestionTitleContainer>
  );
};

export default QuestionTitle;
