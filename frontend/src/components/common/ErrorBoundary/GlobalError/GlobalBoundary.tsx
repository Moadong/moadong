import { ReactNode, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import Spinner from '../../Spinner/Spinner';
import GlobalErrorFallback from './GlobalErrorFallback';

interface GlobalBoundaryProps {
  children: ReactNode;
}

const GlobalBoundary = ({ children }: GlobalBoundaryProps) => {
  return (
    <Sentry.ErrorBoundary
      fallback={(errorData) => (
        <GlobalErrorFallback
          error={errorData.error as Error}
          resetError={errorData.resetError}
        />
      )}
    >
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </Sentry.ErrorBoundary>
  );
};

export default GlobalBoundary;
