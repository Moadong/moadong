import styled, { keyframes } from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

// 헤더 아래(상단 고정)에서는 위에서 내려왔다가 위로 사라진다.
const fadeInOutFromTop = keyframes`
  0% { opacity: 0; transform: translate(-50%, -12px); }
  10% { opacity: 1; transform: translate(-50%, 0); }
  85% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -8px); }
`;

// 하단 고정에서는 반대로 아래에서 올라왔다가 아래로 사라진다.
const fadeInOutFromBottom = keyframes`
  0% { opacity: 0; transform: translate(-50%, 12px); }
  10% { opacity: 1; transform: translate(-50%, 0); }
  85% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 8px); }
`;

const GAP_BELOW_HEADER = 16;
const GAP_FROM_BOTTOM = 24;

export const ToastMessage = styled.div<{
  $backgroundColor: string;
  $color: string;
  $duration: number;
}>`
  position: fixed;
  left: 50%;
  top: ${HEADER_HEIGHT.desktop + GAP_BELOW_HEADER}px;
  z-index: ${Z_INDEX.toast};
  max-width: calc(100% - 40px);
  padding: 12px 20px;
  border-radius: 999px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $color }) => $color};
  ${setTypography(typography.paragraph.p5)};
  letter-spacing: -0.2px;
  text-align: center;
  pointer-events: none;
  animation: ${fadeInOutFromTop} ${({ $duration }) => $duration}ms
    ${transitions.easing.easeInOut} forwards;

  /* 헤더를 숨기는 화면이 많아 상단에 두면 콘텐츠를 가린다. 하단으로 붙인다. */
  ${media.tablet} {
    top: auto;
    bottom: ${GAP_FROM_BOTTOM}px;
    animation-name: ${fadeInOutFromBottom};
  }

  ${media.mobile} {
    padding: 10px 16px;
  }
`;
