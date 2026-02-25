import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
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
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ContentErrorBoundary;
