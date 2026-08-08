import { useNavigate } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGetCustomCalendarEvents } from '@/hooks/Queries/useCustomCalendarEvents';
import { useGetHiddenCalendarEvents } from '@/hooks/Queries/useHiddenCalendarEvents';
import useDevice from '@/hooks/useDevice';
import { mergeCalendarEvents } from '@/utils/mergeCalendarEvents';
import * as Styled from './CalendarSyncTab.styles';
import CalendarBoard from './components/CalendarBoard/CalendarBoard';
import { useCalendarSync } from './hooks/useCalendarSync';

const CalendarSyncTab = () => {
  const {
    googleCalendarEvents,
    errorMessage,
    isCalendarDataLoading,
    notionCalendarEvents,
  } = useCalendarSync();

  const { data: customCalendarEvents = [] } = useGetCustomCalendarEvents();
  const { data: hiddenCalendarEvents = [] } = useGetHiddenCalendarEvents();
  const { isMobile, isTablet } = useDevice();
  const navigate = useNavigate();

  useTrackPageView(PAGE_VIEW.ADMIN_CALENDAR_PAGE);

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
        </Styled.CardHeader>

        <CalendarBoard events={calendarEvents} />
      </Styled.WideDataCard>
    </Styled.Container>
  );
};

export default CalendarSyncTab;
