import styled from 'styled-components';
import { APPLICATION_FORM } from '@/constants/APPLICATION_FORM';
import { useEffect, useRef } from 'react';

interface QuestionDescriptionProps {
  description: string;
  mode: 'builder' | 'answer';
  onDescriptionChange?: (value: string) => void;
}

const QuestionDescriptionText = styled.textarea`
  border: none;
  outline: none;
  color: #c5c5c5;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.26px;
  width: 100%;
  overflow: hidden;
  resize: none;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

const QuestionDescription = ({
  description,
  mode,
  onDescriptionChange,
}: QuestionDescriptionProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === 'answer') {
      return;
    }
    const el = textAreaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [description]);

  return (
    <>
      <QuestionDescriptionText
        ref={textAreaRef}
        value={description}
        maxLength={APPLICATION_FORM.QUESTION_DESCRIPTION.maxLength}
        placeholder={APPLICATION_FORM.QUESTION_DESCRIPTION.placeholder}
        aria-label='질문 설명'
        readOnly={mode === 'answer'}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= APPLICATION_FORM.QUESTION_DESCRIPTION.maxLength) {
            onDescriptionChange?.(value);
          }
        }}
      />
    </>
  );
};

export default QuestionDescription;
