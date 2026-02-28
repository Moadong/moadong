import {
  desktopFeatures,
  mobileFeatures,
} from '@/assets/images/introduce/features';
import useDevice from '@/hooks/useDevice';
import {
  cardVariants,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import * as Styled from './ConvenienceSection.styles';

const ConvenienceSection = () => {
  const { isDesktop } = useDevice();
  const features = isDesktop ? desktopFeatures : mobileFeatures;

  return (
    <Styled.ConvenienceSection>
      <Styled.ConvenienceTitle>
        더 편리하게 모아동 사용하기
      </Styled.ConvenienceTitle>

      <Styled.FeatureGrid>
        <Styled.Card1
          src={features[0].src}
          alt={features[0].alt}
          variants={cardVariants.top}
          initial='hidden'
          whileInView='show'
          viewport={VIEWPORT_CONFIG}
        />
        <Styled.Card2
          src={features[1].src}
          alt={features[1].alt}
          variants={cardVariants.left}
          initial='hidden'
          whileInView='show'
          viewport={VIEWPORT_CONFIG}
        />
        <Styled.Card3
          src={features[2].src}
          alt={features[2].alt}
          variants={cardVariants.right}
          initial='hidden'
          whileInView='show'
          viewport={VIEWPORT_CONFIG}
        />
        <Styled.Card4
          src={features[3].src}
          alt={features[3].alt}
          variants={cardVariants.bottom}
          initial='hidden'
          whileInView='show'
          viewport={VIEWPORT_CONFIG}
        />
      </Styled.FeatureGrid>
    </Styled.ConvenienceSection>
  );
};

export default ConvenienceSection;
