import styled, { keyframes } from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

// 헤더 아래에 노출되므로 위에서 내려왔다가 위로 사라진다.
const fadeInOut = keyframes`
  0% { opacity: 0; transform: translate(-50%, -12px); }
  10% { opacity: 1; transform: translate(-50%, 0); }
  85% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -8px); }
`;

const GAP_BELOW_HEADER = 16;

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
  animation: ${fadeInOut} ${({ $duration }) => $duration}ms
    ${transitions.easing.easeInOut} forwards;

  ${media.tablet} {
    top: ${HEADER_HEIGHT.tablet + GAP_BELOW_HEADER}px;
  }

  ${media.mobile} {
    top: ${HEADER_HEIGHT.mobile + GAP_BELOW_HEADER}px;
    padding: 10px 16px;
  }
`;
