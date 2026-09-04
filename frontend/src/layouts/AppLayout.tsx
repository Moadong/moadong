import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import usePromotionNotification from '@/hooks/Queries/usePromotionNotification';
import useClubListPath from '@/hooks/useClubListPath';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './AppLayout.styles';

/** 하단바가 실제로 보일 때만 홍보 알림 쿼리를 돌린다 */
const BottomNavigationWithNotification = () => {
  const hasPromotionNotification = usePromotionNotification();
  // 실험 분기는 여기서 풀어 prop으로 내린다. 바텀네비가 직접 훅을 부르면
  // 데스크톱 폭·실험 미배정 상태인 Storybook에서 항상 구독 탭만 보인다
  const showClubsTab = useClubListPath() === '/clubs';

  return (
    <BottomNavigation
      showClubsTab={showClubsTab}
      hasPromotionNotification={hasPromotionNotification}
    />
  );
};

const AppLayout = () => {
  const { isMobile } = useDevice();
  // 앱 웹뷰는 화면 폭과 무관하게 항상, 웹은 모바일에서만 하단바를 쓴다
  const showBottomNav = isInAppWebView() || isMobile;

  return (
    <>
      <Styled.Content $hasBottomNav={showBottomNav}>
        <Outlet />
      </Styled.Content>
      {showBottomNav && <BottomNavigationWithNotification />}
    </>
  );
};

export default AppLayout;
