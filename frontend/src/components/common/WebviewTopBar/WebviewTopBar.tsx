import { useNavigate } from 'react-router-dom';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { requestNavigateBack } from '@/utils/webviewBridge';
import * as Styled from './WebviewTopBar.styles';

interface WebviewTopBarProps {
  title: string;
  onBack?: () => void;
  /** 앱이 처리하지 않고 이전 화면도 없을 때 보낼 경로. 공유 링크로 상세에 바로 들어온 경우 등 */
  fallbackPath?: string;
}

const WebviewTopBar = ({
  title,
  onBack,
  fallbackPath = '/',
}: WebviewTopBarProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleBackClick = () => {
    trackEvent(USER_EVENT.BACK_BUTTON_CLICKED);
    if (onBack) {
      onBack();
      return;
    }
    const handled = requestNavigateBack();
    if (!handled) {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate(fallbackPath, { replace: true });
      }
    }
  };

  return (
    <Styled.Container>
      <Styled.BackButton onClick={handleBackClick} aria-label='뒤로가기'>
        <PrevButtonIcon width={36} height={36} />
      </Styled.BackButton>
      <Styled.Title>{title}</Styled.Title>
      <Styled.RightSpacer />
    </Styled.Container>
  );
};

export default WebviewTopBar;
