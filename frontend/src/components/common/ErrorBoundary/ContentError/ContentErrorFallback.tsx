import { ErrorFallbackProps } from '../BaseErrorBoundary';
import * as Styled from './ContentErrorFallback.styles';

const WarningIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    stroke='currentColor'
  >
    <path
      d='M12 9V14M12 17.5V18M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22Z'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ContentErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV;

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Styled.Container>
      <Styled.Content>
        <Styled.IconWrapper>
          <WarningIcon />
        </Styled.IconWrapper>

        <Styled.Title>페이지를 표시할 수 없습니다</Styled.Title>
        <Styled.Message>
          일시적인 문제가 발생했습니다.
          <br />
          다시 시도하거나 잠시 후 방문해 주세요.
        </Styled.Message>

        {isDev && error && (
          <Styled.ErrorDetails>
            <Styled.ErrorMessage>{error.message}</Styled.ErrorMessage>
          </Styled.ErrorDetails>
        )}

        <Styled.ButtonGroup>
          <Styled.PrimaryButton onClick={resetError}>
            다시 시도
          </Styled.PrimaryButton>
          <Styled.SecondaryButton onClick={handleGoHome}>
            홈으로 이동
          </Styled.SecondaryButton>
        </Styled.ButtonGroup>
      </Styled.Content>
    </Styled.Container>
  );
};

export default ContentErrorFallback;
