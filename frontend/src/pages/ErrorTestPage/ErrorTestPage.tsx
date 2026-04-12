import { useState } from 'react';
import * as Sentry from '@sentry/react';
import { useQuery } from '@tanstack/react-query';
import {
  ApiErrorBoundary,
  ContentErrorBoundary,
} from '@/components/common/ErrorBoundary';
import { ApiError, HttpError, NetworkError } from '@/errors';
import * as Styled from './ErrorTestPage.styles';

/**
 * ApiErrorBoundary 테스트용 컴포넌트
 */
interface ApiErrorTestProps {
  errorType: 'none' | '404' | '403' | '500' | 'network';
}

const ApiErrorTest = ({ errorType }: ApiErrorTestProps) => {
  const { data } = useQuery({
    queryKey: ['api-error-test', errorType],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      switch (errorType) {
        case '404':
          throw new ApiError(
            404,
            'Not Found',
            'RESOURCE_NOT_FOUND',
            null,
            '요청한 리소스를 찾을 수 없습니다',
          );
        case '403':
          throw new HttpError(403, 'Forbidden', '접근 권한이 없습니다');
        case '500':
          throw new ApiError(
            500,
            'Internal Server Error',
            'SERVER_ERROR',
            null,
            '서버 오류가 발생했습니다',
          );
        case 'network':
          throw new NetworkError('네트워크 연결 실패');
        default:
          return { message: '정상 데이터' };
      }
    },
    throwOnError: true,
    enabled: errorType !== 'none',
  });

  return (
    <Styled.DataDisplay>
      ✅ 데이터 로드 성공: {data?.message || '대기 중'}
    </Styled.DataDisplay>
  );
};

/**
 * ContentErrorBoundary 테스트용 컴포넌트
 */
const ContentErrorTest = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('ContentErrorBoundary 테스트: 페이지 콘텐츠 렌더링 에러');
  }

  return (
    <Styled.DataDisplay>
      ✅ 페이지 콘텐츠가 정상적으로 렌더링되었습니다
    </Styled.DataDisplay>
  );
};

/**
 * 에러바운더리 테스트용 페이지
 * 개발 환경에서만 사용
 */
