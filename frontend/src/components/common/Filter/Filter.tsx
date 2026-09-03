import { useLocation, useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useClubListPath from '@/hooks/useClubListPath';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './Filter.styles';

interface FilterProps {
  alwaysVisible?: boolean;
  hasNotification: boolean;
}

const Filter = ({ alwaysVisible = false, hasNotification }: FilterProps) => {
  const { isMobile } = useDevice();
  const clubListPath = useClubListPath();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const trackEvent = useMixpanelTrack();

  const isWebview = isInAppWebView();
  // 개편 전에는 홈이 곧 목록이라 '동아리' 목적지가 변형에 따라 달라진다
  const filterOptions = [
    { label: '동아리', path: clubListPath },
    { label: '홍보', path: '/promotions' },
  ];
  const shouldShow = alwaysVisible || isMobile || isWebview;

  const handleFilterOptionClick = (path: string) => {
    trackEvent(USER_EVENT.FILTER_OPTION_CLICKED, { path });
    navigate(path);
  };

  return (
    <>
      {shouldShow && (
        <Styled.FilterListContainer>
          {filterOptions.map((filter) => (
            <Styled.FilterButtonWrapper key={filter.path}>
              <Styled.NotificationDot
                $isVisible={hasNotification && filter.label === '홍보'}
              />
              <Styled.FilterButton
                $isActive={pathname === filter.path}
                onClick={() => handleFilterOptionClick(filter.path)}
              >
                {filter.label}
              </Styled.FilterButton>
            </Styled.FilterButtonWrapper>
          ))}
        </Styled.FilterListContainer>
      )}
    </>
  );
};

export default Filter;
