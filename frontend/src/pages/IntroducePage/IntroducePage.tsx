import * as Styled from './IntroducePage.styles';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import IntroSection from './components/sections/1.IntroSection/IntroSection';
import ProblemSection from './components/sections/2.ProblemSection/ProblemSection';
import QuestionSection from './components/sections/3.QuestionSection/QuestionSection';
import CatchphraseSection from './components/sections/4.CatchphraseSection/CatchphraseSection';
import FeatureSection from './components/sections/5.FeatureSection/FeatureSection';
import ConvenienceSection from './components/sections/6.ConvenienceSection/ConvenienceSection';
import ContactSection from './components/sections/7.ContactSection/ContactSection';

const IntroducePage = () => {
  return (
    <>
      <Styled.IntroducePageHeader>
        <Header />
      </Styled.IntroducePageHeader>
      <Styled.Main>
        <IntroSection />
        <ProblemSection />
        <QuestionSection />
        <CatchphraseSection />
        <FeatureSection />
        <ConvenienceSection />
        <ContactSection />
      </Styled.Main>
      <Styled.IntroducePageFooter>
        <Footer />
      </Styled.IntroducePageFooter>
    </>
  );
};

export default IntroducePage;
