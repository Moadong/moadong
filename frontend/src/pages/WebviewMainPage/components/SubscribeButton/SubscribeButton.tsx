import SubscribeIcon from '@/assets/images/icons/subscribe_button_icon.svg?react';
import * as Styled from '../../WebviewMainPage.styles';

interface SubscribeButtonProps {
  subscribed: boolean;
  onToggle: () => void;
}

const SubscribeButton = ({ subscribed, onToggle }: SubscribeButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <Styled.SubscribeButton
      $subscribed={subscribed}
      onClick={handleClick}
      aria-label={subscribed ? '구독 취소' : '구독'}
    >
      <SubscribeIcon width={18} height={18} />
    </Styled.SubscribeButton>
  );
};

export default SubscribeButton;
