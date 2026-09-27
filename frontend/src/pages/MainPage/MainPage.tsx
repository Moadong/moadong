import SatisfactionModal from '@/components/common/SatisfactionModal/SatisfactionModal';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import useScrollTracking from '@/hooks/Mixpanel/useScrollTracking';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import MainContent from '@/pages/MainPage/components/MainContent/MainContent';
import Popup from '@/pages/MainPage/components/Popup/Popup';
import {
  APP_DOWNLOAD_POPUP,
  MAILBOX_OPEN_POPUP,
} from '@/pages/MainPage/components/Popup/popupConfigs';
import isInAppWebView from '@/utils/isInAppWebView';

const MainPage = () => {
  const inWebview = isInAppWebView();

  useTrackPageView(
    inWebview ? PAGE_VIEW.WEBVIEW_MAIN_PAGE : PAGE_VIEW.MAIN_PAGE,
  );
  useScrollTracking(PAGE_NAME.MAIN);

  return (
    <>
      {inWebview ? (
        <Popup configs={[MAILBOX_OPEN_POPUP]} />
      ) : (
        <Popup configs={[APP_DOWNLOAD_POPUP]} />
      )}
      <SatisfactionModal />
      <MainContent />
    </>
  );
};

export default MainPage;
