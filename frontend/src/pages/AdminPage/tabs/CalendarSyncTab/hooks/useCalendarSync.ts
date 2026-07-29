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
  });

  /** Notion page 응답을 날짜순 캘린더 이벤트로 변환한다 */
  const notionCalendarEvents = notionData.notionItems
    .map(parseNotionCalendarEvent)
    .filter((event): event is NotionCalendarEvent => event !== null)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  const { isLoading: isCustomEventsLoading, isError: isCustomEventsError } =
    useGetCustomCalendarEvents();
  const { isLoading: isHiddenEventsLoading, isError: isHiddenEventsError } =
    useGetHiddenCalendarEvents();

  const isCalendarDataLoading =
    googleData.isInitialChecking ||
    googleData.isEventsLoading ||
    notionData.isNotionLoading ||
    notionData.isNotionDatabaseApplying ||
    isCustomEventsLoading ||
    isHiddenEventsLoading;

  const calendarEventsErrorMessage =
    isCustomEventsError || isHiddenEventsError
      ? '일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
      : '';

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
    errorMessage: errorMessage || calendarEventsErrorMessage,
    isCalendarDataLoading,
    isGoogleLoading: googleData.isGoogleLoading,
    isNotionLoading:
      notionData.isNotionLoading ||
      notionOAuth.isNotionOAuthLoading ||
      notionData.isNotionDatabaseApplying,
    notionWorkspaceName,
    notionCalendarEvents,
    startGoogleOAuth: googleData.startGoogleOAuth,
    selectGoogleCalendar: googleData.selectCalendar,
    disconnectGoogle: googleData.disconnectGoogle,
    startNotionOAuth: notionOAuth.startNotionOAuth,
    applySelectedNotionDatabase: notionData.applySelectedNotionDatabase,
  };
};
