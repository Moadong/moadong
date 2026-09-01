import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import useDevice from '@/hooks/useDevice';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import isInAppWebView from '@/utils/isInAppWebView';
import IntroSection from './components/sections/1.IntroSection/IntroSection';
import ProblemSection from './components/sections/2.ProblemSection/ProblemSection';
import QuestionSection from './components/sections/3.QuestionSection/QuestionSection';
import CatchphraseSection from './components/sections/4.CatchphraseSection/CatchphraseSection';
import FeatureSection from './components/sections/5.FeatureSection/FeatureSection';
import ConvenienceSection from './components/sections/6.ConvenienceSection/ConvenienceSection';
import ContactSection from './components/sections/7.ContactSection/ContactSection';
import * as Styled from './IntroducePage.styles';

const IntroducePage = () => {
  useTrackPageView(PAGE_VIEW.INTRODUCE_PAGE);
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();

  return (
    <>
      {showPageTopBar ? <WebviewTopBar title='서비스 소개' /> : <Header />}
      <Styled.PageWrapper>
      <Styled.Main>
        <IntroSection />
        <ProblemSection />
        <QuestionSection />
        <CatchphraseSection />
        <FeatureSection />
        <ConvenienceSection />
        <ContactSection />
      </Styled.Main>
      {!isInAppWebView() && (
        <Styled.IntroducePageFooter>
          <Footer />
        </Styled.IntroducePageFooter>
      )}
      </Styled.PageWrapper>
    </>
  );
};

export default IntroducePage;
