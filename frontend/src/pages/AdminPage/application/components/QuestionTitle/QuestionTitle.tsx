import styled from 'styled-components';

const QuestionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QuestionTitleId = styled.p`
  color: #ff5414;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: normal;
`;

const QuestionTitleText = styled.input`
  border: none;
  outline: none;
  color: #111;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: normal;
`;

const QuestionRequired = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5414;
  margin-left: 14px;
`;

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
