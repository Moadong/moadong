import * as Styled from './QuestionTitle.styles';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import useIsMobile from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Styled.QuestionTitleRow>
      {!isMobile && id && (
        <Styled.QuestionTitleId>{id}.</Styled.QuestionTitleId>
      )}
      <Styled.QuestionTitleTextContainer>
        <Styled.QuestionTitleText
          contentEditable={mode !== 'answer'}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            const value = e.currentTarget.textContent || '';
            if (value.length <= APPLICATION_FORM.QUESTION_TITLE.maxLength) {
              onTitleChange?.(value);
            }
          }}
          data-placeholder={title ? '' : APPLICATION_FORM.QUESTION_TITLE.placeholder}
        >
          {title}
        </Styled.QuestionTitleText>
        {mode === 'answer' && required && <Styled.QuestionRequired />}
      </Styled.QuestionTitleTextContainer>
    </Styled.QuestionTitleRow>
  );
};

export default QuestionTitle;
