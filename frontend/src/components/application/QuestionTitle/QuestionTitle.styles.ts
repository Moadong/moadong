import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const QuestionTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const QuestionTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
`;

export const QuestionTitleId = styled.p`
  color: #ff5414;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.5;
  ${media.mobile} {
    font-size: 1.05rem;
    line-height: 1.4;
  }
`;

export const QuestionTitleText = styled.textarea`
  flex: 1;
  resize: none;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  border: none;
  outline: none;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  color: #111;
  field-sizing: content;

  &::placeholder {
    color: #c5c5c5;
    transition: opacity 0.15s;
  }

  &:focus::placeholder {
    opacity: 0;
  }

  ${media.mobile} {
    font-size: 1.05rem;
    line-height: 1.4;
  }
`;

export const QuestionRequired = styled.div`
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 50%;
  background-color: #ff5414;
`;

