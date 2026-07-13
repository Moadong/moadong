import scrollToTopIcon from '@/assets/images/icons/scroll_to_top_icon.svg';
import shareFloatingIcon from '@/assets/images/icons/share_floating_icon.svg';
import { useScrollTo } from '@/hooks/Scroll/useScrollTo';
import { useScrollTrigger } from '@/hooks/Scroll/useScrollTrigger';
import * as Styled from './FloatingButtonGroup.styles';

export const FloatingButtonGroup = () => {
  const { isTriggered, isScrollingUp } = useScrollTrigger();
  const { scrollToTop } = useScrollTo();

  return (
    <Styled.GroupContainer>
      <Styled.FloatingButton
        type='button'
        $isVisible={isTriggered}
        onClick={() => scrollToTop()}
        aria-label='위로 이동하기'
      >
        <img src={scrollToTopIcon} alt='위로 이동' />
      </Styled.FloatingButton>
      <Styled.FloatingButton
        type='button'
        $isVisible={isScrollingUp}
        aria-label='현재 페이지 공유하기'
      >
        <img src={shareFloatingIcon} alt='공유하기' />
      </Styled.FloatingButton>
    </Styled.GroupContainer>
  );
};
