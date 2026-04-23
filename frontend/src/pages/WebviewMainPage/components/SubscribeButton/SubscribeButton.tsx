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
      <svg
        width='22'
        height='20'
        viewBox='0 0 22 20'
        fill={subscribed ? 'currentColor' : 'none'}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M11 18.5C11 18.5 1.5 13 1.5 6.5C1.5 4.01472 3.51472 2 6 2C7.74261 2 9.26309 2.97679 10.0919 4.41439C10.3528 4.87204 10.9972 4.87204 11.2581 4.41439C12.0869 2.97679 13.6074 2 15.35 2C17.8353 2 19.85 4.01472 19.85 6.5C19.85 13 10.35 18.5 10.35 18.5'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </Styled.SubscribeButton>
  );
};

export default SubscribeButton;
