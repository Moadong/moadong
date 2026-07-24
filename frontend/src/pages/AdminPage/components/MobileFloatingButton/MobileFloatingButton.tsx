import * as Styled from './MobileFloatingButton.styles';

interface MobileFloatingButtonProps {
  onClick: () => void;
  icon: string;
  ariaLabel?: string;
  /** CSS 값. 기본값: calc(24px + env(safe-area-inset-bottom)) */
  bottom?: string;
}

const MobileFloatingButton = ({
  onClick,
  icon,
  ariaLabel,
  bottom = 'calc(24px + env(safe-area-inset-bottom))',
}: MobileFloatingButtonProps) => {
  return (
    <Styled.Button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      $bottom={bottom}
    >
      <img src={icon} alt='' width={20} height={20} />
    </Styled.Button>
  );
};

export default MobileFloatingButton;
