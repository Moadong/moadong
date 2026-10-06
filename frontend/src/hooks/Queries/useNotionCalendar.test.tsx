import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { fetchNotionDatabases, fetchNotionPages } from '@/apis/calendarOAuth';
import { ApiError } from '@/errors';
import { useGetNotionDatabases, useGetNotionPages } from './useNotionCalendar';

jest.mock('@/apis/calendarOAuth', () => ({
  fetchNotionDatabases: jest.fn(),
  fetchNotionPages: jest.fn(),
}));

const mockedFetchDatabases = fetchNotionDatabases as jest.Mock;
const mockedFetchPages = fetchNotionPages as jest.Mock;

/** 백엔드 NOTION_NOT_CONNECTED 응답 */
const notConnectedError = () => new ApiError(400, 'Bad Request', '950-6');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNotionCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('미연동(950-6)이면 데이터베이스 목록을 빈 배열로 둔다', async () => {
    mockedFetchDatabases.mockRejectedValue(notConnectedError());
    const { result } = renderHook(() => useGetNotionDatabases(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('미연동(950-6)이면 페이지 목록을 null로 둔다', async () => {
    mockedFetchPages.mockRejectedValue(notConnectedError());
    const { result } = renderHook(() => useGetNotionPages(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('다른 오류 코드는 쿼리 오류로 남긴다', async () => {
    mockedFetchPages.mockRejectedValue(
      new ApiError(400, 'Bad Request', '950-8'),
    );
    const { result } = renderHook(() => useGetNotionPages(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
