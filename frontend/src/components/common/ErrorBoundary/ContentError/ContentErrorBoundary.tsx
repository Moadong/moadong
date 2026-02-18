import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BaseErrorBoundary from '../BaseErrorBoundary';
import ContentErrorFallback from '../ContentError/ContentErrorFallback';

interface ContentErrorBoundaryProps {
  children: ReactNode;
}

const ContentErrorBoundary = ({ children }: ContentErrorBoundaryProps) => {
  const { pathname } = useLocation();

  return (
    <BaseErrorBoundary
      fallback={ContentErrorFallback}
      resetKeys={[pathname]}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default ContentErrorBoundary;
