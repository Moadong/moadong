import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { useNavigate } from 'react-router-dom';
import * as Styled from './BackNavigationBar.styles';
import BackIcon from '@/assets/images/icons/back_button_icon.svg';

const BackNavigationBar = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleBackClick = () => {
    trackEvent('Back Button Clicked');
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
