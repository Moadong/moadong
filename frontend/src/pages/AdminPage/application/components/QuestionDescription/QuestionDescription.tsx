import styled from 'styled-components';

interface QuestionDescriptionProps {
  description: string;
  mode: 'builder' | 'answer';
  onChange?: (value: string) => void;
}

const QuestionDescriptionText = styled.input`
  border: none;
  outline: none;
  color: #c5c5c5;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.26px;
`;

const QuestionDescription = ({
  description,
  mode,
  onChange,
}: QuestionDescriptionProps) => {
  return (
    <div>
      <QuestionDescriptionText
        value={description}
        readOnly={mode === 'answer'}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default QuestionDescription;
