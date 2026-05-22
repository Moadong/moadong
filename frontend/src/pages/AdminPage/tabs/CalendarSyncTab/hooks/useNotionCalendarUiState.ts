import { useEffect, useMemo, useRef, useState } from 'react';
import { NotionSearchItem } from '@/apis/calendarOAuth';
import {
  buildMonthCalendarDays,
  dateFromKey,
  formatMonthLabel,
  NotionCalendarEvent,
  parseNotionCalendarEvent,
} from '@/utils/calendarSyncUtils';

interface UseNotionCalendarUiStateParams {
  notionItems: NotionSearchItem[];
}

export const useNotionCalendarUiState = ({
  notionItems,
}: UseNotionCalendarUiStateParams) => {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [notionEventEnabledMap, setNotionEventEnabledMap] = useState<
    Record<string, boolean>
  >({});
  const didInitVisibleMonthRef = useRef(false);

  const notionCalendarEvents = useMemo(
    () =>
      notionItems
        .map(parseNotionCalendarEvent)
        .filter((event): event is NotionCalendarEvent => event !== null)
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
    [notionItems],
  );
  const notionVisibleCalendarEvents = useMemo(
    () =>
      notionCalendarEvents.filter(
        (event) => notionEventEnabledMap[event.id] !== false,
      ),
    [notionCalendarEvents, notionEventEnabledMap],
  );
  const notionEventsByDate = useMemo(
    () =>
      notionVisibleCalendarEvents.reduce<Record<string, NotionCalendarEvent[]>>(
        (accumulator, event) => {
          if (!accumulator[event.dateKey]) {
            accumulator[event.dateKey] = [];
          }
          accumulator[event.dateKey].push(event);
          return accumulator;
        },
        {},
      ),
    [notionVisibleCalendarEvents],
  );
  const notionCalendarDays = useMemo(
    () => buildMonthCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const notionCalendarLabel = useMemo(
    () => formatMonthLabel(visibleMonth),
    [visibleMonth],
  );

  useEffect(() => {
    if (notionCalendarEvents.length === 0 || didInitVisibleMonthRef.current)
      return;

    const firstEventDate = dateFromKey(notionCalendarEvents[0].dateKey);
    setVisibleMonth(
      new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1),
    );
    didInitVisibleMonthRef.current = true;
  }, [notionCalendarEvents]);

  useEffect(() => {
    setNotionEventEnabledMap((previous) => {
      const next: Record<string, boolean> = {};
      notionCalendarEvents.forEach((event) => {
        next[event.id] = previous[event.id] ?? true;
      });
      return next;
    });
  }, [notionCalendarEvents]);

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

  const setAllNotionEventsEnabled = (enabled: boolean) => {
    setNotionEventEnabledMap((previous) => {
      const next = { ...previous };
      notionCalendarEvents.forEach((event) => {
        next[event.id] = enabled;
      });
      return next;
    });
  };

  return {
    visibleMonth,
    notionCalendarEvents,
    notionVisibleCalendarEvents,
    notionEventsByDate,
    notionEventEnabledMap,
    notionCalendarDays,
    notionCalendarLabel,
    goToPreviousMonth,
    goToNextMonth,
    toggleNotionEvent,
    setAllNotionEventsEnabled,
  };
};
