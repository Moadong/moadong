import styled from 'styled-components';

export const QuestionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const QuestionTitleId = styled.p`
  color: #ff5414;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: normal;
`;

export const QuestionTitleText = styled.input`
  border: none;
  outline: none;
  color: #111;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: normal;
  width: 100%;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }
`;

export const QuestionRequired = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff5414;
  margin-left: 14px;
`;
