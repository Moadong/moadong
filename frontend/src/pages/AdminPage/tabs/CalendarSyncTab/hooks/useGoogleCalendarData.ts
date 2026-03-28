import { useEffect, useMemo, useState } from 'react';
import {
  fetchGoogleCalendarList,
  fetchGooglePrimaryEvents,
  GoogleCalendarItem,
  GoogleEventItem,
} from '@/apis/calendarOAuth';
import {
  buildDefaultRedirectUri,
  createState,
} from '@/utils/calendarSyncUtils';

const GOOGLE_STATE_KEY = 'admin_calendar_sync_google_state';
const GOOGLE_TOKEN_KEY = 'admin_calendar_sync_google_token';

interface UseGoogleCalendarDataParams {
  onError: (message: string) => void;
  onStatus: (message: string) => void;
  clearError: () => void;
}

export const useGoogleCalendarData = ({
  onError,
  onStatus,
  clearError,
}: UseGoogleCalendarDataParams) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';
  const redirectUri = buildDefaultRedirectUri();

  const [googleToken, setGoogleToken] = useState(
    () => sessionStorage.getItem(GOOGLE_TOKEN_KEY) ?? '',
  );
  const [googleCalendars, setGoogleCalendars] = useState<GoogleCalendarItem[]>(
    [],
  );
  const [googleEvents, setGoogleEvents] = useState<GoogleEventItem[]>([]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const canStartGoogleOAuth = useMemo(
    () => googleClientId.length > 0,
    [googleClientId],
  );

  const startGoogleOAuth = () => {
    if (!canStartGoogleOAuth) {
      onError('VITE_GOOGLE_CLIENT_ID 설정이 필요합니다.');
      return;
    }

    const state = createState();
    sessionStorage.setItem(GOOGLE_STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      include_granted_scopes: 'true',
      prompt: 'consent',
      state,
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : '';

    if (!hash) return;

    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const state = params.get('state');
    const expectedState = sessionStorage.getItem(GOOGLE_STATE_KEY);

    if (token && state && expectedState && state === expectedState) {
      sessionStorage.removeItem(GOOGLE_STATE_KEY);
      setGoogleToken(token);
      sessionStorage.setItem(GOOGLE_TOKEN_KEY, token);
      onStatus('Google OAuth 인증이 완료되었습니다.');
      clearError();
    }

    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState({}, document.title, cleanUrl);
  }, [clearError, onStatus]);

  useEffect(() => {
    if (!googleToken) return;

    setIsGoogleLoading(true);
    clearError();

    Promise.all([
      fetchGoogleCalendarList(googleToken),
      fetchGooglePrimaryEvents(googleToken),
    ])
      .then(([calendars, events]) => {
        setGoogleCalendars(calendars);
        setGoogleEvents(events);
      })
      .catch((error: Error) => {
        onError(error.message);
      })
      .finally(() => {
        setIsGoogleLoading(false);
      });
  }, [clearError, googleToken, onError]);

  return {
    googleToken,
    googleCalendars,
    googleEvents,
    isGoogleLoading,
    canStartGoogleOAuth,
    startGoogleOAuth,
  };
};
