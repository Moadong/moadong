import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import useDevice from '@/hooks/useDevice';
import {
  getLastCheckedTime,
  getLatestPromotionTime,
  setLastCheckedTime,
} from '@/utils/promotionNotification';
import * as Styled from './Filter.styles';

const FILTER_OPTIONS = [
  { label: '동아리', path: '/' },
  { label: '홍보', path: '/promotions' },
] as const;

interface FilterProps {
  alwaysVisible?: boolean;
}

const Filter = ({ alwaysVisible = false }: FilterProps) => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const trackEvent = useMixpanelTrack();
  const shouldShow = alwaysVisible || isMobile;

  const { data } = useGetPromotionArticles();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const latestTime = getLatestPromotionTime(data);
    const lastChecked = getLastCheckedTime();

    if (pathname === '/promotions') {
      setLastCheckedTime(latestTime);
      setHasNotification(false);
      return;
    }

    if (lastChecked === null || latestTime > lastChecked) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }
  }, [data, pathname]);

  const handleFilterOptionClick = (path: string) => {
    trackEvent(USER_EVENT.FILTER_OPTION_CLICKED, {
      path: path,
    });

    navigate(path);
  };

  return (
    <>
      {shouldShow && (
        <Styled.FilterListContainer>
          {FILTER_OPTIONS.map((filter) => (
            <Styled.FilterButtonWrapper key={filter.path}>
              <Styled.NotificationDot
                $isVisible={hasNotification && filter.path === '/promotions'}
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
