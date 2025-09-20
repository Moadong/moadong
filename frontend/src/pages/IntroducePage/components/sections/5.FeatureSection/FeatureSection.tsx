import * as Styled from './FeatureSection.styles';
import { stagger, fadeUp, fade, scrollVariants, VIEWPORT_CONFIG } from '@/pages/IntroducePage/constants/animations';
import { tagsRow1, tagsRow2 } from '@/pages/IntroducePage/constants/mockData';
import ClubTag from '@/components/ClubTag/ClubTag';

const FeatureSection = () => {
  return (
    <Styled.FeatureSection
      variants={stagger}
      initial='hidden'
      whileInView='show'
      viewport={VIEWPORT_CONFIG}
    >
      <Styled.FeatureTitle variants={fadeUp}>
        모아동에서 쉽게 검색해서 동아리 찾기
      </Styled.FeatureTitle>
      <Styled.FeatureSubtitle variants={fadeUp}>
        키워드로 검색해서 간편하게 찾아보세요
      </Styled.FeatureSubtitle>

      <Styled.TagsContainer variants={fade}>
        <Styled.TagRow
          variants={scrollVariants}
          animate='scrolling'
          custom='left'
        >
          {[...tagsRow1].map((tag, index) => (
            <ClubTag key={index} type={tag.type}>
              {tag.label}
            </ClubTag>
          ))}
        </Styled.TagRow>
        <Styled.TagRow
          variants={scrollVariants}
          animate='scrolling'
          custom='right'
        >
          {[...tagsRow2].map((tag, index) => (
            <ClubTag key={index} type={tag.type}>
              {tag.label}
            </ClubTag>
          ))}
        </Styled.TagRow>
      </Styled.TagsContainer>
    </Styled.FeatureSection>
  );
};

export default FeatureSection;