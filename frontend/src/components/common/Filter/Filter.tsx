import { useLocation, useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './Filter.styles';

const WEB_FILTER_OPTIONS = [
  { label: '동아리', path: '/' },
  { label: '홍보', path: '/promotions' },
] as const;

interface FilterProps {
  alwaysVisible?: boolean;
  hasNotification: boolean;
}

const Filter = ({ alwaysVisible = false, hasNotification }: FilterProps) => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const trackEvent = useMixpanelTrack();

  const isWebview = isInAppWebView();
  const shouldShow = alwaysVisible || isMobile || isWebview;

  const handleFilterOptionClick = (path: string) => {
    trackEvent(USER_EVENT.FILTER_OPTION_CLICKED, { path });
    navigate(path);
  };

  return (
    <>
      {shouldShow && (
        <Styled.FilterListContainer $isWebview={isWebview}>
          {WEB_FILTER_OPTIONS.map((filter) => (
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
