import { useState } from 'react';
import {
  useGetHiddenCalendarEvents,
  useHideCalendarEvent,
  useUnhideCalendarEvent,
} from '@/hooks/Queries/useHiddenCalendarEvents';
import type { HiddenCalendarEvent } from '@/types/club';
import { parseDateKey } from '@/utils/calendarSyncUtils';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import type { CalendarLinkStatus } from '../CalendarLinkButton/CalendarLinkButton';
import CalendarLinkCard, {
  type CalendarLinkEvent,
} from '../CalendarLinkCard/CalendarLinkCard';
import CalendarLinkSection from '../CalendarLinkSection/CalendarLinkSection';
import DisconnectConfirmModal from '../DisconnectConfirmModal/DisconnectConfirmModal';
import * as Styled from './CalendarLinkPanel.styles';

/** 목록에 표시할 `YYYY. MM. DD` 텍스트로 변환한다 */
const formatEventDate = (value?: string) => {
  const dateKey = value ? parseDateKey(value) : null;
  if (!dateKey) return undefined;
  const [year, month, day] = dateKey.split('-');
  return `${year}. ${month}. ${day}`;
};

const resolveStatus = (
  isLoading: boolean,
  isConnected: boolean,
): CalendarLinkStatus => {
  if (isLoading) return 'loading';
  return isConnected ? 'connected' : 'idle';
};

const CalendarLinkPanel = () => {
  const {
    isGoogleConnected,
    isGoogleInitialChecking,
    isGoogleLoading,
    googleCalendarEvents,
    notionDatabaseOptions,
    notionWorkspaceName,
    notionCalendarEvents,
    isNotionLoading,
    errorMessage,
    startGoogleOAuth,
    disconnectGoogle,
    startNotionOAuth,
    disconnectNotion,
  } = useCalendarSync();

  const { data: hiddenCalendarEvents = [] } = useGetHiddenCalendarEvents();
  const hideMutation = useHideCalendarEvent();
  const unhideMutation = useUnhideCalendarEvent();

  /** 연동 해제는 되돌릴 수 없어 확인 모달을 거친다 */
  const [disconnectTarget, setDisconnectTarget] = useState<
    HiddenCalendarEvent['source'] | null
  >(null);

  const confirmDisconnect = () => {
    if (disconnectTarget === 'GOOGLE') disconnectGoogle();
    if (disconnectTarget === 'NOTION') disconnectNotion();
    setDisconnectTarget(null);
  };

  const isNotionConnected =
    notionDatabaseOptions.length > 0 || Boolean(notionWorkspaceName);

  const hiddenKeys = new Set(
    hiddenCalendarEvents.map((event) => `${event.source}:${event.eventId}`),
  );

  /** 체크 = 캘린더에 표시. 숨김 목록에 없으면 표시 상태다 */
  const toVisibleIds = (source: HiddenCalendarEvent['source'], ids: string[]) =>
    ids.filter((id) => !hiddenKeys.has(`${source}:${id}`));

  const toggleVisibility = (
    source: HiddenCalendarEvent['source'],
    eventId: string,
  ) => {
    const input = { source, eventId };
    if (hiddenKeys.has(`${source}:${eventId}`)) {
      unhideMutation.mutate(input);
      return;
    }
    hideMutation.mutate(input);
  };

  const googleEvents: CalendarLinkEvent[] = googleCalendarEvents.map(
    (event) => ({
      id: event.id,
      date: formatEventDate(event.start),
      title: event.title,
    }),
  );

  const notionEvents: CalendarLinkEvent[] = notionCalendarEvents.map(
    (event) => ({
      id: event.id,
      date: formatEventDate(event.dateKey),
      title: event.title,
    }),
  );

  const googleStatus = resolveStatus(
    isGoogleInitialChecking || isGoogleLoading,
    isGoogleConnected,
  );
  const notionStatus = resolveStatus(isNotionLoading, isNotionConnected);

  return (
    <CalendarLinkSection>
      {errorMessage && <Styled.ErrorText>{errorMessage}</Styled.ErrorText>}

      <CalendarLinkCard
        title='Google 캘린더'
        description='Google 계정을 연동하여 캘린더를 가져오세요'
        status={googleStatus}
        onButtonClick={
          isGoogleConnected
            ? () => setDisconnectTarget('GOOGLE')
            : () => startGoogleOAuth()
        }
        events={googleEvents}
        checkedEventIds={toVisibleIds(
          'GOOGLE',
          googleEvents.map((event) => event.id),
        )}
        onToggleEvent={(eventId) => toggleVisibility('GOOGLE', eventId)}
      />

      <CalendarLinkCard
        title='Notion 캘린더'
        description='Notion 계정을 연동하여 캘린더를 가져오세요'
        status={notionStatus}
        onButtonClick={
          isNotionConnected
            ? () => setDisconnectTarget('NOTION')
            : () => startNotionOAuth()
        }
        events={notionEvents}
        checkedEventIds={toVisibleIds(
          'NOTION',
          notionEvents.map((event) => event.id),
        )}
        onToggleEvent={(eventId) => toggleVisibility('NOTION', eventId)}
      />

      <DisconnectConfirmModal
        isOpen={disconnectTarget !== null}
        onClose={() => setDisconnectTarget(null)}
        onConfirm={confirmDisconnect}
      />
    </CalendarLinkSection>
  );
};

export default CalendarLinkPanel;
