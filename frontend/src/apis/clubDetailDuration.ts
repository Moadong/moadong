import API_BASE_URL from '@/constants/api';

export interface ClubDetailDurationRecordRequest {
  clubId: string;
  clubName?: string;
  sessionId: string;
  visitorId: string;
  enteredAt: string;
  leftAt: string;
  durationSeconds: number;
}

const DURATION_PATH = '/api/analytics/club-detail/duration';

const buildDurationUrl = () => {
  if (!API_BASE_URL) return undefined;

  try {
    return new URL(DURATION_PATH, API_BASE_URL).toString();
  } catch {
    return undefined;
  }
};

const sendBeaconFallback = (url: string, body: string) => {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
    return false;
  }

  const blob = new Blob([body], { type: 'application/json' });
  return navigator.sendBeacon(url, blob);
};

export const recordClubDetailDuration = async (
  payload: ClubDetailDurationRecordRequest,
) => {
  const url = buildDurationUrl();
  if (!url) return false;

  const body = JSON.stringify(payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
    });

    return response.ok;
  } catch {
    const beaconQueued = sendBeaconFallback(url, body);
    return beaconQueued;
  }
};
