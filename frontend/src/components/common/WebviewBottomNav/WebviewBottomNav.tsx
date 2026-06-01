import { useLocation, useNavigate } from 'react-router-dom';
import {
  WEBVIEW_BOTTOM_NAV,
  WebviewBottomNavPath,
} from '@/routes/webviewBottomNavConfig';
import * as Styled from './WebviewBottomNav.styles';

const WebviewBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: WebviewBottomNavPath) => {
    // 홈 탭은 동아리 목록(/webview/main)과 홍보(/webview/promotions)에서 활성.
    if (path === '/webview/main') {
      return pathname === '/webview/main' || pathname === '/webview/promotions';
    }
    return pathname === path;
  };

  return (
    <Styled.BottomNavContainer>
      {WEBVIEW_BOTTOM_NAV.map((tab) => {
        const active = isActive(tab.path);
        return (
          <Styled.NavButton
            key={tab.path}
            type='button'
            $isActive={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </Styled.NavButton>
        );
      })}
    </Styled.BottomNavContainer>
  );
};

export default WebviewBottomNav;
