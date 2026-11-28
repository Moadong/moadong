import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { updateStudentProfile } from '@/apis/studentProfile';
import { queryKeys } from '@/constants/queryKeys';
import { useUpdateStudentProfile } from './useStudentProfile';

jest.mock('@/apis/studentProfile', () => ({
  getStudentProfile: jest.fn(),
  updateStudentProfile: jest.fn(),
}));

const mockedUpdateStudentProfile = updateStudentProfile as jest.Mock;

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

describe('useUpdateStudentProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('mutation 성공 시 studentProfile.profile() 쿼리를 무효화한다', async () => {
    mockedUpdateStudentProfile.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateStudentProfile(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('테스트닉네임');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.studentProfile.profile(),
    });
  });

  it('mutation 실패 시 쿼리를 무효화하지 않는다', async () => {
    mockedUpdateStudentProfile.mockRejectedValue(new Error('저장 실패'));

    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateStudentProfile(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate('테스트닉네임');

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
