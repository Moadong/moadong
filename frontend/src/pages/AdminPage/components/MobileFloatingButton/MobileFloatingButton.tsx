import * as Styled from './MobileFloatingButton.styles';

interface MobileFloatingButtonProps {
  onClick: () => void;
  icon: string;
  ariaLabel?: string;
  bottom: string;
}

const MobileFloatingButton = ({
  onClick,
  icon,
  ariaLabel,
  bottom,
}: MobileFloatingButtonProps) => {
  return (
    <Styled.Button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      $bottom={bottom}
    >
      <img src={icon} alt='' width={17} height={17} />
    </Styled.Button>
  );
};

export default MobileFloatingButton;
