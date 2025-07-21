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

export const FormDescription = styled.textarea`
  width: 100%;
  min-height: 120px;
  height: auto;
  resize: none;
  overflow: hidden;
  border: none;
  outline: none;
  margin-bottom: 24px;
  padding: 12px;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }

  &:hover {
    border: 1px solid #ccc;
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
  margin-bottom: 60px;
  cursor: pointer;
`;

export const QuestionDivider = styled.hr`
  margin-top: 40px;
  margin-bottom: 40px;
  border: none;
  border-top: 1px solid #ddd;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const submitButton = styled.button`
  padding: 10px 56px;
  background-color: #ff5414;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.4px;
  transition: background-color 0.2s;
  margin: 50px 0;

  &:hover {
    background-color: #ffad8e;
    animation: pulse 0.4s ease-in-out;
  }

  &:active {
    transform: scale(0.95);
  }
`;
