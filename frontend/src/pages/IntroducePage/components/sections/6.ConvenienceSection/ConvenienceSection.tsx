import * as Styled from './ConvenienceSection.styles';
import useDevice from '@/hooks/useDevice';
import {
  desktopFeatures,
  mobileFeatures,
} from '@/assets/images/introduce/features';

const ConvenienceSection = () => {
  const { isDesktop } = useDevice();
  const features = isDesktop ? desktopFeatures : mobileFeatures;

  return (
    <Styled.ConvenienceSection>
      <Styled.ConvenienceTitle>
        더 편리하게 모아동 사용하기
      </Styled.ConvenienceTitle>

      <Styled.FeatureGrid>
        <Styled.Card1 src={features[0].src} alt={features[0].alt} />
        <Styled.Card2 src={features[1].src} alt={features[1].alt} />
        <Styled.Card3 src={features[2].src} alt={features[2].alt} />
        <Styled.Card4 src={features[3].src} alt={features[3].alt} />
      </Styled.FeatureGrid>
    </Styled.ConvenienceSection>
  );
};

export default ConvenienceSection;