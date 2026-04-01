import { useCallback, useEffect, useState } from 'react';
import {
  disconnectGoogleCalendar,
  fetchGoogleAuthorizeUrl,
  fetchGoogleCalendars,
  GoogleCalendarItem,
  selectGoogleCalendar,
} from '@/apis/calendarOAuth';
import { createState } from '@/utils/calendarSyncUtils';

const GOOGLE_STATE_KEY = 'admin_calendar_sync_google_state';
const GOOGLE_OAUTH_SUCCESS_KEY = 'admin_calendar_sync_google_oauth_success';
const GOOGLE_OAUTH_ERROR_KEY = 'admin_calendar_sync_google_oauth_error';

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
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [googleCalendars, setGoogleCalendars] = useState<GoogleCalendarItem[]>(
    [],
  );
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isInitialChecking, setIsInitialChecking] = useState(true);

  const loadGoogleCalendars = useCallback(
    async (isInitial = false) => {
      if (!isInitial) {
        setIsGoogleLoading(true);
      }
      clearError();

      try {
        const calendars = await fetchGoogleCalendars();
        setGoogleCalendars(calendars);
        setIsGoogleConnected(true);

        const primaryCalendar = calendars.find((cal) => cal.primary);
        if (primaryCalendar) {
          setSelectedCalendarId(primaryCalendar.id);
        } else if (calendars.length > 0) {
          setSelectedCalendarId(calendars[0].id);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes('960-4') ||
            error.message.includes('미연결')
          ) {
            setIsGoogleConnected(false);
            setGoogleCalendars([]);
          } else {
            onError(error.message);
          }
        }
      } finally {
        if (isInitial) {
          setIsInitialChecking(false);
        } else {
          setIsGoogleLoading(false);
        }
      }
    },
    [clearError, onError],
  );

  const startGoogleOAuth = useCallback(async () => {
    setIsGoogleLoading(true);
    clearError();

    try {
      const state = createState();
      sessionStorage.setItem(GOOGLE_STATE_KEY, state);
      const authorizeUrl = await fetchGoogleAuthorizeUrl(state);
      window.location.href = authorizeUrl;
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      }
      setIsGoogleLoading(false);
    }
  }, [clearError, onError]);

  const handleSelectCalendar = useCallback(
    async (calendarId: string) => {
      const calendar = googleCalendars.find((cal) => cal.id === calendarId);
      if (!calendar) return;

      setIsGoogleLoading(true);
      clearError();

      try {
        await selectGoogleCalendar(calendarId, calendar.summary || '');
        setSelectedCalendarId(calendarId);
        onStatus('캘린더가 선택되었습니다.');
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [clearError, googleCalendars, onError, onStatus],
  );

  const handleDisconnect = useCallback(async () => {
    setIsGoogleLoading(true);
    clearError();

    try {
      await disconnectGoogleCalendar();
      setIsGoogleConnected(false);
      setGoogleCalendars([]);
      setSelectedCalendarId('');
      onStatus('Google Calendar 연결이 해제되었습니다.');
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }, [clearError, onError, onStatus]);

  useEffect(() => {
    const successFlag = sessionStorage.getItem(GOOGLE_OAUTH_SUCCESS_KEY);
    const errorMessage = sessionStorage.getItem(GOOGLE_OAUTH_ERROR_KEY);

    if (errorMessage) {
      onError(errorMessage);
      sessionStorage.removeItem(GOOGLE_OAUTH_ERROR_KEY);
      setIsInitialChecking(false);
      return;
    }

    if (successFlag) {
      sessionStorage.removeItem(GOOGLE_OAUTH_SUCCESS_KEY);
      onStatus('Google OAuth 인증이 완료되었습니다.');
      loadGoogleCalendars();
      return;
    }

    loadGoogleCalendars(true);
  }, [loadGoogleCalendars, onError, onStatus]);

  return {
    isGoogleConnected,
    googleCalendars,
    selectedCalendarId,
    isGoogleLoading,
    isInitialChecking,
    startGoogleOAuth,
    selectCalendar: handleSelectCalendar,
    disconnectGoogle: handleDisconnect,
    loadGoogleCalendars,
  };
};
