import {
  fadeUp,
  stagger,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import * as Styled from './ProblemSection.styles';

const ProblemSection = () => {
  return (
    <Styled.ProblemSection
      variants={stagger}
      initial='hidden'
      whileInView='show'
      viewport={VIEWPORT_CONFIG}
    >
      <Styled.ProblemSectionTitle variants={fadeUp}>
        동아리 찾기 너무 불편하지 않으셨나요
      </Styled.ProblemSectionTitle>

      <Styled.BubblesContainer variants={stagger}>
        <Styled.BubbleItem variants={fadeUp} $alignRight={false}>
          <Styled.SpeechBubble>
            원하는 동아리 소개를 보려면 게시물을 끝없이 스크롤해야 했어요.
          </Styled.SpeechBubble>
        </Styled.BubbleItem>
        <Styled.BubbleItem variants={fadeUp} $alignRight={true}>
          <Styled.SpeechBubble>
            모집 게시물이 올라오기 전까지 모집 시기를 알 수 없어 놓친 적도
            많아요
          </Styled.SpeechBubble>
        </Styled.BubbleItem>

        <Styled.BubbleItem variants={fadeUp} $alignRight={false}>
          <Styled.SpeechBubble>
            에브리타임에서 동아리를 찾는 데 너무 많은 시간이 걸려요
          </Styled.SpeechBubble>
        </Styled.BubbleItem>

        <Styled.BubbleItem variants={fadeUp} $alignRight={true}>
          <Styled.SpeechBubble>
            게시물 하나하나 들어가서 확인하려니 너무 번거로웠어요.
          </Styled.SpeechBubble>
        </Styled.BubbleItem>
      </Styled.BubblesContainer>
    </Styled.ProblemSection>
  );
};

export default ProblemSection;
