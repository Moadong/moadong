import { Component, ComponentType, ErrorInfo, ReactNode } from 'react';

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface BaseErrorBoundaryProps {
  children: ReactNode;
  fallback: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface BaseErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class BaseErrorBoundary extends Component<
  BaseErrorBoundaryProps,
  BaseErrorBoundaryState
> {
  constructor(props: BaseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): BaseErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: BaseErrorBoundaryProps): void {
    if (!this.state.hasError) return;

    const prevKeys = prevProps.resetKeys ?? [];
    const currentKeys = this.props.resetKeys ?? [];

    const hasChanged =
      prevKeys.length !== currentKeys.length ||
      prevKeys.some((key, index) => key !== currentKeys[index]);

    if (hasChanged) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback: FallbackComponent } = this.props;

    if (hasError && error) {
      return <FallbackComponent error={error} resetError={this.resetError} />;
    }

    return children;
  }
}

export default BaseErrorBoundary;
