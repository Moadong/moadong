import { HttpError, NetworkError } from '@/errors';
import { ErrorFallbackProps } from '../BaseErrorBoundary';
import * as Styled from './ApiErrorFallback.styles';

const AlertIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    stroke='currentColor'
  >
    <path
      d='M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const getErrorInfo = (error: Error): { title: string; message: string } => {
  if (error instanceof NetworkError) {
    return {
      title: '네트워크 연결 실패',
      message: '인터넷 연결을 확인한 후 다시 시도해 주세요.',
    };
  }

  if (error instanceof HttpError) {
    if (error.isNotFound()) {
      return {
        title: '요청한 데이터를 찾을 수 없습니다',
        message: '존재하지 않거나 삭제된 항목일 수 있습니다.',
      };
    }

    if (error.isUnauthorized() || error.isForbidden()) {
      return {
        title: '접근 권한이 없습니다',
        message: '로그인 상태를 확인해 주세요.',
      };
    }

    if (error.isServerError()) {
      return {
        title: '서버에 문제가 발생했습니다',
        message: '잠시 후 다시 시도해 주세요.',
      };
    }

    return {
      title: '데이터를 불러오지 못했습니다',
      message: '일시적인 문제가 발생했습니다. 다시 시도해 주세요.',
    };
  }

  return {
    title: '데이터를 불러오지 못했습니다',
    message: '일시적인 문제가 발생했습니다. 다시 시도해 주세요.',
  };
};

const ApiErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV;
  const { title, message } = getErrorInfo(error);

  return (
    <Styled.Container>
      <Styled.Content>
        <Styled.IconWrapper>
          <AlertIcon />
        </Styled.IconWrapper>

        <Styled.Title>{title}</Styled.Title>
        <Styled.Message>{message}</Styled.Message>

        {isDev && error && (
          <Styled.ErrorDetails>
            <Styled.ErrorDetailsMessage>
              {error.message}
            </Styled.ErrorDetailsMessage>
          </Styled.ErrorDetails>
        )}

        <Styled.RetryButton onClick={resetError}>다시 시도</Styled.RetryButton>
      </Styled.Content>
    </Styled.Container>
  );
};

export default ApiErrorFallback;
