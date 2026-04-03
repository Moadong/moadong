import { useCallback, useEffect, useState } from 'react';
import {
  disconnectGoogleCalendar,
  fetchGoogleAuthorizeUrl,
  fetchGoogleCalendarEvents,
  fetchGoogleCalendars,
  selectGoogleCalendar,
} from '@/apis/calendarOAuth';
import { ApiError } from '@/errors';
import type { GoogleCalendarEvent, GoogleCalendarItem } from '@/types/google';
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
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<
    GoogleCalendarEvent[]
  >([]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isInitialChecking, setIsInitialChecking] = useState(true);

  const loadGoogleCalendars = useCallback(
    async (isInitial = false) => {
      if (!isInitial) {
        setIsGoogleLoading(true);
      }
      clearError();

      try {
        const response = await fetchGoogleCalendars();
        setGoogleCalendars(response.items);
        setIsGoogleConnected(true);

        // 서버가 제공한 선택값 우선, 없으면 primary, 없으면 첫 번째
        if (response.selectedCalendarId) {
          setSelectedCalendarId(response.selectedCalendarId);
        } else {
          const primaryCalendar = response.items.find((cal) => cal.primary);
          if (primaryCalendar) {
            setSelectedCalendarId(primaryCalendar.id);
          } else if (response.items.length > 0) {
            setSelectedCalendarId(response.items[0].id);
          }
        }
      } catch (error) {
        if (error instanceof ApiError && error.errorCode === '960-4') {
          setIsGoogleConnected(false);
          setGoogleCalendars([]);
          return;
        }
        if (error instanceof Error) {
          onError(error.message);
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

  const loadGoogleCalendarEvents = useCallback(
    async (calendarId: string) => {
      if (!calendarId) {
        setGoogleCalendarEvents([]);
        return;
      }

      clearError();

      try {
        // 현재 월의 첫날부터 다음 달 마지막날까지
        const now = new Date();
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          1,
        );
        const threeMonthsLater = new Date(
          now.getFullYear(),
          now.getMonth() + 4,
          0,
        );

        const events = await fetchGoogleCalendarEvents(
          calendarId,
          threeMonthsAgo.toISOString(),
          threeMonthsLater.toISOString(),
        );
        setGoogleCalendarEvents(events);
      } catch (error) {
        if (error instanceof Error) {
          onError(error.message);
        }
        setGoogleCalendarEvents([]);
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
        // selectedCalendarId 변경 시 useEffect에서 자동으로 이벤트 로드
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
      setGoogleCalendarEvents([]);
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
      loadGoogleCalendars(true);
      return;
    }

    loadGoogleCalendars(true);
  }, [loadGoogleCalendars, onError, onStatus]);

  useEffect(() => {
    if (selectedCalendarId && isGoogleConnected) {
      loadGoogleCalendarEvents(selectedCalendarId);
    }
  }, [selectedCalendarId, isGoogleConnected, loadGoogleCalendarEvents]);

  return {
    isGoogleConnected,
    googleCalendars,
    selectedCalendarId,
    googleCalendarEvents,
    isGoogleLoading,
    isInitialChecking,
    startGoogleOAuth,
    selectCalendar: handleSelectCalendar,
    disconnectGoogle: handleDisconnect,
    loadGoogleCalendars,
    loadGoogleCalendarEvents,
  };
};
