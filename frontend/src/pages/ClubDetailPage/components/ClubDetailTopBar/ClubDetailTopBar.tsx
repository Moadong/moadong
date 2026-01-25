import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '@/assets/images/icons/notification_icon.svg?react';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import { useTheme } from 'styled-components';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestNavigateBack, requestNotificationSubscribe, requestNotificationUnsubscribe } from '@/utils/webviewBridge';
import * as Styled from './ClubDetailTopBar.styles';

// 스크롤 임계값 상수
const SCROLL_THRESHOLD = {
  HEADER_VISIBLE: 0, // 헤더 배경/타이틀 표시
  TAB_STICKY: 360, // 탭바 고정
} as const;

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
}

const ClubDetailTopBar = ({
  clubId,
  clubName,
  tabs,
  activeTab,
  onTabClick,
  initialIsSubscribed = false,
}: ClubDetailTopBarProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isInApp = isInAppWebView();
  const [isNotificationActive, setIsNotificationActive] = useState(initialIsSubscribed);

  // 스크롤 위치에 따른 상태 관리
  const { isTriggered: isHeaderVisible } = useScrollTrigger({
    threshold: SCROLL_THRESHOLD.HEADER_VISIBLE,
    direction: 'down',
  });

  const { isTriggered: showTabs } = useScrollTrigger({
    threshold: SCROLL_THRESHOLD.TAB_STICKY,
    direction: 'down',
  });

  const handleBackClick = () => {
    // 앱 웹뷰면 앱에 뒤로가기 요청, 아니면 웹 네비게이션
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
    if (isNotificationActive) {
      const success = requestNotificationUnsubscribe(clubId);
      if (success) {
        setIsNotificationActive(false);
      }
    } else {
      const success = requestNotificationSubscribe(clubId, clubName);
      if (success) {
        setIsNotificationActive(true);
      }
    }
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
        <Styled.ClubName $isVisible={isHeaderVisible}>{clubName}</Styled.ClubName>
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
                fill={isNotificationActive ? theme.colors.primary[900] : theme.colors.gray[500]} 
              />
            </Styled.NotificationButton>
          </Styled.IconButtonWrapper>
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
