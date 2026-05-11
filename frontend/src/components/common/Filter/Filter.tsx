import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useDevice from '@/hooks/useDevice';
import * as Styled from './Filter.styles';

const WEB_FILTER_OPTIONS = [
  { label: '동아리', path: '/' },
  { label: '홍보', path: '/promotions' },
  { label: '대동제', path: '/festival-busking' },
] as const;

const WEBVIEW_FILTER_OPTIONS = [
  { label: '동아리', path: '/webview/main' },
  { label: '홍보', path: '/webview/promotions' },
  { label: '대동제', path: '/webview/festival-busking' },
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

  const [daedongDotSeen, setDaedongDotSeen] = useState(
    () => sessionStorage.getItem('daedong_filter_seen') === 'true',
  );

  const isWebview = pathname.startsWith('/webview');
  const filterOptions = isWebview ? WEBVIEW_FILTER_OPTIONS : WEB_FILTER_OPTIONS;
  const shouldShow = alwaysVisible || isMobile || isWebview;

  const handleFilterOptionClick = (path: string) => {
    trackEvent(USER_EVENT.FILTER_OPTION_CLICKED, { path });
    if (path.includes('festival-busking')) {
      sessionStorage.setItem('daedong_filter_seen', 'true');
      setDaedongDotSeen(true);
    }
    navigate(path);
  };

  return (
    <>
      {shouldShow && (
        <Styled.FilterListContainer $isWebview={isWebview}>
          {filterOptions.map((filter) => (
            <Styled.FilterButtonWrapper key={filter.path}>
              <Styled.NotificationDot
                $isVisible={
                  (hasNotification && filter.label === '홍보') ||
                  (filter.label === '대동제' && !daedongDotSeen)
                }
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
