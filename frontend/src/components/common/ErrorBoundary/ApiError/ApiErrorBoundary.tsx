import { ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { HttpError } from '@/errors';
import BaseErrorBoundary from '../BaseErrorBoundary';
import ApiErrorFallback from './ApiErrorFallback';

interface ApiErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  resetKeys?: unknown[];
}

const ApiErrorBoundary = ({
  children,
  onReset,
  resetKeys,
}: ApiErrorBoundaryProps) => {
  return (
    <BaseErrorBoundary
      fallback={ApiErrorFallback}
      onReset={onReset}
      resetKeys={resetKeys}
      onError={(error, errorInfo) => {
        // 예상된 4xx(404 등 사용자에게 메시지로 안내되는 에러)는 노이즈라 제외하고,
        // 5xx 및 HttpError가 아닌 예상 외 에러만 Sentry로 보낸다.
        if (error instanceof HttpError && error.isClientError()) return;
        Sentry.captureException(error, {
          extra: { boundary: 'api', componentStack: errorInfo.componentStack },
        });
      }}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ApiErrorBoundary;
