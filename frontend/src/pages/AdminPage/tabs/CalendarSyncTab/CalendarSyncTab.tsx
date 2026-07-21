import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Spinner from '@/components/common/Spinner/Spinner';
import { useDeleteCustomCalendarEvent } from '@/hooks/Queries/useCustomCalendarEvents';
import { useHideCalendarEvent } from '@/hooks/Queries/useHiddenCalendarEvents';
import type { CustomCalendarEventInput } from '@/types/club';
import {
  buildDateKeyFromDate,
  formatDateOnly,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import * as Styled from './CalendarSyncTab.styles';
import CustomEventModal from './components/CustomEventModal/CustomEventModal';
import { GoogleIcon, NotionIcon } from './components/ProviderIcons';
import ProviderPopover from './components/ProviderPopover/ProviderPopover';
import { useCalendarSync } from './hooks/useCalendarSync';

interface CustomModalState {
  mode: 'create' | 'edit';
  eventId?: string;
  initialValues: CustomCalendarEventInput;
}

const CalendarSyncTab = () => {
  const {
    isGoogleConnected,
    isGoogleInitialChecking,
    googleCalendars,
    selectedGoogleCalendarId,
    googleCalendarEvents,
    notionItems,
    notionTotalResults,
    notionDatabaseSourceId,
    notionDatabaseOptions,
    selectedNotionDatabaseId,
    setSelectedNotionDatabaseId,
    isNotionDatabaseApplying,
    errorMessage,
    isCalendarDataLoading,
    isGoogleLoading,
    isNotionLoading,
    notionWorkspaceName,
    notionCalendarEvents,
    allUnifiedEvents,
    visibleUnifiedEvents,
    unifiedEventsByDate,
    unifiedCalendarDays,
    unifiedCalendarLabel,
    unifiedVisibleMonth,
    notionEventEnabledMap,
    googleEventEnabledMap,
    startGoogleOAuth,
    selectGoogleCalendar,
    disconnectGoogle,
    startNotionOAuth,
    goToPreviousMonth,
    goToNextMonth,
    toggleNotionEvent,
    toggleGoogleEvent,
    setAllNotionEventsEnabled,
    setAllGoogleEventsEnabled,
    applySelectedNotionDatabase,
  } = useCalendarSync();

  const [customModal, setCustomModal] = useState<CustomModalState | null>(null);
  const deleteCustomMutation = useDeleteCustomCalendarEvent();
  const hideMutation = useHideCalendarEvent();

  const isNotionConnected =
    notionDatabaseOptions.length > 0 || Boolean(notionWorkspaceName);

  const handleDisconnectGoogle = () => {
    if (window.confirm('Google 연동을 해제할까요?')) disconnectGoogle();
  };

  const removeCustomEvent = (unifiedId: string) => {
    if (deleteCustomMutation.isPending) return;
    if (!window.confirm('이 일정을 삭제할까요?')) return;
    deleteCustomMutation.mutate(unifiedId.replace('custom-', ''), {
      onError: () => window.alert('일정 삭제에 실패했습니다.'),
    });
  };

  const hideOAuthEvent = (
    source: 'GOOGLE' | 'NOTION' | 'CUSTOM',
    unifiedId: string,
  ) => {
    if (source === 'CUSTOM' || hideMutation.isPending) return;
    hideMutation.mutate(
      {
        source,
        eventId: unifiedId.replace(/^(google|notion)-/, ''),
      },
      {
        onError: () => window.alert('일정 숨기기에 실패했습니다.'),
      },
    );
  };

  const openCreateCustomEvent = (dateKey: string) =>
    setCustomModal({
      mode: 'create',
      initialValues: {
        title: '',
        start: dateKey,
        end: '',
        url: '',
        description: '',
      },
    });

  const openEditCustomEvent = (event: {
    id: string;
    title: string;
    start: string;
    end?: string;
    url?: string;
    description?: string;
  }) =>
    setCustomModal({
      mode: 'edit',
      eventId: event.id.replace('custom-', ''),
      initialValues: {
        title: event.title,
        start: event.start,
        end: event.end ?? '',
        url: event.url ?? '',
        description: event.description ?? '',
      },
    });

  return (
    <Styled.Container>
      {isCalendarDataLoading && (
        <Styled.LoadingOverlay>
          <Spinner height='auto' />
          <Styled.LoadingText>캘린더 정보를 불러오는 중...</Styled.LoadingText>
        </Styled.LoadingOverlay>
      )}

      {errorMessage && <Styled.ErrorText>{errorMessage}</Styled.ErrorText>}

      <Styled.WideDataCard>
        <Styled.CardHeader>
          <Styled.DataTitle>통합 캘린더</Styled.DataTitle>
          <Styled.ProviderControls>
            <ProviderPopover
              label='Google 캘린더 설정'
              connected={isGoogleConnected}
              icon={<GoogleIcon />}
              onDisconnect={handleDisconnectGoogle}
            >
              {isGoogleInitialChecking ? (
                <Styled.Description>연결 상태 확인 중…</Styled.Description>
              ) : !isGoogleConnected ? (
                <>
                  <Styled.Description>
                    Google 계정을 연동하여 캘린더를 가져오세요.
                  </Styled.Description>
                  <Styled.Buttons>
                    <Button
                      width='auto'
                      onClick={startGoogleOAuth}
                      disabled={isGoogleLoading}
                    >
                      {isGoogleLoading ? '연동 중…' : 'Google 연동하기'}
                    </Button>
                  </Styled.Buttons>
                </>
              ) : (
                <>
                  <Styled.StatusText>
                    ✅ Google 계정이 연결되었습니다.
                  </Styled.StatusText>
                  {googleCalendars.length > 0 && (
                    <>
                      <Styled.Description>
                        동기화할 캘린더를 선택하세요.
                      </Styled.Description>
                      <Styled.SelectRow>
                        <Styled.Select
                          value={selectedGoogleCalendarId}
                          onChange={(e) => selectGoogleCalendar(e.target.value)}
                          disabled={isGoogleLoading}
                        >
                          {googleCalendars.map((calendar) => (
                            <option key={calendar.id} value={calendar.id}>
                              {calendar.summary || '(제목 없음)'}
                              {calendar.primary ? ' (기본 캘린더)' : ''}
                            </option>
                          ))}
                        </Styled.Select>
                      </Styled.SelectRow>
                    </>
                  )}
                  <Styled.Buttons>
                    <Button
                      width='auto'
                      onClick={disconnectGoogle}
                      disabled={isGoogleLoading}
                    >
                      {isGoogleLoading ? '처리 중…' : '연결 해제'}
                    </Button>
                  </Styled.Buttons>
                </>
              )}
            </ProviderPopover>

            <ProviderPopover
              label='Notion 캘린더 설정'
              connected={isNotionConnected}
              icon={<NotionIcon />}
            >
              {!isNotionConnected ? (
                <>
                  <Styled.Description>
                    Notion 계정을 연동하여 데이터베이스를 가져오세요.
                  </Styled.Description>
                  <Styled.Buttons>
                    <Button
                      width='auto'
                      onClick={startNotionOAuth}
                      disabled={isNotionLoading}
                    >
                      {isNotionLoading ? '연동 중…' : 'Notion 연동하기'}
                    </Button>
                  </Styled.Buttons>
                </>
              ) : (
                <>
                  <Styled.StatusText>
                    ✅ Notion이 연결되었습니다
                    {notionWorkspaceName ? ` (${notionWorkspaceName})` : ''}.
                  </Styled.StatusText>
                  <Styled.Description>
                    동기화할 데이터베이스를 선택하고 적용하세요.
                  </Styled.Description>
                  <Styled.SelectRow>
                    <Styled.Select
                      value={selectedNotionDatabaseId}
                      onChange={(e) =>
                        setSelectedNotionDatabaseId(e.target.value)
                      }
                    >
                      {notionDatabaseOptions.length === 0 ? (
                        <option value=''>데이터베이스 없음</option>
                      ) : (
                        notionDatabaseOptions.map((database) => (
                          <option key={database.id} value={database.id}>
                            {database.title}
                          </option>
                        ))
                      )}
                    </Styled.Select>
                    <Button
                      width='auto'
                      onClick={applySelectedNotionDatabase}
                      disabled={
                        !selectedNotionDatabaseId || isNotionDatabaseApplying
                      }
                    >
                      적용
                    </Button>
                  </Styled.SelectRow>
                </>
              )}
            </ProviderPopover>
          </Styled.ProviderControls>
        </Styled.CardHeader>

        <Styled.Description>
          Google 이벤트 {googleCalendarEvents.length}개 / Notion 페이지{' '}
          {notionTotalResults}개 / 캘린더 표시 {visibleUnifiedEvents.length}개
        </Styled.Description>
        {notionDatabaseSourceId && (
          <Styled.Description>
            Notion 데이터베이스: {notionDatabaseSourceId}
          </Styled.Description>
        )}
        {allUnifiedEvents.length === 0 ? (
          <Styled.Empty>
            아직 데이터가 없습니다. 우측 상단 아이콘에서 Google 또는 Notion을
            연동해주세요.
          </Styled.Empty>
        ) : (
          <Styled.CalendarBoard>
            {/* 구글 이벤트 토글 */}
            {googleCalendarEvents.length > 0 && (
              <Styled.TogglePanel>
                <Styled.ToggleHeader>
                  <Styled.ToggleTitle>Google 이벤트 선택</Styled.ToggleTitle>
                  <Styled.ToggleActions>
                    <Styled.ToggleActionButton
                      type='button'
                      onClick={() => setAllGoogleEventsEnabled(true)}
                    >
                      전체 ON
                    </Styled.ToggleActionButton>
                    <Styled.ToggleActionButton
                      type='button'
                      onClick={() => setAllGoogleEventsEnabled(false)}
                    >
                      전체 OFF
                    </Styled.ToggleActionButton>
                  </Styled.ToggleActions>
                </Styled.ToggleHeader>
                <Styled.ToggleList>
                  {googleCalendarEvents.map((event) => (
                    <Styled.ToggleItem key={event.id}>
                      <Styled.ToggleCheckbox
                        type='checkbox'
                        checked={googleEventEnabledMap[event.id] !== false}
                        onChange={() => toggleGoogleEvent(event.id)}
                      />
                      <Styled.ToggleText>
                        {event.title} ({formatDateOnly(event.start)})
                      </Styled.ToggleText>
                    </Styled.ToggleItem>
                  ))}
                </Styled.ToggleList>
              </Styled.TogglePanel>
            )}
            {/* 노션 이벤트 토글 */}
            {notionCalendarEvents.length > 0 && (
              <Styled.TogglePanel>
                <Styled.ToggleHeader>
                  <Styled.ToggleTitle>Notion 페이지 선택</Styled.ToggleTitle>
                  <Styled.ToggleActions>
                    <Styled.ToggleActionButton
                      type='button'
                      onClick={() => setAllNotionEventsEnabled(true)}
                    >
                      전체 ON
                    </Styled.ToggleActionButton>
                    <Styled.ToggleActionButton
                      type='button'
                      onClick={() => setAllNotionEventsEnabled(false)}
                    >
                      전체 OFF
                    </Styled.ToggleActionButton>
                  </Styled.ToggleActions>
                </Styled.ToggleHeader>
                <Styled.ToggleList>
                  {notionCalendarEvents.map((event) => (
                    <Styled.ToggleItem key={event.id}>
                      <Styled.ToggleCheckbox
                        type='checkbox'
                        checked={notionEventEnabledMap[event.id] !== false}
                        onChange={() => toggleNotionEvent(event.id)}
                      />
                      <Styled.ToggleText>
                        {event.title} ({formatDateOnly(event.dateKey)})
                      </Styled.ToggleText>
                    </Styled.ToggleItem>
                  ))}
                </Styled.ToggleList>
              </Styled.TogglePanel>
            )}
            <Styled.CalendarHeader>
              <Button width='96px' onClick={goToPreviousMonth}>
                이전 달
              </Button>
              <Styled.CalendarMonth>
                {unifiedCalendarLabel}
              </Styled.CalendarMonth>
              <Button width='96px' onClick={goToNextMonth}>
                다음 달
              </Button>
            </Styled.CalendarHeader>
            <Styled.CalendarWeekRow>
              {WEEKDAY_LABELS.map((label) => (
                <Styled.CalendarWeekCell key={label}>
                  {label}
                </Styled.CalendarWeekCell>
              ))}
            </Styled.CalendarWeekRow>
            <Styled.CalendarGrid>
              {unifiedCalendarDays.map((day) => {
                const dateKey = buildDateKeyFromDate(day);
                const events = unifiedEventsByDate[dateKey] ?? [];
                const isOutsideMonth =
                  day.getMonth() !== unifiedVisibleMonth.getMonth() ||
                  day.getFullYear() !== unifiedVisibleMonth.getFullYear();

                return (
                  <Styled.CalendarCell key={dateKey} $muted={isOutsideMonth}>
                    <Styled.CalendarDayNumber>
                      {day.getDate()}
                    </Styled.CalendarDayNumber>
                    <Styled.CalendarEventList>
                      {events.map((event) =>
                        event.source === 'CUSTOM' ? (
                          <Styled.CustomEvent key={event.id}>
                            <Styled.CustomEventTitle
                              type='button'
                              onClick={() => openEditCustomEvent(event)}
                            >
                              {event.title}
                            </Styled.CustomEventTitle>
                            <Styled.CustomEventDelete
                              type='button'
                              data-remove
                              aria-label={`${event.title} 삭제`}
                              onClick={() => removeCustomEvent(event.id)}
                            >
                              ×
                            </Styled.CustomEventDelete>
                          </Styled.CustomEvent>
                        ) : (
                          <Styled.CalendarEvent
                            key={event.id}
                            $source={event.source}
                          >
                            {event.url ? (
                              <Styled.ExternalLink
                                href={event.url}
                                target='_blank'
                                rel='noreferrer'
                              >
                                {event.title}
                              </Styled.ExternalLink>
                            ) : (
                              <Styled.CalendarTitle>
                                {event.title}
                              </Styled.CalendarTitle>
                            )}
                            <Styled.OAuthEventRemove
                              type='button'
                              data-remove
                              aria-label={`${event.title} 숨기기`}
                              onClick={() =>
                                hideOAuthEvent(event.source, event.id)
                              }
                            >
                              ×
                            </Styled.OAuthEventRemove>
                          </Styled.CalendarEvent>
                        ),
                      )}
                    </Styled.CalendarEventList>
                    <Styled.AddEventButton
                      type='button'
                      data-add
                      aria-label={`${dateKey} 일정 추가`}
                      onClick={() => openCreateCustomEvent(dateKey)}
                    >
                      +
                    </Styled.AddEventButton>
                  </Styled.CalendarCell>
                );
              })}
            </Styled.CalendarGrid>
          </Styled.CalendarBoard>
        )}
      </Styled.WideDataCard>

      {customModal && (
        <CustomEventModal
          mode={customModal.mode}
          eventId={customModal.eventId}
          initialValues={customModal.initialValues}
          onClose={() => setCustomModal(null)}
        />
      )}
    </Styled.Container>
  );
};

export default CalendarSyncTab;
