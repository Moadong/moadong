import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const QuestionTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
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

export const QuestionTitleTextWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

export const QuestionTitleText = styled.textarea`
  width: 100%;
  min-width: 100px;
  resize: none;
  border: none;
  outline: none;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  color: #111;
  background: transparent;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  overflow: hidden;

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

export const RequiredStar = styled.span`
  color: #ff5414;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5;
  margin-left: 4px;
`;

export const QuestionTitleReadOnly = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  color: #111;
  white-space: pre-wrap;
  word-break: break-word;

  ${media.mobile} {
    font-size: 1.05rem;
    line-height: 1.4;
  }
`;
