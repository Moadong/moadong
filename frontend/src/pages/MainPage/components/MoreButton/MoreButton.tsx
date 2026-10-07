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
  /** 이동 직전에 실행할 동작 (예: 목록 필터 초기화) */
  onClick?: () => void;
}

const MoreButton = ({ label, to, section, onClick }: MoreButtonProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleClick = () => {
    trackEvent(USER_EVENT.HOME_SECTION_MORE_CLICKED, { section, path: to });
    onClick?.();
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
