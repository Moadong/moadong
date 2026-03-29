import Button from '@/components/common/Button/Button';
import {
  buildDateKeyFromDate,
  formatDateText,
  maskToken,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import * as Styled from './CalendarSyncTab.styles';
import { useCalendarSync } from './hooks/useCalendarSync';

const CalendarSyncTab = () => {
  const {
    googleToken,
    googleCalendars,
    googleEvents,
    notionItems,
    notionTotalResults,
    notionDatabaseSourceId,
    notionDatabaseOptions,
    selectedNotionDatabaseId,
    setSelectedNotionDatabaseId,
    isNotionDatabaseApplying,
    statusMessage,
    errorMessage,
    isGoogleLoading,
    isNotionLoading,
    notionWorkspaceName,
    canStartGoogleOAuth,
    notionCalendarEvents,
    notionVisibleCalendarEvents,
    notionEventsByDate,
    notionEventEnabledMap,
    notionCalendarDays,
    notionCalendarLabel,
    visibleMonth,
    startGoogleOAuth,
    startNotionOAuth,
    goToPreviousMonth,
    goToNextMonth,
    toggleNotionEvent,
    setAllNotionEventsEnabled,
    applySelectedNotionDatabase,
  } = useCalendarSync();

  return (
    <Styled.Container>
      <Styled.ConfigGrid>
        <Styled.Block>
          <Styled.BlockTitle>Google 캘린더</Styled.BlockTitle>
          <Styled.Buttons>
            <Button
              width='180px'
              onClick={startGoogleOAuth}
              disabled={!canStartGoogleOAuth || isGoogleLoading}
            >
              Google 캘린더 가져오기
            </Button>
          </Styled.Buttons>
          {googleToken && (
            <Styled.TokenText>{maskToken(googleToken)}</Styled.TokenText>
          )}
        </Styled.Block>

        <Styled.Block>
          <Styled.BlockTitle>Notion 캘린더</Styled.BlockTitle>
          <Styled.Description>
            연결할 데이터베이스를 선택하고 적용하세요.
          </Styled.Description>
          <Styled.SelectRow>
            <Styled.Select
              value={selectedNotionDatabaseId}
              onChange={(e) => setSelectedNotionDatabaseId(e.target.value)}
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
              width='120px'
              onClick={applySelectedNotionDatabase}
              disabled={!selectedNotionDatabaseId || isNotionDatabaseApplying}
            >
              DB 적용
            </Button>
          </Styled.SelectRow>
          <Styled.Buttons>
            <Button
              width='180px'
              onClick={startNotionOAuth}
              disabled={isNotionLoading}
            >
              Notion 캘린더 가져오기
            </Button>
          </Styled.Buttons>
          {notionWorkspaceName && (
            <Styled.StatusText>
              연결된 워크스페이스: {notionWorkspaceName}
            </Styled.StatusText>
          )}
        </Styled.Block>
      </Styled.ConfigGrid>

      {statusMessage && <Styled.StatusText>{statusMessage}</Styled.StatusText>}
      {errorMessage && <Styled.ErrorText>{errorMessage}</Styled.ErrorText>}

      <Styled.DataGrid>
        <Styled.DataCard>
          <Styled.DataTitle>Google 캘린더 목록</Styled.DataTitle>
          {googleCalendars.length === 0 ? (
            <Styled.Empty>
              아직 데이터가 없습니다. Google 캘린더 가져오기를 먼저
              완료해주세요.
            </Styled.Empty>
          ) : (
            <Styled.List>
              {googleCalendars.map((calendar) => (
                <Styled.ListItem key={calendar.id}>
                  {calendar.summary || '(제목 없음)'}
                  {calendar.primary ? ' (기본 캘린더)' : ''}
                </Styled.ListItem>
              ))}
            </Styled.List>
          )}
        </Styled.DataCard>

        <Styled.DataCard>
          <Styled.DataTitle>Google 캘린더 이벤트</Styled.DataTitle>
          {googleEvents.length === 0 ? (
            <Styled.Empty>
              이벤트가 없거나 아직 조회되지 않았습니다.
            </Styled.Empty>
          ) : (
            <Styled.List>
              {googleEvents.map((event) => (
                <Styled.ListItem key={event.id}>
                  {event.summary || '(제목 없음)'} | 시작:{' '}
                  {formatDateText(event.start?.dateTime ?? event.start?.date)}
                  {event.htmlLink && (
                    <>
                      {' '}
                      |{' '}
                      <Styled.ExternalLink
                        href={event.htmlLink}
                        target='_blank'
                        rel='noreferrer'
                      >
                        열기
                      </Styled.ExternalLink>
                    </>
                  )}
                </Styled.ListItem>
              ))}
            </Styled.List>
          )}
        </Styled.DataCard>

        <Styled.WideDataCard>
          <Styled.DataTitle>Notion 캘린더 일정</Styled.DataTitle>
          <Styled.Description>
            전체 {notionTotalResults}개 / 캘린더 표시{' '}
            {notionVisibleCalendarEvents.length}개
          </Styled.Description>
          {notionDatabaseSourceId && (
            <Styled.Description>
              데이터베이스: {notionDatabaseSourceId}
            </Styled.Description>
          )}
          {notionItems.length === 0 ? (
            <Styled.Empty>
              아직 데이터가 없습니다. Notion 캘린더 가져오기를 먼저
              완료해주세요.
            </Styled.Empty>
          ) : notionCalendarEvents.length === 0 ? (
            <Styled.Empty>
              날짜 속성이 있는 Notion 페이지가 없습니다. (예: 날짜/Date 타입
              속성)
            </Styled.Empty>
          ) : (
            <Styled.CalendarBoard>
              <Styled.TogglePanel>
                <Styled.ToggleHeader>
                  <Styled.ToggleTitle>표시할 페이지 선택</Styled.ToggleTitle>
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
                        {event.title} ({event.dateKey})
                      </Styled.ToggleText>
                    </Styled.ToggleItem>
                  ))}
                </Styled.ToggleList>
              </Styled.TogglePanel>
              <Styled.CalendarHeader>
                <Button width='96px' onClick={goToPreviousMonth}>
                  이전 달
                </Button>
                <Styled.CalendarMonth>
                  {notionCalendarLabel}
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
                {notionCalendarDays.map((day) => {
                  const dateKey = buildDateKeyFromDate(day);
                  const events = notionEventsByDate[dateKey] ?? [];
                  const isOutsideMonth =
                    day.getMonth() !== visibleMonth.getMonth() ||
                    day.getFullYear() !== visibleMonth.getFullYear();

                  return (
                    <Styled.CalendarCell key={dateKey} $muted={isOutsideMonth}>
                      <Styled.CalendarDayNumber>
                        {day.getDate()}
                      </Styled.CalendarDayNumber>
                      <Styled.CalendarEventList>
                        {events.map((event) => (
                          <Styled.CalendarEvent key={event.id}>
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
                          </Styled.CalendarEvent>
                        ))}
                      </Styled.CalendarEventList>
                    </Styled.CalendarCell>
                  );
                })}
              </Styled.CalendarGrid>
            </Styled.CalendarBoard>
          )}
        </Styled.WideDataCard>
      </Styled.DataGrid>
    </Styled.Container>
  );
};

export default CalendarSyncTab;
