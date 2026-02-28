import { ReactNode } from 'react';
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
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ApiErrorBoundary;
