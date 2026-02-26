import { useLocation, useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useDevice from '@/hooks/useDevice';
import * as Styled from './Filter.styles';

const FILTER_OPTIONS = [
  { label: '동아리', path: '/' },
  { label: '동소한', path: '/festival-introduction' },
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
            <Styled.FilterButton
              key={filter.path}
              $isActive={pathname === filter.path}
              onClick={() => handleFilterOptionClick(filter.path)}
            >
              {filter.label}
            </Styled.FilterButton>
          ))}
        </Styled.FilterListContainer>
      )}
    </>
  );
};

export default Filter;
