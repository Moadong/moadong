import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { useGetCustomCalendarEvents } from '@/hooks/Queries/useCustomCalendarEvents';
import { useGetHiddenCalendarEvents } from '@/hooks/Queries/useHiddenCalendarEvents';
import useDevice from '@/hooks/useDevice';
import { mergeCalendarEvents } from '@/utils/mergeCalendarEvents';
import * as Styled from './CalendarSyncTab.styles';
import CalendarBoard from './components/CalendarBoard/CalendarBoard';
import { GoogleIcon, NotionIcon } from './components/ProviderIcons';
import ProviderPopover from './components/ProviderPopover/ProviderPopover';
import { useCalendarSync } from './hooks/useCalendarSync';

const CalendarSyncTab = () => {
  const {
    isGoogleConnected,
    isGoogleInitialChecking,
    googleCalendars,
    selectedGoogleCalendarId,
    googleCalendarEvents,
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
    startGoogleOAuth,
    selectGoogleCalendar,
    disconnectGoogle,
    startNotionOAuth,
    applySelectedNotionDatabase,
  } = useCalendarSync();

  const { data: customCalendarEvents = [] } = useGetCustomCalendarEvents();
  const { data: hiddenCalendarEvents = [] } = useGetHiddenCalendarEvents();
  const { isMobile, isTablet } = useDevice();
  const navigate = useNavigate();

  const isNotionConnected =
    notionDatabaseOptions.length > 0 || Boolean(notionWorkspaceName);

  const handleDisconnectGoogle = () => {
    if (window.confirm('Google 연동을 해제할까요?')) disconnectGoogle();
  };

  // Google·Notion·커스텀을 한 목록으로 합쳐 캘린더에 넘긴다
  const calendarEvents = mergeCalendarEvents({
    googleCalendarEvents,
    notionCalendarEvents,
    customCalendarEvents,
    hiddenCalendarEvents,
  });

  return (
    <Styled.Container>
      {(isMobile || isTablet) && (
        <WebviewTopBar
          title='동아리 일정 관리'
          onBack={() => navigate('/admin')}
        />
      )}

      {errorMessage && <Styled.ErrorText>{errorMessage}</Styled.ErrorText>}

      <Styled.WideDataCard>
        <Styled.CardHeader>
          {isCalendarDataLoading && (
            <Styled.SyncIndicator>
              연동 일정을 불러오는 중…
            </Styled.SyncIndicator>
          )}
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

        <CalendarBoard events={calendarEvents} />
      </Styled.WideDataCard>
    </Styled.Container>
  );
};

export default CalendarSyncTab;
