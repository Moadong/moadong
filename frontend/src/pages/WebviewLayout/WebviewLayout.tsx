import { Outlet } from 'react-router-dom';
import WebviewBottomNav from '@/components/common/WebviewBottomNav/WebviewBottomNav';
import WebviewGlobalStyles from '@/styles/WebviewGlobal.styles';
import * as Styled from './WebviewLayout.styles';

const WebviewLayout = () => {
  return (
    <>
      <WebviewGlobalStyles />
      <Styled.ContentArea>
        <Outlet />
      </Styled.ContentArea>
      <WebviewBottomNav />
    </>
  );
};

export default WebviewLayout;
