import { useNavigate } from 'react-router-dom';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { requestNavigateBack } from '@/utils/webviewBridge';
import * as Styled from './WebviewTopBar.styles';

interface Props {
  title: string;
  onBack?: () => void;
}

const WebviewTopBar = ({ title, onBack }: Props) => {
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
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <Styled.Container>
      <Styled.BackButton onClick={handleBackClick} aria-label='뒤로가기'>
        <PrevButtonIcon width={36} height={36} />
      </Styled.BackButton>
      <Styled.Title>{title}</Styled.Title>
    </Styled.Container>
  );
};

export default WebviewTopBar;
