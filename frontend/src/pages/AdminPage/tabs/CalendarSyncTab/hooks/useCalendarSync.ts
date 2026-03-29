import { useCallback, useState } from 'react';
import { useGoogleCalendarData } from './useGoogleCalendarData';
import { useNotionCalendarData } from './useNotionCalendarData';
import { useNotionCalendarUiState } from './useNotionCalendarUiState';
import { useNotionOAuth } from './useNotionOAuth';

export const useCalendarSync = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notionWorkspaceName, setNotionWorkspaceName] = useState('');

  const clearError = useCallback(() => setErrorMessage(''), []);

  const google = useGoogleCalendarData({
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

  const notionOAuth = useNotionOAuth({
    loadNotionPages: notionData.loadNotionPages,
    onWorkspaceName: setNotionWorkspaceName,
    onError: setErrorMessage,
    onStatus: setStatusMessage,
    clearError,
  });

  return {
    googleToken: google.googleToken,
    googleCalendars: google.googleCalendars,
    googleEvents: google.googleEvents,
    notionItems: notionData.notionItems,
    notionTotalResults: notionData.notionTotalResults,
    notionDatabaseSourceId: notionData.notionDatabaseSourceId,
    notionDatabaseOptions: notionData.notionDatabaseOptions,
    selectedNotionDatabaseId: notionData.selectedNotionDatabaseId,
    setSelectedNotionDatabaseId: notionData.setSelectedNotionDatabaseId,
    isNotionDatabaseApplying: notionData.isNotionDatabaseApplying,
    statusMessage,
    errorMessage,
    isGoogleLoading: google.isGoogleLoading,
    isNotionLoading:
      notionData.isNotionLoading ||
      notionOAuth.isNotionOAuthLoading ||
      notionData.isNotionDatabaseApplying,
    notionWorkspaceName,
    canStartGoogleOAuth: google.canStartGoogleOAuth,
    notionCalendarEvents: notionUi.notionCalendarEvents,
    notionVisibleCalendarEvents: notionUi.notionVisibleCalendarEvents,
    notionEventsByDate: notionUi.notionEventsByDate,
    notionEventEnabledMap: notionUi.notionEventEnabledMap,
    notionCalendarDays: notionUi.notionCalendarDays,
    notionCalendarLabel: notionUi.notionCalendarLabel,
    visibleMonth: notionUi.visibleMonth,
    startGoogleOAuth: google.startGoogleOAuth,
    startNotionOAuth: notionOAuth.startNotionOAuth,
    goToPreviousMonth: notionUi.goToPreviousMonth,
    goToNextMonth: notionUi.goToNextMonth,
    toggleNotionEvent: notionUi.toggleNotionEvent,
    setAllNotionEventsEnabled: notionUi.setAllNotionEventsEnabled,
    applySelectedNotionDatabase: notionData.applySelectedNotionDatabase,
  };
};
