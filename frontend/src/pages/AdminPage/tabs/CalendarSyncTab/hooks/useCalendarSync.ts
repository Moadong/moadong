import { useCallback, useState } from 'react';
import { useGetCustomCalendarEvents } from '@/hooks/Queries/useCustomCalendarEvents';
import { useGetHiddenCalendarEvents } from '@/hooks/Queries/useHiddenCalendarEvents';
import {
  NotionCalendarEvent,
  parseNotionCalendarEvent,
} from '@/utils/calendarSyncUtils';
import { useGoogleCalendarData } from './useGoogleCalendarData';
import { useNotionCalendarData } from './useNotionCalendarData';
import { useNotionOAuth } from './useNotionOAuth';

export const useCalendarSync = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [notionWorkspaceName, setNotionWorkspaceName] = useState('');

  const clearError = useCallback(() => setErrorMessage(''), []);

  const googleData = useGoogleCalendarData({
    onError: setErrorMessage,
    clearError,
  });

  const notionData = useNotionCalendarData({
    onError: setErrorMessage,
    clearError,
    // 워크스페이스 이름이 남으면 해제 후에도 연결됨으로 보인다
    onDisconnected: () => setNotionWorkspaceName(''),
  });

  /** Notion page 응답을 날짜순 캘린더 이벤트로 변환한다 */
  const notionCalendarEvents = notionData.notionItems
    .map(parseNotionCalendarEvent)
    .filter((event): event is NotionCalendarEvent => event !== null)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const {
    isLoading: isCustomEventsLoading,
    isError: isCustomEventsError,
    refetch: refetchCustomEvents,
  } = useGetCustomCalendarEvents();
  const {
    isLoading: isHiddenEventsLoading,
    isError: isHiddenEventsError,
    refetch: refetchHiddenEvents,
  } = useGetHiddenCalendarEvents();

  const isCalendarDataLoading =
    googleData.isInitialChecking ||
    googleData.isEventsLoading ||
    notionData.isNotionLoading ||
    notionData.isNotionDatabaseApplying ||
    isCustomEventsLoading ||
    isHiddenEventsLoading;

  // 쿼리 실패는 일정이 하나도 없는 캘린더와 구분되지 않는다. 사용자 액션 실패와
  // 같은 슬롯을 쓰면 서로 덮어쓰므로 따로 모아 재시도 경로와 함께 안내한다.
  const hasCalendarDataError =
    googleData.hasDataError ||
    notionData.hasDataError ||
    isCustomEventsError ||
    isHiddenEventsError;

  const retryCalendarData = () => {
    googleData.retryData();
    notionData.retryData();
    if (isCustomEventsError) refetchCustomEvents();
    if (isHiddenEventsError) refetchHiddenEvents();
  };

  const notionOAuth = useNotionOAuth({
    loadNotionPages: notionData.loadNotionPages,
    onWorkspaceName: setNotionWorkspaceName,
    onError: setErrorMessage,
    clearError,
  });

  return {
    isGoogleConnected: googleData.isGoogleConnected,
    isGoogleInitialChecking: googleData.isInitialChecking,
    googleCalendars: googleData.googleCalendars,
    selectedGoogleCalendarId: googleData.selectedCalendarId,
    googleCalendarEvents: googleData.googleCalendarEvents,
    notionDatabaseOptions: notionData.notionDatabaseOptions,
    selectedNotionDatabaseId: notionData.selectedNotionDatabaseId,
    setSelectedNotionDatabaseId: notionData.setSelectedNotionDatabaseId,
    isNotionDatabaseApplying: notionData.isNotionDatabaseApplying,
    errorMessage,
    hasCalendarDataError,
    retryCalendarData,
    isCalendarDataLoading,
    isGoogleLoading: googleData.isGoogleLoading,
    isNotionLoading:
      notionData.isNotionLoading ||
      notionOAuth.isNotionOAuthLoading ||
      notionData.isNotionDatabaseApplying ||
      notionData.isNotionDisconnecting,
    notionWorkspaceName,
    notionCalendarEvents,
    startGoogleOAuth: googleData.startGoogleOAuth,
    selectGoogleCalendar: googleData.selectCalendar,
    disconnectGoogle: googleData.disconnectGoogle,
    startNotionOAuth: notionOAuth.startNotionOAuth,
    disconnectNotion: notionData.disconnectNotion,
    applySelectedNotionDatabase: notionData.applySelectedNotionDatabase,
  };
};
