import { useNavigate } from 'react-router-dom';
import NotificationIcon from '@/assets/images/icons/notification_icon.svg';
import SearchIcon from '@/assets/images/icons/search_button_icon.svg';
import MoadongLogo from '@/assets/images/moadong_name_logo.svg';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './HomeHeader.styles';

/** 홈 전용 상단바. 검색은 동아리 목록으로, 알림 벨은 구독 목록으로 보낸다. */
const HomeHeader = () => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleSearchClick = () => {
    trackEvent(USER_EVENT.HOME_SEARCH_CLICKED);
    navigate('/clubs');
  };

  const handleSubscriptionClick = () => {
    trackEvent(USER_EVENT.HOME_SUBSCRIPTION_CLICKED);
    navigate('/subscriptions');
  };

  return (
    <Styled.Header>
      <Styled.LogoButton onClick={() => navigate('/')} aria-label='홈으로 이동'>
        <img src={MoadongLogo} alt='모아동 로고' />
      </Styled.LogoButton>
      <Styled.Actions>
        <Styled.IconButton onClick={handleSearchClick} aria-label='동아리 검색'>
          <img src={SearchIcon} alt='' aria-hidden />
        </Styled.IconButton>
        <Styled.IconButton
          onClick={handleSubscriptionClick}
          aria-label='구독한 동아리'
        >
          <img src={NotificationIcon} alt='' aria-hidden />
        </Styled.IconButton>
      </Styled.Actions>
    </Styled.Header>
  );
};

export default HomeHeader;
