import scrollButtonIcon from '@/assets/images/icons/scroll_icon.svg';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import * as Styled from './ScrollToTopButton.styles';

export const ScrollToTopButton = () => {
  const { isTriggered } = useScrollTrigger();
  const { scrollToTop } = useScrollTo();

  return (
    <Styled.ScrollButton
      type='button'
      $isVisible={isTriggered}
      onClick={() => scrollToTop()}
      aria-label='위로 이동하기'
    >
      <img src={scrollButtonIcon} alt='Scroll to top' />
    </Styled.ScrollButton>
  );
};
