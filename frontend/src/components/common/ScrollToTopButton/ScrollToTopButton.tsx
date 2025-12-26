import scrollButtonIcon from '@/assets/images/icons/scroll_icon.svg';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import * as Styled from './ScrollToTopButton.styles';

export const ScrollToTopButton = () => {
  const { isTriggered } = useScrollTrigger();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Styled.ScrollButton
      type='button'
      $isVisible={isTriggered}
      onClick={handleScrollToTop}
      aria-label='위로 이동하기'
    >
      <img src={scrollButtonIcon} alt='Scroll to top' />
    </Styled.ScrollButton>
  );
};
