import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import introduce_main_screen from '@/assets/images/introduce/introduce_main_screen.webp';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useDevice from '@/hooks/useDevice';
import isInAppWebView from '@/utils/isInAppWebView';
import AudienceToggle, {
  AUDIENCE_PANEL_ID,
} from './components/AudienceToggle/AudienceToggle';
import PhoneMockup, {
  PhoneCapture,
} from './components/PhoneMockup/PhoneMockup';
import IntroSection from './components/sections/1.IntroSection/IntroSection';
import ProblemSection from './components/sections/2.ProblemSection/ProblemSection';
import ContactSection from './components/sections/7.ContactSection/ContactSection';
import FaqSection from './components/sections/FaqSection/FaqSection';
import StatsSection from './components/sections/StatsSection/StatsSection';
import StudentShowcaseSection from './components/sections/student/StudentShowcaseSection/StudentShowcaseSection';
import StartActions from './components/StartActions/StartActions';
import { TossfaceStylesheet } from './components/Tossface/Tossface';
import { Audience, AUDIENCE_CONTENT } from './constants/audience';
import useAppDownload, { APP_DOWNLOAD_QUERY } from './hooks/useAppDownload';
import useAudience from './hooks/useAudience';
import * as Styled from './IntroducePage.styles';

// 운영진 첫 화면(관리자 화면 미리보기)은 학생 방문자가 받지 않게 나눈다
const AdminDashboardPreview = lazy(
  () => import('./components/AdminDashboardPreview/AdminDashboardPreview'),
);

const ClubShowcaseSection = lazy(
  () =>
    import('./components/sections/club/ClubShowcaseSection/ClubShowcaseSection'),
);

const IntroducePage = () => {
  useTrackPageView(PAGE_VIEW.INTRODUCE_PAGE);
  const { isMobile, isTablet } = useDevice();
  const showPageTopBar = isMobile || isTablet || isInAppWebView();
  const { audience, changeAudience } = useAudience();
  const content = AUDIENCE_CONTENT[audience];
  const redirectToStore = useAppDownload('qr');

  // PC 화면의 설치 QR을 폰으로 찍고 들어오면 기기에 맞는 스토어로 바로 넘긴다
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(APP_DOWNLOAD_QUERY.key) !== APP_DOWNLOAD_QUERY.value) return;
    if (isMobile || isTablet) redirectToStore('redirect');
    // 마운트 때 한 번만 확인한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAudienceChange = (next: Audience) => {
    changeAudience(next);
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showPageTopBar ? <WebviewTopBar title='서비스 소개' /> : <Header />}
      <TossfaceStylesheet />
      <Styled.PageWrapper>
        <Styled.Main>
          <AudienceToggle value={audience} onChange={handleAudienceChange} />
          <IntroSection
            {...content.hero}
            actions={<StartActions audience={audience} location='hero' />}
            visual={
              audience === 'student' ? (
                <PhoneMockup>
                  <PhoneCapture
                    src={introduce_main_screen}
                    alt='모아동 메인 화면'
                  />
                </PhoneMockup>
              ) : (
                <Suspense fallback={<Styled.VisualFallback />}>
                  <AdminDashboardPreview />
                </Suspense>
              )
            }
          />
          <StatsSection key={audience} audience={audience} />
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={audience}
              id={AUDIENCE_PANEL_ID}
              role='tabpanel'
              style={{ width: '100%' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ProblemSection {...content.problem} />
              {audience === 'student' ? (
                <StudentShowcaseSection />
              ) : (
                <Suspense fallback={<Styled.ShowcaseFallback />}>
                  <ClubShowcaseSection />
                </Suspense>
              )}
              <FaqSection items={content.faq} />
              <ContactSection
                {...content.contact}
                actions={<StartActions audience={audience} location='footer' />}
              />
            </motion.div>
          </AnimatePresence>
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
