import * as Styled from './GlobalErrorFallback.styles';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

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

const GlobalErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV;

  const handleReload = () => {
    window.location.href = '/';
  };

  const handleReset = () => {
    resetError();
  };

  return (
    <Styled.Container>
      <Styled.Content>
        <Styled.IconWrapper>
          <WarningIcon />
        </Styled.IconWrapper>

        <Styled.Title>서비스 이용에 불편을 드려 죄송합니다</Styled.Title>
        <Styled.Message>
          예상치 못한 오류가 발생하여 페이지를 표시할 수 없습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </Styled.Message>

        {isDev && error && (
          <Styled.ErrorDetails>
            <Styled.ErrorDetailsTitle>
              개발자 정보 (프로덕션에서는 표시되지 않습니다)
            </Styled.ErrorDetailsTitle>
            <Styled.ErrorMessage>{error.message}</Styled.ErrorMessage>
            {error.stack && (
              <Styled.StackTrace>{error.stack}</Styled.StackTrace>
            )}
          </Styled.ErrorDetails>
        )}

        <Styled.ButtonGroup>
          <Styled.PrimaryButton onClick={handleReset}>
            다시 시도
          </Styled.PrimaryButton>
          <Styled.SecondaryButton onClick={handleReload}>
            홈으로 이동
          </Styled.SecondaryButton>
        </Styled.ButtonGroup>
      </Styled.Content>
    </Styled.Container>
  );
};

export default GlobalErrorFallback;
