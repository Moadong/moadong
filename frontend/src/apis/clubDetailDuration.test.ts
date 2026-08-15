import fetchMock from 'jest-fetch-mock';
import { recordClubDetailDuration } from './clubDetailDuration';

jest.mock('@/constants/api', () => ({
  __esModule: true,
  default: 'https://api.example.com',
}));

describe('recordClubDetailDuration', () => {
  const payload = {
    clubId: 'club-1',
    clubName: '모아동',
    sessionId: 'session-1',
    visitorId: 'visitor-1',
    enteredAt: '2026-08-06T00:00:00.000Z',
    leftAt: '2026-08-06T00:00:05.000Z',
    durationSeconds: 5,
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetch keepalive로 체류 시간을 기록한다', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await expect(recordClubDetailDuration(payload)).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/api/analytics/club-detail/duration',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      },
    );
  });

  it('fetch 시작이 실패하면 false를 반환한다', async () => {
    fetchMock.mockRejectOnce(new Error('network'));

    await expect(recordClubDetailDuration(payload)).resolves.toBe(false);
  });
});
