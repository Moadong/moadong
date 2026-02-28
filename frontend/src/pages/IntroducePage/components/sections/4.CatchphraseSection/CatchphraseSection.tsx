import moadong_logo_bg from '@/assets/images/logos/moadong_logo_bg.svg';
import {
  fade,
  fadeUp,
  stagger,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import * as Styled from './CatchphraseSection.styles';

const CatchphraseSection = () => {
  return (
    <Styled.CatchphraseSection
      variants={stagger}
      initial='hidden'
      whileInView='show'
      viewport={{ ...VIEWPORT_CONFIG, amount: 0.3 }}
    >
      <Styled.BackgroundBrandImage
        src={moadong_logo_bg}
        alt='모아동 로고 배경'
        variants={fade}
      />
      <Styled.CatchphraseWrapper variants={stagger}>
        <Styled.CatchphraseSubtitle variants={fadeUp}>
          이제 동아리 찾느라 시간 낭비하지 마세요
        </Styled.CatchphraseSubtitle>
        <Styled.CatchphraseTitle variants={fadeUp}>
          모든 동아리, 여기 다 모아뒀어요
        </Styled.CatchphraseTitle>
      </Styled.CatchphraseWrapper>
    </Styled.CatchphraseSection>
  );
};

export default CatchphraseSection;
