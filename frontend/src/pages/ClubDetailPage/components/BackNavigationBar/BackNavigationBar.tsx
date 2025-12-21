import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/images/icons/back_button_icon.svg';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './BackNavigationBar.styles';

const BackNavigationBar = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleBackClick = () => {
    trackEvent(USER_EVENT.BACK_BUTTON_CLICKED);
    navigate('/');
  };

  return (
    <Styled.BackNavigationContainer>
      <Styled.BackNavigationWrapper>
        <Styled.BackImage src={BackIcon} onClick={handleBackClick} />
        <Styled.NavigationText>동아리 소개</Styled.NavigationText>
      </Styled.BackNavigationWrapper>
    </Styled.BackNavigationContainer>
  );
};

export default BackNavigationBar;
