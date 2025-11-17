import { useScrollToTop } from '@/hooks/useScrollToTop';
import scrollButtonIcon from '@/assets/images/icons/scroll_icon.svg';
import * as Styled from './ScrollButton.styles';


export const ScrollButton = () => {
  const { isTriggered } = useScrollToTop();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Styled.ScrollButton
      type="button"
      $isVisible={isTriggered}
      onClick={handleScrollToTop}
      aria-label="위로 이동하기"
    >
      <img src={scrollButtonIcon} alt="Scroll to top" />
    </Styled.ScrollButton>
  );
};