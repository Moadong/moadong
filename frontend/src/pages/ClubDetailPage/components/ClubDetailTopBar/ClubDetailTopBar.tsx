import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import BackChevronIcon from '@/assets/images/icons/back_chevron_icon.svg?react';
import NotificationIcon from '@/assets/images/icons/notification_icon.svg?react';
import { FIXED_BOTTOM_BUTTON_AREA_HEIGHT } from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea.styles';
import Snackbar from '@/components/common/Snackbar/Snackbar';
import Spinner from '@/components/common/Spinner/Spinner';
import Toast from '@/components/common/Toast/Toast';
import { PAGE_NAME, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import useOpenAppFromKakao from '@/hooks/useOpenAppFromKakao';
import isInAppWebView from '@/utils/isInAppWebView';
import isKakaoTalkBrowser from '@/utils/isKakaoTalkBrowser';
import {
  requestNavigateBack,
  requestOpenAppSettings,
  requestSubscribeToggle,
  type AppToWebMessage,
} from '@/utils/webviewBridge';
import * as Styled from './ClubDetailTopBar.styles';

export const SUBSCRIBED_TOAST_MESSAGE = '구독이 완료되었어요';
export const PERMISSION_SNACKBAR_MESSAGE = '알림 권한을 켜 주세요';
export const PERMISSION_SNACKBAR_ACTION_LABEL = '설정에서 켜기';

// 상세는 하단에 지원하기 버튼이 고정돼 있어 토스트·스낵바를 그 위로 띄운다
const GAP_ABOVE_FIXED_BUTTON = 16;
const OVERLAY_BOTTOM_OFFSET = `calc(${FIXED_BOTTOM_BUTTON_AREA_HEIGHT + GAP_ABOVE_FIXED_BUTTON}px + env(safe-area-inset-bottom))`;

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
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

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
        const { subscribed, needsPermission } = data.payload;
        setIsNotificationActive(subscribed);
        // 앱이 실제로 처리한 결과에만 반응한다. 권한이 막혀 있으면 "완료"라고 말하지 않는다.
        if (needsPermission) {
          setNoticeMessage(PERMISSION_SNACKBAR_MESSAGE);
        } else {
          // 구독 해제는 알릴 게 없지만, 떠 있던 "구독 완료" 토스트는 내려야 한다
          setNoticeMessage(subscribed ? SUBSCRIBED_TOAST_MESSAGE : null);
        }
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
    trackEvent(USER_EVENT.WEBVIEW_SUBSCRIBE_TOGGLED, {
      club_id: clubId,
      subscribed: !isNotificationActive,
      source: PAGE_NAME.CLUB_DETAIL,
    });
  };

  // 권한 안내만 스낵바로 띄운다. 완료 알림은 이어지는 동작이 없어 토스트다.
  const handleOpenSettingsClick = () => {
    setNoticeMessage(null);
    requestOpenAppSettings();
  };

  return (
    <>
      <Styled.TopBarWrapper $isVisible={isHeaderVisible || showTabs}>
        <Styled.TopBarContent $isVisible={isHeaderVisible}>
          <Styled.IconButtonWrapper>
            <Styled.IconButton
              $isVisible={isHeaderVisible}
              onClick={handleBackClick}
              aria-label='뒤로가기'
            >
              <BackChevronIcon width={48} height={48} />
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
                  width={21}
                  height={21}
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
      <Toast
        isOpen={noticeMessage === SUBSCRIBED_TOAST_MESSAGE}
        onClose={() => setNoticeMessage(null)}
        message={SUBSCRIBED_TOAST_MESSAGE}
        bottomOffset={OVERLAY_BOTTOM_OFFSET}
      />
      <Snackbar
        isOpen={noticeMessage === PERMISSION_SNACKBAR_MESSAGE}
        onClose={() => setNoticeMessage(null)}
        message={PERMISSION_SNACKBAR_MESSAGE}
        action={{
          label: PERMISSION_SNACKBAR_ACTION_LABEL,
          onClick: handleOpenSettingsClick,
        }}
        bottomOffset={OVERLAY_BOTTOM_OFFSET}
      />
    </>
  );
};

export default ClubDetailTopBar;
