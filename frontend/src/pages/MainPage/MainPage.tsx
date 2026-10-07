import SatisfactionModal from '@/components/common/SatisfactionModal/SatisfactionModal';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import useScrollTracking from '@/hooks/Mixpanel/useScrollTracking';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useDevice from '@/hooks/useDevice';
import MainContent from '@/pages/MainPage/components/MainContent/MainContent';
import MobileHome from '@/pages/MainPage/components/MobileHome/MobileHome';
import Popup from '@/pages/MainPage/components/Popup/Popup';
import {
  APP_DOWNLOAD_POPUP,
  MAILBOX_OPEN_POPUP,
} from '@/pages/MainPage/components/Popup/popupConfigs';
import isInAppWebView from '@/utils/isInAppWebView';

/**
 * 모바일·앱 웹뷰는 홍보 카드가 있는 허브 홈(`MobileHome`), 태블릿·웹은 전체 목록 홈.
 * 2026-09 `main_redesign` A/B 종료 후 허브 홈으로 확정했다.
 */
const MainPage = () => {
  const inWebview = isInAppWebView();
  const { isMobile } = useDevice();

  useTrackPageView(PAGE_VIEW.MAIN_PAGE);
  useScrollTracking(PAGE_NAME.MAIN);

  return (
    <>
      {inWebview ? (
        <Popup configs={[MAILBOX_OPEN_POPUP]} />
      ) : (
        <Popup configs={[APP_DOWNLOAD_POPUP]} />
      )}
      <SatisfactionModal />
      {isMobile || inWebview ? <MobileHome /> : <MainContent />}
    </>
  );
};

export default MainPage;
