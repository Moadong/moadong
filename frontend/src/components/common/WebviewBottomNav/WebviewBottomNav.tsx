import { useLocation, useNavigate } from 'react-router-dom';
import { WEBVIEW_BOTTOM_NAV } from '@/routes/webviewBottomNavConfig';
import * as Styled from './WebviewBottomNav.styles';

const WebviewBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 동아리 상세는 풀스크린 — 바텀바를 숨긴다.
  if (pathname.startsWith('/webview/club')) return null;

  const isActive = (path: string) => {
    // 홈 탭은 동아리 목록(/webview/main)과 홍보(/webview/promotions)에서 활성.
    if (path === '/webview/main') {
      return pathname === '/webview/main' || pathname === '/webview/promotions';
    }
    return pathname === path;
  };

  return (
    <Styled.BottomNavContainer>
      {WEBVIEW_BOTTOM_NAV.map((tab) => (
        <Styled.NavButton
          key={tab.path}
          type='button'
          $isActive={isActive(tab.path)}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </Styled.NavButton>
      ))}
    </Styled.BottomNavContainer>
  );
};

export default WebviewBottomNav;
