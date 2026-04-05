import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchGoogleAuthorizeUrl } from '@/apis/calendarOAuth';
import {
  useDisconnectGoogleCalendar,
  useGetGoogleCalendarEvents,
  useGetGoogleCalendars,
  useSelectGoogleCalendar,
} from '@/hooks/Queries/useGoogleCalendar';
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
  const [selectedCalendarId, setSelectedCalendarId] = useState('');
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const calendarsQuery = useGetGoogleCalendars();
  const selectMutation = useSelectGoogleCalendar();
  const disconnectMutation = useDisconnectGoogleCalendar();

  const eventTimeRange = useMemo(() => {
    const now = new Date();
    return {
      timeMin: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
      timeMax: new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString(),
    };
  }, []);

  const eventsQuery = useGetGoogleCalendarEvents(
    selectedCalendarId,
    eventTimeRange.timeMin,
    eventTimeRange.timeMax,
  );

  const isGoogleConnected = calendarsQuery.data != null;
  const googleCalendars = calendarsQuery.data?.items ?? [];
  const googleCalendarEvents = eventsQuery.data ?? [];
  const isGoogleLoading =
    isOAuthLoading || selectMutation.isPending || disconnectMutation.isPending;

  // 서버 데이터 기반 selectedCalendarId 초기화 (서버 선택값 → primary → 첫 번째)
  useEffect(() => {
    if (!selectedCalendarId && calendarsQuery.data) {
      const { items, selectedCalendarId: serverSelected } = calendarsQuery.data;
      if (serverSelected) {
        setSelectedCalendarId(serverSelected);
      } else {
        const primary = items.find((cal) => cal.primary);
        setSelectedCalendarId(primary?.id ?? items[0]?.id ?? '');
      }
    }
  }, [calendarsQuery.data, selectedCalendarId]);

  useEffect(() => {
    if (calendarsQuery.error instanceof Error) {
      onError(calendarsQuery.error.message);
    }
  }, [calendarsQuery.error, onError]);

  useEffect(() => {
    if (eventsQuery.error instanceof Error) {
      onError(eventsQuery.error.message);
    }
  }, [eventsQuery.error, onError]);

  // OAuth 콜백 처리
  useEffect(() => {
    const errorMessage = sessionStorage.getItem(GOOGLE_OAUTH_ERROR_KEY);
    if (errorMessage) {
      onError(errorMessage);
      sessionStorage.removeItem(GOOGLE_OAUTH_ERROR_KEY);
      return;
    }

    const successFlag = sessionStorage.getItem(GOOGLE_OAUTH_SUCCESS_KEY);
    if (successFlag) {
      sessionStorage.removeItem(GOOGLE_OAUTH_SUCCESS_KEY);
      onStatus('Google OAuth 인증이 완료되었습니다.');
    }
  }, [onError, onStatus]);

  const startGoogleOAuth = useCallback(async () => {
    setIsOAuthLoading(true);
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
      setIsOAuthLoading(false);
    }
  }, [clearError, onError]);

  const handleSelectCalendar = useCallback(
    (calendarId: string) => {
      const calendar = googleCalendars.find((cal) => cal.id === calendarId);
      if (!calendar) return;

      clearError();
      selectMutation.mutate(
        { calendarId, calendarName: calendar.summary || '' },
        {
          onSuccess: () => {
            setSelectedCalendarId(calendarId);
            onStatus('캘린더가 선택되었습니다.');
          },
          onError: (error) => {
            if (error instanceof Error) onError(error.message);
          },
        },
      );
    },
    [clearError, googleCalendars, onError, onStatus, selectMutation],
  );

  const handleDisconnect = useCallback(() => {
    clearError();
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        setSelectedCalendarId('');
        onStatus('Google Calendar 연결이 해제되었습니다.');
      },
      onError: (error) => {
        if (error instanceof Error) onError(error.message);
      },
    });
  }, [clearError, disconnectMutation, onError, onStatus]);

  return {
    isGoogleConnected,
    googleCalendars,
    selectedCalendarId,
    googleCalendarEvents,
    isGoogleLoading,
    isInitialChecking: calendarsQuery.isPending,
    startGoogleOAuth,
    selectCalendar: handleSelectCalendar,
    disconnectGoogle: handleDisconnect,
  };
};
