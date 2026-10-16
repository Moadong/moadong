import { renderHook, waitFor } from '@testing-library/react';
import { getClubIdByToken } from '@/apis/auth';
import { NetworkError } from '@/errors';
import { useAdminClubStore } from '@/store/useAdminClubStore';
import useAuth from './useAuth';

jest.mock('@/apis/auth', () => ({
  getClubIdByToken: jest.fn(),
}));

const mockGetClubIdByToken = getClubIdByToken as jest.Mock;

beforeEach(() => {
  useAdminClubStore.setState({ clubId: 'stored-club' });
});

describe('useAuth', () => {
  it('확인에 성공하면 clubId를 확인값으로 바꾼다', async () => {
    mockGetClubIdByToken.mockResolvedValueOnce('verified-club');
    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(useAdminClubStore.getState().clubId).toBe('verified-club');
  });

  it('인증이 무효면 저장된 clubId를 지운다', async () => {
    mockGetClubIdByToken.mockRejectedValueOnce(
      new Error('REFRESH_FAILED: REFRESH_FAILED'),
    );
    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(useAdminClubStore.getState().clubId).toBeNull();
  });

  it('네트워크 오류면 저장된 clubId를 남긴다', async () => {
    mockGetClubIdByToken.mockRejectedValueOnce(new NetworkError());
    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(useAdminClubStore.getState().clubId).toBe('stored-club');
  });
});
