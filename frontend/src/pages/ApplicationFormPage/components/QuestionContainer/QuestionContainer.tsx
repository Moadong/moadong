import { forwardRef } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ hasError?: boolean }>`
  border: ${({ hasError }) => (hasError ? '1px solid #FF5414' : 'transparent')};
  border-radius: 16px;
  padding: 26px 15px;
  position: relative;
  scroll-margin-top: 120px;
  transition: border 0.2s ease;
`;

const ErrorText = styled.div`
  color: #ff5414;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

interface Props {
  hasError?: boolean;
  children: React.ReactNode;
}

const QuestionContainer = forwardRef<HTMLDivElement, Props>(
  ({ hasError, children }, ref) => {
    return (
      <Container hasError={hasError} ref={ref}>
        {hasError && <ErrorText>‼️ 필수 입력 문항입니다</ErrorText>}
        {children}
      </Container>
    );
  },
);

export default QuestionContainer;
