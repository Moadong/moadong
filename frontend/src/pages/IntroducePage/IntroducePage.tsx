import { lazy, Suspense, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import introduce_main_long from '@/assets/images/introduce/introduce_main_long.webp';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import AudienceToggle, {
  AUDIENCE_PANEL_ID,
} from './components/AudienceToggle/AudienceToggle';
import LoopingScreen from './components/PhoneMockup/LoopingScreen';
import PhoneMockup from './components/PhoneMockup/PhoneMockup';
import IntroSection from './components/sections/1.IntroSection/IntroSection';
import ProblemSection from './components/sections/2.ProblemSection/ProblemSection';
import ContactSection from './components/sections/7.ContactSection/ContactSection';
import FaqSection from './components/sections/FaqSection/FaqSection';
import StatsSection from './components/sections/StatsSection/StatsSection';
import StudentShowcaseSection from './components/sections/student/StudentShowcaseSection/StudentShowcaseSection';
import StartActions from './components/StartActions/StartActions';
import { TossfaceStylesheet } from './components/Tossface/Tossface';
import { Audience, AUDIENCE_CONTENT } from './constants/audience';
import useAppDownload, {
  APP_DOWNLOAD_QUERY,
  isStoreDevice,
} from './hooks/useAppDownload';
import useAudience from './hooks/useAudience';
import * as Styled from './IntroducePage.styles';
import SubpageLayout from './subpages/SubpageLayout/SubpageLayout';

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
  const { audience, changeAudience } = useAudience();
  const content = AUDIENCE_CONTENT[audience];
  // 첫 화면의 큰 토글이 화면 밖으로 나가면 헤더 가운데에 작은 토글을 띄운다
  const inlineToggleRef = useRef<HTMLDivElement>(null);
  const inlineToggleVisible = useInView(inlineToggleRef, { initial: true });
  const redirectToStore = useAppDownload('qr');

  // PC 화면의 설치 QR을 폰으로 찍고 들어오면 기기에 맞는 스토어로 바로 넘긴다
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(APP_DOWNLOAD_QUERY.key) !== APP_DOWNLOAD_QUERY.value) return;
    if (isStoreDevice()) redirectToStore('redirect');
    // 마운트 때 한 번만 확인한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAudienceChange = (next: Audience) => {
    changeAudience(next);
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SubpageLayout
      fullWidth
      center={
        !inlineToggleVisible && (
          <AudienceToggle
            compact
            value={audience}
            onChange={handleAudienceChange}
          />
        )
      }
    >
      <TossfaceStylesheet />
      <Styled.PageWrapper>
        <Styled.Main>
          <IntroSection
            {...content.hero}
            top={
              // 헤더 토글이 떠 있는 동안 화면 밖 큰 토글은 보조기기에서 빼서 탭 목록이 둘로 읽히지 않게 한다
              <div ref={inlineToggleRef} inert={!inlineToggleVisible}>
                <AudienceToggle
                  value={audience}
                  onChange={handleAudienceChange}
                />
              </div>
            }
            actions={<StartActions audience={audience} location='hero' />}
            visual={
              audience === 'student' ? (
                <PhoneMockup>
                  {/* 실제 메인 화면을 위에서 아래로 천천히 둘러본다 */}
                  <LoopingScreen
                    src={introduce_main_long}
                    alt='모아동 메인 화면'
                    imageWidth={390}
                    imageHeight={1900}
                    viewWidth={390}
                    viewHeight={844}
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
      </Styled.PageWrapper>
    </SubpageLayout>
  );
};

export default IntroducePage;
