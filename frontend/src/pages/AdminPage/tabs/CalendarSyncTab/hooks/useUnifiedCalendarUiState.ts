import { useEffect, useMemo, useRef, useState } from 'react';
import type { GoogleCalendarEvent } from '@/apis/calendarOAuth';
import type { ClubCalendarEvent, HiddenCalendarEvent } from '@/types/club';
import {
  buildMonthCalendarDays,
  convertCustomEventToUnified,
  convertGoogleEventToUnified,
  convertNotionEventToUnified,
  dateFromKey,
  formatMonthLabel,
  NotionCalendarEvent,
  UnifiedCalendarEvent,
} from '@/utils/calendarSyncUtils';

interface UseUnifiedCalendarUiStateParams {
  notionCalendarEvents: NotionCalendarEvent[];
  googleCalendarEvents: GoogleCalendarEvent[];
  customCalendarEvents: ClubCalendarEvent[];
  hiddenCalendarEvents: HiddenCalendarEvent[];
}

export const useUnifiedCalendarUiState = ({
  notionCalendarEvents,
  googleCalendarEvents,
  customCalendarEvents,
  hiddenCalendarEvents,
}: UseUnifiedCalendarUiStateParams) => {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [notionEventEnabledMap, setNotionEventEnabledMap] = useState<
    Record<string, boolean>
  >({});
  const [googleEventEnabledMap, setGoogleEventEnabledMap] = useState<
    Record<string, boolean>
  >({});
  const didInitVisibleMonthRef = useRef(false);

  const unifiedNotionEvents = useMemo(
    () => notionCalendarEvents.map(convertNotionEventToUnified),
    [notionCalendarEvents],
  );

  const unifiedGoogleEvents = useMemo(
    () =>
      googleCalendarEvents
        .map(convertGoogleEventToUnified)
        .filter((event): event is UnifiedCalendarEvent => event !== null),
    [googleCalendarEvents],
  );

  const unifiedCustomEvents = useMemo(
    () =>
      customCalendarEvents
        .map(convertCustomEventToUnified)
        .filter((event): event is UnifiedCalendarEvent => event !== null),
    [customCalendarEvents],
  );

  const allUnifiedEvents = useMemo(
    () =>
      [
        ...unifiedNotionEvents,
        ...unifiedGoogleEvents,
        ...unifiedCustomEvents,
      ].sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
    [unifiedNotionEvents, unifiedGoogleEvents, unifiedCustomEvents],
  );

  const hiddenKeySet = useMemo(
    () =>
      new Set(
        hiddenCalendarEvents.map((event) => `${event.source}:${event.eventId}`),
      ),
    [hiddenCalendarEvents],
  );

  const visibleUnifiedEvents = useMemo(() => {
    return allUnifiedEvents.filter((event) => {
      if (event.source === 'NOTION') {
        const notionId = event.id.replace('notion-', '');
        if (hiddenKeySet.has(`NOTION:${notionId}`)) return false;
        return notionEventEnabledMap[notionId] !== false;
      }
      if (event.source === 'GOOGLE') {
        const googleId = event.id.replace('google-', '');
        if (hiddenKeySet.has(`GOOGLE:${googleId}`)) return false;
        return googleEventEnabledMap[googleId] !== false;
      }
      return true;
    });
  }, [allUnifiedEvents, notionEventEnabledMap, googleEventEnabledMap, hiddenKeySet]);

  const eventsByDate = useMemo(
    () =>
      visibleUnifiedEvents.reduce<Record<string, UnifiedCalendarEvent[]>>(
        (accumulator, event) => {
          if (!accumulator[event.dateKey]) {
            accumulator[event.dateKey] = [];
          }
          accumulator[event.dateKey].push(event);
          return accumulator;
        },
        {},
      ),
    [visibleUnifiedEvents],
  );

  const calendarDays = useMemo(
    () => buildMonthCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const calendarLabel = useMemo(
    () => formatMonthLabel(visibleMonth),
    [visibleMonth],
  );

  useEffect(() => {
    if (allUnifiedEvents.length === 0 || didInitVisibleMonthRef.current) return;

    const lastEventDate = dateFromKey(
      allUnifiedEvents[allUnifiedEvents.length - 1].dateKey,
    );
    setVisibleMonth(
      new Date(lastEventDate.getFullYear(), lastEventDate.getMonth(), 1),
    );
    didInitVisibleMonthRef.current = true;
  }, [allUnifiedEvents]);

  useEffect(() => {
    setNotionEventEnabledMap((previous) => {
      const next: Record<string, boolean> = {};
      notionCalendarEvents.forEach((event) => {
        next[event.id] = previous[event.id] ?? true;
      });
      return next;
    });
  }, [notionCalendarEvents]);

  useEffect(() => {
    setGoogleEventEnabledMap((previous) => {
      const next: Record<string, boolean> = {};
      googleCalendarEvents.forEach((event) => {
        next[event.id] = previous[event.id] ?? true;
      });
      return next;
    });
  }, [googleCalendarEvents]);

  const goToPreviousMonth = () => {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
    );
  };

  const toggleNotionEvent = (id: string) => {
    setNotionEventEnabledMap((previous) => ({
      ...previous,
      [id]: !(previous[id] ?? true),
    }));
  };

  const toggleGoogleEvent = (id: string) => {
    setGoogleEventEnabledMap((previous) => ({
      ...previous,
      [id]: !(previous[id] ?? true),
    }));
  };

  const setAllNotionEventsEnabled = (enabled: boolean) => {
    setNotionEventEnabledMap((previous) => {
      const next = { ...previous };
      notionCalendarEvents.forEach((event) => {
        next[event.id] = enabled;
      });
      return next;
    });
  };

  const setAllGoogleEventsEnabled = (enabled: boolean) => {
    setGoogleEventEnabledMap((previous) => {
      const next = { ...previous };
      googleCalendarEvents.forEach((event) => {
        next[event.id] = enabled;
      });
      return next;
    });
  };

  return {
    visibleMonth,
    allUnifiedEvents,
    visibleUnifiedEvents,
    eventsByDate,
    notionEventEnabledMap,
    googleEventEnabledMap,
    calendarDays,
    calendarLabel,
    goToPreviousMonth,
    goToNextMonth,
    toggleNotionEvent,
    toggleGoogleEvent,
    setAllNotionEventsEnabled,
    setAllGoogleEventsEnabled,
  };
};
