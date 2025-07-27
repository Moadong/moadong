import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const QuestionTitleContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export const QuestionTitleRow = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
`;

export const QuestionTitleId = styled.p`
  color: #ff5414;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.5;
  ${media.mobile} {
    font-size: 1.05rem;
    line-height: 1.4;
  }
`;

export const QuestionTitleTextContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  width: fit-content;
  max-width: calc(100% - 20px);
`;

export const QuestionTitleText = styled.div`
  display: inline-block;
  min-width: 100px;
  resize: none;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  border: none;
  outline: none;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  color: #111;

  &:empty:before {
    content: attr(data-placeholder);
    color: #c5c5c5;
  }

  &:focus:before {
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
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 50%;
  background-color: #ff5414;
  flex-shrink: 0;
`;
