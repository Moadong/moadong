import { renderHook } from '@testing-library/react';
import { recordClubDetailDuration } from '@/apis/clubDetailDuration';
import { createAnalyticsId } from '@/utils/analyticsVisitor';
import useTrackClubDetailDuration from './useTrackClubDetailDuration';

jest.mock('@/apis/clubDetailDuration', () => ({
  recordClubDetailDuration: jest.fn(),
}));

jest.mock('@/utils/analyticsVisitor', () => ({
  createAnalyticsId: jest.fn(),
  getAnalyticsVisitorId: jest.fn(() => 'visitor-1'),
}));

describe('useTrackClubDetailDuration', () => {
  const originalDateNow = Date.now;
  const originalHidden = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'hidden',
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (createAnalyticsId as jest.Mock)
      .mockReturnValueOnce('session-1')
      .mockReturnValueOnce('session-2')
      .mockReturnValue('session-next');
    (recordClubDetailDuration as jest.Mock).mockResolvedValue(true);
    Date.now = jest.fn(() => 1000);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    Date.now = originalDateNow;
    if (originalHidden) {
      Object.defineProperty(Document.prototype, 'hidden', originalHidden);
    }
  });

  it('unmount 시 체류 시간 payload를 한 번 전송한다', () => {
    const { unmount } = renderHook(() =>
      useTrackClubDetailDuration({
        clubId: 'club-1',
        clubName: '모아동',
      }),
    );

    Date.now = jest.fn(() => 6200);
    unmount();

    expect(recordClubDetailDuration).toHaveBeenCalledTimes(1);
    expect(recordClubDetailDuration).toHaveBeenCalledWith({
      clubId: 'club-1',
      clubName: '모아동',
      sessionId: 'session-1',
      visitorId: 'visitor-1',
      enteredAt: new Date(1000).toISOString(),
      leftAt: new Date(6200).toISOString(),
      durationSeconds: 5,
    });
  });

  it('여러 종료 이벤트가 발생해도 한 번만 전송한다', () => {
    renderHook(() =>
      useTrackClubDetailDuration({
        clubId: 'club-1',
        clubName: '모아동',
      }),
    );

    Date.now = jest.fn(() => 2000);
    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('beforeunload'));

    expect(recordClubDetailDuration).toHaveBeenCalledTimes(1);
  });

  it('document가 hidden 상태가 되면 전송한다', () => {
    renderHook(() =>
      useTrackClubDetailDuration({
        clubId: 'club-1',
      }),
    );

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    Date.now = jest.fn(() => 2600);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(recordClubDetailDuration).toHaveBeenCalledTimes(1);
  });

  it('clubId가 없거나 skip이면 전송하지 않는다', () => {
    const { unmount } = renderHook(() =>
      useTrackClubDetailDuration({
        skip: true,
      }),
    );

    unmount();

    expect(recordClubDetailDuration).not.toHaveBeenCalled();
  });

  it('clubId가 변경되면 이전 세션을 닫고 새 세션을 시작한다', () => {
    const { rerender, unmount } = renderHook(
      ({ clubId }) =>
        useTrackClubDetailDuration({
          clubId,
        }),
      {
        initialProps: {
          clubId: 'club-1',
        },
      },
    );

    Date.now = jest.fn(() => 3000);
    rerender({
      clubId: 'club-2',
    });

    expect(recordClubDetailDuration).toHaveBeenCalledTimes(1);
    expect(recordClubDetailDuration).toHaveBeenLastCalledWith(
      expect.objectContaining({
        clubId: 'club-1',
        durationSeconds: 2,
      }),
    );

    Date.now = jest.fn(() => 5000);
    unmount();

    expect(recordClubDetailDuration).toHaveBeenCalledTimes(2);
    expect(recordClubDetailDuration).toHaveBeenLastCalledWith(
      expect.objectContaining({
        clubId: 'club-2',
        durationSeconds: 2,
      }),
    );
  });

  it('durationSeconds를 backend 허용 범위로 보정한다', () => {
    const { unmount } = renderHook(() =>
      useTrackClubDetailDuration({
        clubId: 'club-1',
      }),
    );

    Date.now = jest.fn(() => 0);
    unmount();

    expect(recordClubDetailDuration).toHaveBeenCalledWith(
      expect.objectContaining({
        durationSeconds: 1,
      }),
    );
  });
});
