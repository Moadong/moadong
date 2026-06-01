import { Outlet, useLocation } from 'react-router-dom';
import WebviewBottomNav from '@/components/common/WebviewBottomNav/WebviewBottomNav';
import WebviewGlobalStyles from '@/styles/WebviewGlobal.styles';
import * as Styled from './WebviewLayout.styles';

const WebviewLayout = () => {
  const { pathname } = useLocation();
  // 동아리 상세는 풀스크린 — 바텀바와 하단 패딩을 함께 숨긴다.
  const hideBottomNav = pathname.startsWith('/webview/club');

  return (
    <>
      <WebviewGlobalStyles />
      <Styled.ContentArea $hideBottomNav={hideBottomNav}>
        <Outlet />
      </Styled.ContentArea>
      {!hideBottomNav && <WebviewBottomNav />}
    </>
  );
};

export default WebviewLayout;
