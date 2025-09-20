import styled from 'styled-components';
import { motion } from 'framer-motion';
import { media } from '@/styles/mediaQuery';

export const IntroducePageHeader = styled.header`
  width: 100%;
  background: #fff;
`;
export const IntroducePageFooter = styled.footer`
  background: #fff;
  border-top: 1px solid #eee;
`;
export const Main = styled.main`
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* 1) 인트로 섹션 */
export const IntroSection = styled(motion.section)`
  width: 100%;
  padding: 72px 0 150px;
  background: linear-gradient(
    180deg,
    rgba(255, 84, 20, 0.004) 0%,
    rgba(255, 84, 20, 0.08) 55.29%,
    rgba(255, 84, 20, 0.004) 100%
  );
  position: relative;
  overflow: hidden;
`;

export const Container = styled.div`
  width: min(1120px, 92vw);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const Shape = styled.div<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}>`
  position: absolute;
  z-index: 0;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;

export const TextWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

export const IntroTitle = styled(motion.h1)`
  color: #ff5414;
  font-size: 80px;
`;

export const IntroSubtitle = styled(motion.h2)`
  font-size: 36px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

export const IntroButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 46px 14px 50px;
  background: #ff5414;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  margin-top: 28px;
  cursor: pointer;

  .icon {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }

  &:hover {
    background: #e04e0f;
    transition:
      background 0.3s,
      box-shadow 0.3s;
  }
`;

export const VisualWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 29px;
  min-height: 600px;
`;

export const PhoneImageWrapper = styled(motion.div)`
  /* 필요에 따라 위치 조정을 위한 스타일 추가 가능 */
`;

export const PhoneImage = styled.img`
  width: 375px;
  height: auto;
`;

export const CardImage = styled(motion.div)<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  transform?: string;
}>`
  position: absolute;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
  transform: ${({ transform }) => transform || 'none'};
`;

export const ProblemSection = styled(motion.section)`
  width: 700px;
  margin: 0 auto 150px;
`;

export const ProblemSectionTitle = styled(motion.h2)`
  font-weight: bold;
  text-align: center;
  font-size: 30px;
  margin-bottom: 82px;
`;

export const BubblesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 37px;
`;

export const BubbleItem = styled(motion.div)<{ $alignRight?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${({ $alignRight }) =>
    $alignRight ? 'flex-end' : 'flex-start'};
`;

export const SpeechBubble = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: fit-content;
  padding: 14px 37.5px;
  border-radius: 37.5px;
  background: rgba(255, 84, 20, 0.08);
  font-size: 20px;
`;

export const QuestionSection = styled(motion.section)`
  width: 100%;
  padding: 150px 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const QuestionTitle = styled(motion.h2)`
  font-size: 30px;
  color: #333;
  font-weight: bold;
  z-index: 1;
`;

export const BackgroundQuestionMark = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  font-size: 400px;
  font-weight: 400;
  color: rgba(255, 84, 20, 0.2);
  filter: blur(19px);
  user-select: none;
  line-height: 619px;
`;

export const CatchphraseSection = styled(motion.section)`
  width: 100%;
  padding: 120px 0;
  background-color: rgba(255, 84, 20, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-top: 114px;
`;

export const BackgroundBrandImage = styled(motion.img)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  width: 100%;
  max-width: 1400px;

  opacity: 0.05;
  user-select: none;
`;

export const CatchphraseWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
`;

export const CatchphraseSubtitle = styled(motion.p)`
  font-size: 30px;
  color: #121212;
  font-weight: bold;
  margin-bottom: 2px;
`;

export const CatchphraseTitle = styled(motion.h2)`
  font-size: 48px;
  font-weight: bold;
  color: #ff5414;
`;

export const FeatureSection = styled(motion.section)`
  width: 100%;
  padding: 150px 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

export const FeatureTitle = styled(motion.h2)`
  font-size: 48px;
  font-weight: 900;
  color: #333;
`;

export const FeatureSubtitle = styled(motion.p)`
  font-size: 18px;
  color: #555;
  margin-top: -20px;
  margin-bottom: 40px; // 태그 컨테이너와의 간격
`;

export const TagsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;

export const TagRow = styled(motion.div)`
  display: flex;
  align-items: center;
  width: fit-content;
  flex-wrap: nowrap;
  white-space: nowrap;
  margin-bottom: 20px;

  /* ClubTag 컴포넌트들 사이에 간격을 줍니다. */
  & > * {
    margin: 0 10px;
  }
`;

export const ConvenienceSection = styled.section`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto 270px;

  ${media.laptop} {
    max-width: 700px;
  }
  ${media.tablet} {
    max-width: 500px;
  }

  ${media.mobile} {
    padding: 0 20px;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    'card1 card1'
    'card2 card3'
    'card2 card4';
  gap: 16px;

  ${media.laptop} {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }
`;

export const FeatureCard = styled(motion.img)`
  ${media.laptop} {
    width: 100%;
  }
`;

export const Card1 = styled(FeatureCard)`
  grid-area: card1;
`;
export const Card2 = styled(FeatureCard)`
  grid-area: card2;
`;
export const Card3 = styled(FeatureCard)`
  grid-area: card3;
`;
export const Card4 = styled(FeatureCard)`
  grid-area: card4;
`;

export const ConvenienceTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  text-align: center;
`;

export const ContactSection = styled(motion.section)`
  width: 100%;
  height: 500px;
  background-color: rgba(255, 84, 20, 0.08);
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 53px;
`;
export const ContactTitle = styled.h2`
  margin-top: 55px;
  font-size: 3rem;
  font-weight: bold;
  color: #ff5414;
`;

export const ContactButton = styled.button`
  background: #ffffff;
  color: #ff5414;
  font-size: 1rem;
  font-weight: bold;
  padding: 14px 64px;
  border: 1px solid #ff5414;
  border-radius: 50px;
`;
