import styled from 'styled-components';

export const FormTitle = styled.input`
  font-size: 2.5rem;
  font-weight: 700;
  border: none;
  outline: none;
  margin: 76px 0;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 83px;
`;

export const AddQuestionButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #555;
  margin-top: 8px;
  cursor: pointer;
`;
