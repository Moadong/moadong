import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '@/assets/images/icons/notification_icon.svg?react';
import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import { useTheme } from 'styled-components';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestNavigateBack, requestNotificationSubscribe } from '@/utils/webviewBridge';
import * as Styled from './MobileHeader.styles';

// 스크롤 임계값 상수
const SCROLL_THRESHOLD = {
  HEADER_VISIBLE: 0, // 헤더 배경/타이틀 표시
  TAB_STICKY: 360, // 탭바 고정
} as const;

interface TabItem {
  key: string;
  label: string;
}

interface Props {
  clubId: string;
  clubName: string;
  tabs?: TabItem[];
  activeTab?: string;
  onTabClick?: (tabKey: string) => void;
}

const MobileHeader = ({ clubId, clubName, tabs, activeTab, onTabClick }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  // TODO: 배포 시 isInAppWebView()로 복구해야 함
  const isInApp = isInAppWebView();
  const [isNotificationActive, setIsNotificationActive] = useState(false);

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
      navigate(-1);
    }
  };

  const handleNotificationClick = () => {
    // 실제 앱 통신 시도
    const success = requestNotificationSubscribe(clubId, clubName);
    
    // 성공 시 상태 변경 (웹뷰 환경이 아니면 false 반환됨)
    if (success) {
      setIsNotificationActive(true);
    }
  };

  return (
    <Styled.HeaderWrapper $isVisible={isHeaderVisible || showTabs}>
      <Styled.Header $isVisible={isHeaderVisible}>
        <Styled.IconButtonWrapper>
          <Styled.IconButton
            $isVisible={isHeaderVisible}
            onClick={handleBackClick}
            aria-label='뒤로가기'
          >
            <img src={PrevButton} alt='' />
          </Styled.IconButton>
        </Styled.IconButtonWrapper>
        <Styled.Title $isVisible={isHeaderVisible}>{clubName}</Styled.Title>
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
                fill={isNotificationActive ? theme.colors.base.white : theme.colors.gray[500]} 
              />
            </Styled.NotificationButton>
          </Styled.IconButtonWrapper>
        ) : (
          <Styled.Placeholder />
        )}
      </Styled.Header>
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
    </Styled.HeaderWrapper>
  );
};

export default MobileHeader;
