import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@/assets/images/icons/chevron_right_small.svg?react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import * as Styled from './MoreButton.styles';

interface MoreButtonProps {
  label: string;
  to: string;
  /** Mixpanel에서 어느 섹션의 더보기인지 구분하는 값 */
  section: string;
}

const MoreButton = ({ label, to, section }: MoreButtonProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleClick = () => {
    trackEvent(USER_EVENT.HOME_SECTION_MORE_CLICKED, { section, path: to });
    navigate(to);
  };

  return (
    <Styled.Button type='button' onClick={handleClick}>
      {label}
      <ChevronRightIcon aria-hidden />
    </Styled.Button>
  );
};

export default MoreButton;
