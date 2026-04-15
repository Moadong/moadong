import Button from '@/components/common/Button/Button';
import {
  buildDateKeyFromDate,
  formatDateOnly,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import * as Styled from './CalendarSyncTab.styles';
import { useCalendarSync } from './hooks/useCalendarSync';

const CalendarSyncTab = () => {
  const {
    isGoogleConnected,
    isGoogleInitialChecking,
    googleCalendars,
    selectedGoogleCalendarId,
    googleCalendarEvents,
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

  return (
    <Styled.Container>
      <Styled.ConfigGrid>
        {/* ── Google 캘린더 블록 ── */}
        <Styled.Block>
          <Styled.BlockTitle>Google 캘린더</Styled.BlockTitle>

          {isGoogleInitialChecking ? (
            /* 초기 연결 확인 중 */
            <Styled.Description>연결 상태 확인 중…</Styled.Description>
          ) : !isGoogleConnected ? (
            /* 미연결 상태 */
            <>
              <Styled.Description>
                Google 계정을 연동하여 캘린더를 가져오세요.
              </Styled.Description>
              <Styled.Buttons>
                <Button
                  width='180px'
                  onClick={startGoogleOAuth}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? '연동 중…' : 'Google 캘린더 연동하기'}
                </Button>
              </Styled.Buttons>
            </>
          ) : (
            /* 연결된 상태: 캘린더 선택 UI */
            <>
              <Styled.StatusText>
                ✅ Google 계정이 연결되었습니다.
              </Styled.StatusText>
              {googleCalendars.length > 0 && (
                <>
                  <Styled.Description>
                    동기화할 캘린더를 선택하고 적용하세요.
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
                  width='140px'
                  onClick={disconnectGoogle}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? '처리 중…' : '연결 해제'}
                </Button>
              </Styled.Buttons>
            </>
          )}
        </Styled.Block>

        {/* ── Notion 캘린더 블록 ── */}
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
        {/* ── Google 캘린더 목록 카드 ── */}
        <Styled.DataCard>
          <Styled.DataTitle>Google 캘린더 목록</Styled.DataTitle>
          {isGoogleInitialChecking ? (
            <Styled.Empty>연결 상태 확인 중…</Styled.Empty>
          ) : !isGoogleConnected ? (
            <Styled.Empty>
              아직 데이터가 없습니다. Google 캘린더 연동을 먼저 완료해주세요.
            </Styled.Empty>
          ) : googleCalendars.length === 0 ? (
            <Styled.Empty>캘린더 목록을 불러오는 중입니다…</Styled.Empty>
          ) : (
            <Styled.List>
              {googleCalendars.map((calendar) => (
                <Styled.ListItem
                  key={calendar.id}
                  style={{
                    fontWeight:
                      calendar.id === selectedGoogleCalendarId ? 700 : 400,
                    color:
                      calendar.id === selectedGoogleCalendarId
                        ? '#0f766e'
                        : undefined,
                  }}
                >
                  {calendar.id === selectedGoogleCalendarId ? '✓ ' : ''}
                  {calendar.summary || '(제목 없음)'}
                  {calendar.primary ? ' (기본 캘린더)' : ''}
                </Styled.ListItem>
              ))}
            </Styled.List>
          )}
        </Styled.DataCard>

        {/* ── 통합 캘린더 일정 카드 (Google + Notion) ── */}
        <Styled.WideDataCard>
          <Styled.DataTitle>
            통합 캘린더 일정 (Google + Notion)
          </Styled.DataTitle>
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
              아직 데이터가 없습니다. Google 캘린더 연동 또는 Notion 캘린더
              가져오기를 먼저 완료해주세요.
            </Styled.Empty>
          ) : (
            <Styled.CalendarBoard>
              {/* 구글 이벤트 토글 */}
              {googleCalendarEvents.length > 0 && (
                <Styled.TogglePanel>
                  <Styled.ToggleHeader>
                    <Styled.ToggleTitle>
                      🔵 Google 이벤트 선택
                    </Styled.ToggleTitle>
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
                    <Styled.ToggleTitle>
                      🟣 Notion 페이지 선택
                    </Styled.ToggleTitle>
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
                        {events.map((event) => (
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
