import { useEffect } from 'react';
import SatisfactionModal from '@/components/common/SatisfactionModal/SatisfactionModal';
import { PAGE_NAME, PAGE_VIEW } from '@/constants/eventName';
import { mainRedesignExperiment } from '@/experiments/definitions';
import { trackExperimentExposure } from '@/experiments/experimentAssignments';
import { useExperimentVariant } from '@/hooks/Experiment/useExperimentVariant';
import useScrollTracking from '@/hooks/Mixpanel/useScrollTracking';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useDevice from '@/hooks/useDevice';
import LegacyMain from '@/pages/MainPage/components/LegacyMain/LegacyMain';
import MobileHome from '@/pages/MainPage/components/MobileHome/MobileHome';
import Popup from '@/pages/MainPage/components/Popup/Popup';
import { APP_DOWNLOAD_POPUP } from '@/pages/MainPage/components/Popup/popupConfigs';
import isInAppWebView from '@/utils/isInAppWebView';

/**
 * 개편 홈은 모바일·앱에만 적용하고, 태블릿·웹은 기존 메인을 유지한다.
 * 모바일·앱 안에서 개편 노출 여부는 `main_redesign` 실험이 가른다.
 */
const MainPage = () => {
  const inWebview = isInAppWebView();
  const { isMobile } = useDevice();
  const isNarrow = isMobile || inWebview;
  const variant = useExperimentVariant(mainRedesignExperiment);

  useTrackPageView(
    inWebview ? PAGE_VIEW.WEBVIEW_MAIN_PAGE : PAGE_VIEW.MAIN_PAGE,
  );
  useScrollTracking(PAGE_NAME.MAIN);

  useEffect(() => {
    // 태블릿·웹은 두 변형 중 무엇도 보지 않으므로 노출로 세지 않는다
    if (isNarrow) trackExperimentExposure(mainRedesignExperiment);
  }, [isNarrow]);

  return (
    <>
      {!inWebview && <Popup configs={[APP_DOWNLOAD_POPUP]} />}
      <SatisfactionModal />
      {isNarrow && variant === 'treatment' ? <MobileHome /> : <LegacyMain />}
    </>
  );
};

export default MainPage;
