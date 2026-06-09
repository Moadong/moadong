import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import * as Styled from './AppLayout.styles';

const AppLayout = () => (
  <>
    <Styled.Content>
      <Outlet />
    </Styled.Content>
    <BottomNavigation />
  </>
);

export default AppLayout;
