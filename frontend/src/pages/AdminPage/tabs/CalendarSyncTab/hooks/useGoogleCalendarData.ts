import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchGoogleAuthorizeUrl } from '@/apis/calendarOAuth';
import {
  isTokenRefreshFailedError,
  useDisconnectGoogleCalendar,
  useGetGoogleCalendarEvents,
  useGetGoogleCalendars,
  useSelectGoogleCalendar,
} from '@/hooks/Queries/useGoogleCalendar';
import { createState } from '@/utils/calendarSyncUtils';

const GOOGLE_STATE_KEY = 'admin_calendar_sync_google_state';
const GOOGLE_OAUTH_SUCCESS_KEY = 'admin_calendar_sync_google_oauth_success';
const GOOGLE_OAUTH_ERROR_KEY = 'admin_calendar_sync_google_oauth_error';
const GOOGLE_EXPIRED_MESSAGE =
  'Google 캘린더 연동이 만료되었습니다. 다시 연결해주세요.';

interface UseGoogleCalendarDataParams {
  onError: (message: string) => void;
  clearError: () => void;
}

export const useGoogleCalendarData = ({
  onError,
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

  /** 연동은 남아있지만 토큰이 죽은 상태. 재연동 전까지 데이터를 못 읽는다 */
  const isGoogleExpired =
    isTokenRefreshFailedError(calendarsQuery.error) ||
    isTokenRefreshFailedError(eventsQuery.error);
  const isGoogleConnected = calendarsQuery.data != null && !isGoogleExpired;
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
    }
  }, [onError]);

  /** 만료는 재시도로 풀리지 않으므로 일반 에러 대신 재연동을 안내한다 */
  useEffect(() => {
    if (isGoogleExpired) {
      onError(GOOGLE_EXPIRED_MESSAGE);
    }
  }, [isGoogleExpired, onError]);

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
          },
          onError: (error) => {
            if (error instanceof Error) onError(error.message);
          },
        },
      );
    },
    [clearError, googleCalendars, onError, selectMutation],
  );

  const handleDisconnect = useCallback(() => {
    clearError();
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        setSelectedCalendarId('');
      },
      onError: (error) => {
        if (error instanceof Error) onError(error.message);
      },
    });
  }, [clearError, disconnectMutation, onError]);

  return {
    isGoogleConnected,
    googleCalendars,
    selectedCalendarId,
    googleCalendarEvents,
    isGoogleLoading,
    isInitialChecking: calendarsQuery.isLoading,
    isEventsLoading: eventsQuery.isLoading,
    hasDataError:
      (calendarsQuery.isError || eventsQuery.isError) && !isGoogleExpired,
    retryData: () => {
      if (isGoogleExpired) return;
      if (calendarsQuery.isError) calendarsQuery.refetch();
      if (eventsQuery.isError) eventsQuery.refetch();
    },
    startGoogleOAuth,
    selectCalendar: handleSelectCalendar,
    disconnectGoogle: handleDisconnect,
  };
};
