import { Outlet } from 'react-router-dom';
import WebviewGlobalStyles from '@/styles/WebviewGlobal.styles';

const WebviewLayout = () => {
  return (
    <>
      <WebviewGlobalStyles />
      <Outlet />
    </>
  );
};

export default WebviewLayout;
