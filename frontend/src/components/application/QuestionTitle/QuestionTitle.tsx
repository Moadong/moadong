import { useLayoutEffect, useRef } from 'react';
import { APPLICATION_FORM } from '@/constants/applicationForm';
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

  // 자동 높이 조절 (builder 모드에서만)
  useLayoutEffect(() => {
    if (mode === 'builder' && textAreaRef.current) {
      const el = textAreaRef.current;
      el.style.height = '0px';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [title, mode]);

  return (
    <Styled.QuestionTitleRow>
      {!isMobile && id && (
        <Styled.QuestionTitleId>{id}.</Styled.QuestionTitleId>
      )}
      {mode === 'answer' ? (
        <Styled.QuestionTitleReadOnly>
          {title}
          {required && (
            <Styled.RequiredStar aria-hidden='true'>*</Styled.RequiredStar>
          )}
        </Styled.QuestionTitleReadOnly>
      ) : (
        <Styled.QuestionTitleTextWrapper>
          <Styled.QuestionTitleText
            ref={textAreaRef}
            rows={1}
            value={title}
            onChange={(e) => {
              const value = e.target.value || '';
              if (value.length <= APPLICATION_FORM.QUESTION_TITLE.maxLength) {
                onTitleChange?.(value);
              }
            }}
            placeholder={APPLICATION_FORM.QUESTION_TITLE.placeholder}
            aria-required={required}
          />
          {required && (
            <Styled.RequiredStar aria-hidden='true'>*</Styled.RequiredStar>
          )}
        </Styled.QuestionTitleTextWrapper>
      )}
    </Styled.QuestionTitleRow>
  );
};

export default QuestionTitle;