const ErrorTestPage = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [apiErrorType, setApiErrorType] = useState<
    'none' | '404' | '403' | '500' | 'network'
  >('none');

  // 전역 에러 (GlobalErrorBoundary 캐치)
  const throwGlobalError = () => {
    setShouldThrow(true);
  };

  // ContentErrorBoundary 테스트
  const testContentError = () => {
    setContentError(true);
  };

  const resetContentError = () => {
    setContentError(false);
  };

  // ApiErrorBoundary 테스트
  const testApiError = (type: '404' | '403' | '500' | 'network') => {
    setApiErrorType(type);
  };

  const resetApiError = () => {
    setApiErrorType('none');
  };

  // Sentry 수동 전송 테스트
  const testSentryCapture = () => {
    try {
      throw new Error('Sentry 수동 전송 테스트: 개발 환경에서 Sentry 확인');
    } catch (_error) {
      Sentry.captureException(error);
      alert('Sentry에 에러가 전송되었습니다! Sentry 대시보드를 확인하세요.');
    }
  };

  const testSentryMessage = () => {
    Sentry.captureMessage('Sentry 메시지 테스트', 'info');
    alert('Sentry에 메시지가 전송되었습니다! Sentry 대시보드를 확인하세요.');
  };

  if (shouldThrow) {
    throw new Error('GlobalErrorBoundary 테스트: 앱 전체 크래시');
  }

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>🧪 계층적 에러바운더리 테스트</Styled.Title>
        <Styled.Subtitle>
          3단계 에러바운더리 구조를 테스트합니다: Global → Content → Api
        </Styled.Subtitle>
      </Styled.Header>

      {/* Sentry 전송 테스트 */}
      <Styled.BoundarySection $level='global'>
        <Styled.BoundaryLabel $level='global'>
          Sentry 전송 테스트
        </Styled.BoundaryLabel>
        <Styled.Section>
          <Styled.SectionTitle>
            📡 Sentry 수동 전송 (개발 환경 테스트)
          </Styled.SectionTitle>
          <Styled.Description>
            개발 환경에서 Sentry로 에러를 수동 전송합니다. Sentry 대시보드에서
            확인 가능합니다.
          </Styled.Description>
          <Styled.ButtonGroup>
            <Styled.TestButton onClick={testSentryCapture} $variant='info'>
              Sentry에 에러 전송
            </Styled.TestButton>
            <Styled.TestButton onClick={testSentryMessage} $variant='info'>
              Sentry에 메시지 전송
            </Styled.TestButton>
          </Styled.ButtonGroup>
        </Styled.Section>
      </Styled.BoundarySection>

      {/* Level 1: GlobalErrorBoundary */}
      <Styled.BoundarySection $level='global'>
        <Styled.BoundaryLabel $level='global'>
          Level 1: GlobalErrorBoundary
        </Styled.BoundaryLabel>
        <Styled.Section>
          <Styled.SectionTitle>
            🌍 GlobalErrorBoundary (최상위 안전망)
          </Styled.SectionTitle>
          <Styled.Description>
            앱 전체를 감싸는 최후의 안전망입니다. 전체 화면 에러 UI가
            표시됩니다. (Sentry 자동 전송)
          </Styled.Description>
          <Styled.TestButton onClick={throwGlobalError} $variant='danger'>
            전역 에러 발생 (앱 크래시)
          </Styled.TestButton>
        </Styled.Section>
      </Styled.BoundarySection>

      {/* Level 2: ContentErrorBoundary */}
      <Styled.BoundarySection $level='content'>
        <Styled.BoundaryLabel $level='content'>
          Level 2: ContentErrorBoundary
        </Styled.BoundaryLabel>
        <Styled.Section>
          <Styled.SectionTitle>
            📄 ContentErrorBoundary (페이지 단위)
          </Styled.SectionTitle>
          <Styled.Description>
            각 라우트/페이지를 감쌉니다. 페이지 영역만 에러 UI가 표시되며,
            헤더/푸터는 유지됩니다.
          </Styled.Description>

          <ContentErrorBoundary resetKeys={[contentError]}>
            <ContentErrorTest shouldError={contentError} />
          </ContentErrorBoundary>

          <Styled.ButtonGroup>
            <Styled.TestButton onClick={testContentError} $variant='danger'>
              Content 에러 발생
            </Styled.TestButton>
            <Styled.TestButton onClick={resetContentError} $variant='info'>
              Content 리셋
            </Styled.TestButton>
          </Styled.ButtonGroup>
        </Styled.Section>
      </Styled.BoundarySection>

      {/* Level 3: ApiErrorBoundary */}
      <Styled.BoundarySection $level='api'>
        <Styled.BoundaryLabel $level='api'>
          Level 3: ApiErrorBoundary
        </Styled.BoundaryLabel>
        <Styled.Section>
          <Styled.SectionTitle>
            🌐 ApiErrorBoundary (데이터 페칭 단위)
          </Styled.SectionTitle>
          <Styled.Description>
            개별 데이터 섹션을 감쌉니다. HTTP 상태 코드별로 다른 메시지가
            표시됩니다.
          </Styled.Description>

          <ApiErrorBoundary resetKeys={[apiErrorType]}>
            <ApiErrorTest errorType={apiErrorType} />
          </ApiErrorBoundary>

          <Styled.ButtonGroup>
            <Styled.TestButton
              onClick={() => testApiError('404')}
              $variant='danger'
            >
              404 Not Found
            </Styled.TestButton>
            <Styled.TestButton
              onClick={() => testApiError('403')}
              $variant='danger'
            >
              403 Forbidden
            </Styled.TestButton>
            <Styled.TestButton
              onClick={() => testApiError('500')}
              $variant='danger'
            >
              500 Server Error
            </Styled.TestButton>
            <Styled.TestButton
              onClick={() => testApiError('network')}
              $variant='danger'
            >
              Network Error
            </Styled.TestButton>
            <Styled.TestButton onClick={resetApiError} $variant='info'>
              Api 리셋
            </Styled.TestButton>
          </Styled.ButtonGroup>
        </Styled.Section>
      </Styled.BoundarySection>

      {/* 가이드 */}
      <Styled.InfoBox>
        <Styled.InfoTitle>ℹ️ 에러바운더리 계층 구조</Styled.InfoTitle>
        <Styled.InfoList>
          <li>
            <strong>GlobalErrorBoundary:</strong> Sentry 연동, 전체 화면 에러
            UI, 앱 전체 크래시 방지
          </li>
          <li>
            <strong>ContentErrorBoundary:</strong> 라우트 전환 시 자동 리셋,
            페이지 영역 격리
          </li>
          <li>
            <strong>ApiErrorBoundary:</strong> HTTP 상태 코드별 메시지 분기,
            데이터 섹션 격리
          </li>
          <li>
            <strong>에러 전파:</strong> 하위 바운더리가 처리하지 못한 에러는
            상위로 전파됩니다
          </li>
        </Styled.InfoList>
      </Styled.InfoBox>

      <Styled.BackButton onClick={() => (window.location.href = '/')}>
        ← 메인 페이지로 돌아가기
      </Styled.BackButton>
    </Styled.Container>
  );
};

export default ErrorTestPage;
