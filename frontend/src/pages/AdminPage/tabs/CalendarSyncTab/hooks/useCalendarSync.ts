import { useCallback, useState } from 'react';
import { useGoogleCalendarData } from './useGoogleCalendarData';
import { useNotionCalendarData } from './useNotionCalendarData';
import { useNotionCalendarUiState } from './useNotionCalendarUiState';
import { useNotionOAuth } from './useNotionOAuth';
import { useUnifiedCalendarUiState } from './useUnifiedCalendarUiState';

export const useCalendarSync = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notionWorkspaceName, setNotionWorkspaceName] = useState('');

  const clearError = useCallback(() => setErrorMessage(''), []);

  const googleData = useGoogleCalendarData({
    onError: setErrorMessage,
    onStatus: setStatusMessage,
    clearError,
  });

  const notionData = useNotionCalendarData({
    onError: setErrorMessage,
    onStatus: setStatusMessage,
    clearError,
  });

  const notionUi = useNotionCalendarUiState({
    notionItems: notionData.notionItems,
  });

  const unifiedCalendar = useUnifiedCalendarUiState({
    notionCalendarEvents: notionUi.notionCalendarEvents,
    googleCalendarEvents: googleData.googleCalendarEvents,
  });

  const notionOAuth = useNotionOAuth({
    loadNotionPages: notionData.loadNotionPages,
    onWorkspaceName: setNotionWorkspaceName,
    onError: setErrorMessage,
    onStatus: setStatusMessage,
    clearError,
  });

  return {
    isGoogleConnected: googleData.isGoogleConnected,
    isGoogleInitialChecking: googleData.isInitialChecking,
    googleCalendars: googleData.googleCalendars,
    selectedGoogleCalendarId: googleData.selectedCalendarId,
    googleCalendarEvents: googleData.googleCalendarEvents,
    notionItems: notionData.notionItems,
    notionTotalResults: notionData.notionTotalResults,
    notionDatabaseSourceId: notionData.notionDatabaseSourceId,
    notionDatabaseOptions: notionData.notionDatabaseOptions,
    selectedNotionDatabaseId: notionData.selectedNotionDatabaseId,
    setSelectedNotionDatabaseId: notionData.setSelectedNotionDatabaseId,
    isNotionDatabaseApplying: notionData.isNotionDatabaseApplying,
    statusMessage,
    errorMessage,
    isGoogleLoading: googleData.isGoogleLoading,
    isNotionLoading:
      notionData.isNotionLoading ||
      notionOAuth.isNotionOAuthLoading ||
      notionData.isNotionDatabaseApplying,
    notionWorkspaceName,
    // 노션 전용 UI (기존 호환성 유지)
    notionCalendarEvents: notionUi.notionCalendarEvents,
    notionVisibleCalendarEvents: notionUi.notionVisibleCalendarEvents,
    notionEventsByDate: notionUi.notionEventsByDate,
    notionEventEnabledMap: notionUi.notionEventEnabledMap,
    notionCalendarDays: notionUi.notionCalendarDays,
    notionCalendarLabel: notionUi.notionCalendarLabel,
    visibleMonth: notionUi.visibleMonth,
    // 통합 캘린더 UI (구글 + 노션)
    allUnifiedEvents: unifiedCalendar.allUnifiedEvents,
    visibleUnifiedEvents: unifiedCalendar.visibleUnifiedEvents,
    unifiedEventsByDate: unifiedCalendar.eventsByDate,
    unifiedCalendarDays: unifiedCalendar.calendarDays,
    unifiedCalendarLabel: unifiedCalendar.calendarLabel,
    unifiedVisibleMonth: unifiedCalendar.visibleMonth,
    googleEventEnabledMap: unifiedCalendar.googleEventEnabledMap,
    // 액션
    startGoogleOAuth: googleData.startGoogleOAuth,
    selectGoogleCalendar: googleData.selectCalendar,
    disconnectGoogle: googleData.disconnectGoogle,
    startNotionOAuth: notionOAuth.startNotionOAuth,
    goToPreviousMonth: unifiedCalendar.goToPreviousMonth,
    goToNextMonth: unifiedCalendar.goToNextMonth,
    toggleNotionEvent: unifiedCalendar.toggleNotionEvent,
    toggleGoogleEvent: unifiedCalendar.toggleGoogleEvent,
    setAllNotionEventsEnabled: unifiedCalendar.setAllNotionEventsEnabled,
    setAllGoogleEventsEnabled: unifiedCalendar.setAllGoogleEventsEnabled,
    applySelectedNotionDatabase: notionData.applySelectedNotionDatabase,
  };
};
