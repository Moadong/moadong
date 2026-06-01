import styled from 'styled-components';
import { WEBVIEW_BOTTOM_NAV_HEIGHT } from '@/components/common/WebviewBottomNav/WebviewBottomNav.styles';

export const ContentArea = styled.div`
  padding-bottom: calc(
    ${WEBVIEW_BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom)
  );
`;
