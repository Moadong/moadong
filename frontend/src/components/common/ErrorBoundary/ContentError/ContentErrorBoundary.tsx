import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import BaseErrorBoundary from '../BaseErrorBoundary';
import ContentErrorFallback from '../ContentError/ContentErrorFallback';

interface ContentErrorBoundaryProps {
  children: ReactNode;
  resetKeys?: unknown[];
}

const ContentErrorBoundary = ({
  children,
  resetKeys = [],
}: ContentErrorBoundaryProps) => {
  const { pathname } = useLocation();

  return (
    <BaseErrorBoundary
      fallback={ContentErrorFallback}
      resetKeys={[pathname, ...resetKeys]}
      onError={(error, errorInfo) =>
        Sentry.captureException(error, {
          extra: {
            boundary: 'content',
            pathname,
            componentStack: errorInfo.componentStack,
          },
        })
      }
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ContentErrorBoundary;
