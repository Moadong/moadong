import * as Styled from './IntroducePage.styles';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import type { Variants, Transition } from 'framer-motion';
import search_button_icon from '@/assets/images/icons/search_button_icon.svg';
import { useNavigate } from 'react-router-dom';
import {
  BackgroundTwistLeft,
  BackgroundTwistRight,
  BackgroundCircleSmall,
  BackgroundCircleLarge,
} from './components/BackgroundShapes';

const transDefault: Transition = { duration: 0.5, ease: 'easeOut' };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: transDefault },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transDefault },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const IntroducePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Styled.IntroducePageHeader>
        <Header />
      </Styled.IntroducePageHeader>
      <Styled.Main>
        {/* 1) 히어로 */}
        <Styled.IntroSection
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.35 }}
          aria-labelledby='intro-title'
        >
          <Styled.Shape top='-40px' left='20px'>
            <BackgroundTwistLeft />
          </Styled.Shape>

          <Styled.Shape top='163px' right='-10px'>
            <BackgroundTwistRight />
          </Styled.Shape>

          <Styled.Shape top='575px' left='411px'>
            <BackgroundCircleSmall />
          </Styled.Shape>

          <Styled.Shape top='380px' right='477px'>
            <BackgroundCircleLarge />
          </Styled.Shape>
          <Styled.Container>
            <Styled.TextWrapper>
              <Styled.IntroTitle variants={fadeIn} id='intro-title'>
                모아동아리
              </Styled.IntroTitle>

              <Styled.IntroSubtitle variants={fadeIn}>
                부경대학교의 모든 동아리를 한눈에
              </Styled.IntroSubtitle>

              <Styled.IntroButton
                variants={fadeIn}
                onClick={() => navigate('/')}
              >
                동아리 모아보기
                <img
                  src={search_button_icon}
                  alt='검색 버튼 아이콘'
                  className='icon'
                />
              </Styled.IntroButton>
            </Styled.TextWrapper>
            <Styled.VisualWrapper></Styled.VisualWrapper>
          </Styled.Container>
        </Styled.IntroSection>
      </Styled.Main>
      <Styled.IntroducePageFooter>
        <Footer />
      </Styled.IntroducePageFooter>
    </>
  );
};

export default IntroducePage;
