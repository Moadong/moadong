import search_button_icon from '@/assets/images/icons/search_button_icon.svg';
import {
  fade,
  fadeUp,
  scrollVariants,
  stagger,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import { tagsRow1, tagsRow2 } from '@/pages/IntroducePage/constants/mockData';
import * as Styled from './FeatureSection.styles';

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

      <Styled.SearchWrapper variants={fadeUp}>
        <Styled.TypingText>축구하는 동아리</Styled.TypingText>
        <Styled.SearchButton>
          <img src={search_button_icon} alt='검색 아이콘' />
        </Styled.SearchButton>
      </Styled.SearchWrapper>

      <Styled.TagsContainer variants={fade}>
        <Styled.TagWindow>
          <Styled.TagRow variants={scrollVariants} animate='left'>
            {[...tagsRow1, ...tagsRow1].map((tag, index) => (
              <Styled.CustomTag key={index} type={tag.type}>
                {tag.label}
              </Styled.CustomTag>
            ))}
          </Styled.TagRow>
        </Styled.TagWindow>

        <Styled.TagWindow>
          <Styled.TagRow variants={scrollVariants} animate='right'>
            {[...tagsRow2, ...tagsRow2].map((tag, index) => (
              <Styled.CustomTag key={index} type={tag.type}>
                {tag.label}
              </Styled.CustomTag>
            ))}
          </Styled.TagRow>
        </Styled.TagWindow>
      </Styled.TagsContainer>
    </Styled.FeatureSection>
  );
};

export default FeatureSection;
