import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import Filter from '@/pages/MainPage/components/Filter/Filter';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './IntroductionPage.styles';

const IntroductionPage = () => {
  useTrackPageView(PAGE_VIEW.FESTIVAL_INTRODUCTION_PAGE);
  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        {!isInAppWebView() && <Filter alwaysVisible />}
        {/* 지도 | 공연시간표 탭 */}
        {/* 동아리지도 */}
        {/* 공연시간표 */}
      </Styled.Container>
      <Footer />
    </>
  );
};

export default IntroductionPage;
