import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import NotificationIcon from '@/assets/images/icons/notification_icon.svg?react';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import Spinner from '@/components/common/Spinner/Spinner';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import useOpenAppFromKakao from '@/hooks/useOpenAppFromKakao';
import isInAppWebView from '@/utils/isInAppWebView';
import isKakaoTalkBrowser from '@/utils/isKakaoTalkBrowser';
import {
  requestNavigateBack,
  requestSubscribeToggle,
  type AppToWebMessage,
} from '@/utils/webviewBridge';
import * as Styled from './ClubDetailTopBar.styles';

interface TabItem {
  key: string;
  label: string;
}

interface ClubDetailTopBarProps {
  clubId: string;
  clubName: string;
  tabs?: TabItem[];
  activeTab?: string;
  onTabClick?: (tabKey: string) => void;
  initialIsSubscribed?: boolean;
  showTabs?: boolean;
}

const ClubDetailTopBar = ({
  clubId,
  clubName,
  tabs,
  activeTab,
  onTabClick,
  initialIsSubscribed = false,
  showTabs = false,
}: ClubDetailTopBarProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isInApp = isInAppWebView();
  const isKakao = !isInApp && isKakaoTalkBrowser();
  const { openApp, isLoading } = useOpenAppFromKakao();
  const trackEvent = useMixpanelTrack();
  const [isNotificationActive, setIsNotificationActive] =
    useState(initialIsSubscribed);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data: AppToWebMessage;
      try {
        data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (data.type === 'SUBSCRIBE_STATE') {
        setIsNotificationActive(
          data.payload.subscribedClubIds.includes(clubId),
        );
      } else if (
        data.type === 'SUBSCRIBE_RESULT' &&
        data.payload.clubId === clubId
      ) {
        setIsNotificationActive(data.payload.subscribed);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [clubId]);

  const { isTriggered: isHeaderVisible } = useScrollTrigger({
    threshold: 0,
    direction: 'down',
  });

  const handleBackClick = () => {
    trackEvent(USER_EVENT.BACK_BUTTON_CLICKED);
    const handled = requestNavigateBack();
    if (!handled) {
      // 히스토리 스택이 있으면 뒤로가기, 없으면(직접 진입 등) 메인으로 이동
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  const handleNotificationClick = () => {
    requestSubscribeToggle(clubId);
  };

  return (
    <Styled.TopBarWrapper $isVisible={isHeaderVisible || showTabs}>
      <Styled.TopBarContent $isVisible={isHeaderVisible}>
        <Styled.IconButtonWrapper>
          <Styled.IconButton
            $isVisible={isHeaderVisible}
            onClick={handleBackClick}
            aria-label='뒤로가기'
          >
            <PrevButtonIcon width={30} height={30} />
          </Styled.IconButton>
        </Styled.IconButtonWrapper>
        <Styled.ClubName $isVisible={isHeaderVisible}>
          {clubName}
        </Styled.ClubName>
        {isInApp ? (
          <Styled.IconButtonWrapper>
            <Styled.NotificationButton
              $isVisible={isHeaderVisible}
              $isActive={isNotificationActive}
              onClick={handleNotificationClick}
              aria-label='알림 설정'
            >
              <NotificationIcon
                width={24}
                height={24}
                fill={
                  isNotificationActive
                    ? theme.colors.primary[900]
                    : theme.colors.gray[500]
                }
              />
            </Styled.NotificationButton>
          </Styled.IconButtonWrapper>
        ) : isKakao ? (
          <>
            {isLoading && (
              <Styled.LoadingOverlay>
                <Spinner height='auto' />
              </Styled.LoadingOverlay>
            )}
            <Styled.AppOpenButton onClick={() => openApp()}>
              앱열기
            </Styled.AppOpenButton>
          </>
        ) : (
          <Styled.Placeholder />
        )}
      </Styled.TopBarContent>
      {tabs && showTabs && (
        <Styled.TabBar>
          {tabs.map((tab) => (
            <Styled.TabButton
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => onTabClick?.(tab.key)}
            >
              {tab.label}
            </Styled.TabButton>
          ))}
        </Styled.TabBar>
      )}
    </Styled.TopBarWrapper>
  );
};

export default ClubDetailTopBar;
