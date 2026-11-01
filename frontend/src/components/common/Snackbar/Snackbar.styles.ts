import styled from 'styled-components';
import { ToastMessage } from '@/components/common/Toast/Toast.styles';
import { setTypography, typography } from '@/styles/theme/typography';

/*
 * 스낵바는 토스트와 같은 자리·같은 모양으로 뜬다. 다른 점은 액션 버튼뿐이라
 * 위치·애니메이션·브레이크포인트 규칙은 ToastMessage를 그대로 잇는다.
 */
export const SnackbarSurface = styled(ToastMessage)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  /* left: 50%라 폭을 안 주면 shrink-to-fit 가용폭이 화면 절반으로 잡혀 문구가 눌린다 */
  width: max-content;
  /* 한글은 기본값에서 음절 단위로 끊겨 "받아볼" 이 "받 / 아볼" 로 갈라진다 */
  word-break: keep-all;
`;

/* 표면은 pointer-events: none을 물려받으므로 액션 버튼만 다시 켜 준다. */
export const SnackbarActionButton = styled.button`
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  ${setTypography(typography.button.button1)};
  letter-spacing: -0.2px;
  text-decoration: underline;
  text-underline-offset: 2px;
  pointer-events: auto;
  cursor: pointer;
`;
