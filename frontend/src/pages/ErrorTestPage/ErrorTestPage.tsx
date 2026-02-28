import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Styled from './ErrorTestPage.styles';

/**
 * 에러바운더리 테스트용 페이지
 * 개발 환경에서만 사용
 */
const ErrorTestPage = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  // 1. 동기 런타임 에러 테스트
  const throwSyncError = () => {
    setShouldThrow(true);
  };

  // 2. 비동기 에러 테스트
  const throwAsyncError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('비동기 에러 테스트: Promise 내부에서 에러 발생');
  };

  // 3. API 에러 테스트 (React Query)
  const { refetch: triggerQueryError } = useQuery({
    queryKey: ['error-test'],
    queryFn: async () => {
      throw new Error('React Query 에러 테스트: API 호출 실패');
    },
    enabled: false,
    throwOnError: true,
  });

  // 4. 타입 에러 시뮬레이션
  const throwTypeError = () => {
    // @ts-ignore
    const obj = null;
    // @ts-ignore
    console.log(obj.property.nested);
  };

  // 5. 이벤트 핸들러 에러
  const throwEventError = () => {
    throw new Error('이벤트 핸들러 에러 테스트');
  };

  if (shouldThrow) {
    throw new Error('동기 런타임 에러 테스트: 렌더링 중 에러 발생');
  }

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>🧪 에러바운더리 테스트 페이지</Styled.Title>
        <Styled.Subtitle>
          개발 환경에서만 사용 가능합니다. 각 버튼을 클릭하여 에러바운더리
          동작을 테스트하세요.
        </Styled.Subtitle>
      </Styled.Header>

      <Styled.Section>
        <Styled.SectionTitle>
          🔥 동기 에러 (ErrorBoundary 캐치)
        </Styled.SectionTitle>
        <Styled.Description>
          컴포넌트 렌더링 중 발생하는 에러입니다. ErrorBoundary가 캐치합니다.
        </Styled.Description>
        <Styled.TestButton onClick={throwSyncError} $variant='danger'>
          동기 런타임 에러 발생
        </Styled.TestButton>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>
          ⚡ 이벤트 핸들러 에러 (콘솔 에러)
        </Styled.SectionTitle>
        <Styled.Description>
          이벤트 핸들러 내부 에러는 ErrorBoundary가 캐치하지 않습니다. 콘솔에
          에러가 기록됩니다.
        </Styled.Description>
        <Styled.TestButton onClick={throwEventError} $variant='warning'>
          이벤트 핸들러 에러 발생
        </Styled.TestButton>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>
          🌐 React Query 에러 (ErrorBoundary 캐치)
        </Styled.SectionTitle>
        <Styled.Description>
          throwOnError: true 설정 시 ErrorBoundary가 캐치합니다.
        </Styled.Description>
        <Styled.TestButton
          onClick={() => triggerQueryError()}
          $variant='danger'
        >
          React Query 에러 발생
        </Styled.TestButton>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>⏱️ 비동기 에러 (콘솔 에러)</Styled.SectionTitle>
        <Styled.Description>
          Promise 내부 에러는 ErrorBoundary가 캐치하지 않습니다. try-catch나
          .catch()로 처리해야 합니다.
        </Styled.Description>
        <Styled.TestButton onClick={throwAsyncError} $variant='warning'>
          비동기 에러 발생
        </Styled.TestButton>
      </Styled.Section>

      <Styled.Section>
        <Styled.SectionTitle>
          💥 타입 에러 (ErrorBoundary 캐치)
        </Styled.SectionTitle>
        <Styled.Description>
          null/undefined 접근 에러입니다. 렌더링 중 발생하면 캐치됩니다.
        </Styled.Description>
        <Styled.TestButton onClick={throwTypeError} $variant='danger'>
          타입 에러 발생
        </Styled.TestButton>
      </Styled.Section>

      <Styled.InfoBox>
        <Styled.InfoTitle>ℹ️ 테스트 가이드</Styled.InfoTitle>
        <Styled.InfoList>
          <li>
            <strong>ErrorBoundary 캐치:</strong> 빨간색 버튼 - 에러 폴백 UI가
            표시됩니다
          </li>
          <li>
            <strong>콘솔 에러:</strong> 노란색 버튼 - 콘솔에 에러가 기록되지만
            앱은 정상 동작합니다
          </li>
          <li>
            <strong>Sentry 전송:</strong> 모든 에러는 Sentry 대시보드에
            기록됩니다
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
