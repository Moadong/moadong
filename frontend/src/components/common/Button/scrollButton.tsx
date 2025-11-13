import { useScrollToTop } from '@/hooks/useScrollToTop';
import scrollButtonIcon from '@/assets/images/icons/scroll.png';
import styled from 'styled-components';

const StyledButton = styled.button<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s, visibility 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  img {
    width: 50px;
    height: 50px;
    display: block;
  }
`;

export const ScrollButton = () => {
  const { isVisibleButton, moveToTop } = useScrollToTop();

  return (
    <StyledButton
      type="button"
      $isVisible={isVisibleButton}
      onClick={moveToTop}
      aria-label="위로 이동하기"
    >
      <img src={scrollButtonIcon} alt="Scroll to top" />
    </StyledButton>
  );
};