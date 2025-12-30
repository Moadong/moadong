import { useLayoutEffect, useRef } from 'react';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import useDevice from '@/hooks/useDevice';
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
  const { isMobile } = useDevice();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      const el = textAreaRef.current;
      if (mode === 'answer') {
        el.style.width = el.value.length + 'ch';
      }
      el.style.height = '0px';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [title]);
  return (
    <Styled.QuestionTitleRow>
      {!isMobile && id && (
        <Styled.QuestionTitleId>{id}.</Styled.QuestionTitleId>
      )}
      <Styled.QuestionTitleTextContainer>
        <Styled.QuestionTitleText
          ref={textAreaRef}
          rows={1}
          readOnly={mode === 'answer'}
          suppressContentEditableWarning={true}
          onChange={(e) => {
            const value = e.target.value || '';
            if (value.length <= APPLICATION_FORM.QUESTION_TITLE.maxLength) {
              onTitleChange?.(value);
            }
          }}
          value={title}
          placeholder={title ? '' : APPLICATION_FORM.QUESTION_TITLE.placeholder}
        ></Styled.QuestionTitleText>
        {mode === 'answer' && required && <Styled.QuestionRequired />}
      </Styled.QuestionTitleTextContainer>
    </Styled.QuestionTitleRow>
  );
};

export default QuestionTitle;
