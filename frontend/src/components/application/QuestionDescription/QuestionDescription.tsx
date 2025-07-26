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
  color: #787878;
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

const AnswerText = styled.p`
  color: #787878;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.26px;
  white-space: pre-wrap;
  margin-bottom: 10px;
`;

const QuestionDescription = ({
  description,
  mode,
  onDescriptionChange,
}: QuestionDescriptionProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === 'builder' && textAreaRef.current) {
      const el = textAreaRef.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [description, mode]);

  if (mode === 'answer') {
    if (!description) return null;
    return <AnswerText>{description}</AnswerText>;
  }

  return (
    <QuestionDescriptionText
      ref={textAreaRef}
      value={description}
      maxLength={APPLICATION_FORM.QUESTION_DESCRIPTION.maxLength}
      placeholder={APPLICATION_FORM.QUESTION_DESCRIPTION.placeholder}
      aria-label='질문 설명'
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= APPLICATION_FORM.QUESTION_DESCRIPTION.maxLength) {
          onDescriptionChange?.(value);
        }
      }}
    />
  );
};

export default QuestionDescription;
