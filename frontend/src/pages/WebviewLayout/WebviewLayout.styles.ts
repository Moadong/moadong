import styled from 'styled-components';
import { WEBVIEW_BOTTOM_NAV_HEIGHT } from '@/components/common/WebviewBottomNav/WebviewBottomNav.styles';

export const ContentArea = styled.div<{ $hideBottomNav: boolean }>`
  padding-bottom: ${({ $hideBottomNav }) =>
    $hideBottomNav
      ? '0'
      : `calc(${WEBVIEW_BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`};
`;
