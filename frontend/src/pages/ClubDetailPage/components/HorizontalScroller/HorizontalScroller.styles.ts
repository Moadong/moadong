// 가로 스크롤 영역의 양 끝 흐림·화살표 버튼 스타일
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';

type Side = 'left' | 'right';

export const Wrapper = styled.div`
  position: relative;

  ${media.tablet} {
    margin: 0 -20px;
  }
`;

export const Viewport = styled.div`
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.tablet} {
    padding: 0 20px;
    scroll-padding: 0 20px;
  }
`;

export const Fade = styled.span<{ $side: Side; $visible: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  width: 56px;
  pointer-events: none;
  background: linear-gradient(
    ${({ $side }) => ($side === 'left' ? 'to right' : 'to left')},
    ${colors.base.white},
    rgba(255, 255, 255, 0)
  );
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity ${transitions.duration.fast} ${transitions.easing.ease};

  ${media.tablet} {
    width: 32px;
  }
`;

export const ArrowButton = styled.button<{ $side: Side; $visible: boolean }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === 'left' ? 'left: -18px;' : 'right: -18px;')}
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid ${colors.gray[300]};
  border-radius: 50%;
  background-color: ${colors.base.white};
  color: ${colors.gray[900]};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transform: translateY(-50%)
    ${({ $side }) => ($side === 'left' ? 'rotate(180deg)' : '')};
  transition: opacity ${transitions.duration.fast} ${transitions.easing.ease};

  ${({ $visible }) =>
    !$visible &&
    css`
      opacity: 0;
      pointer-events: none;
    `}

  &:hover {
    background-color: ${colors.gray[50]};
  }

  /* 터치 기기는 손가락으로 넘기니 흐림만 보여준다 */
  @media (hover: none) {
    display: none;
  }

  ${media.tablet} {
    display: none;
  }
`;
