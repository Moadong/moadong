import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';

export type StatisticsRetryHandler<T> = (
  options?: RefetchOptions,
) => Promise<QueryObserverResult<T | undefined, Error>>;
