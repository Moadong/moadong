import styled from 'styled-components';
import { motion } from 'framer-motion';
import { media } from '@/styles/mediaQuery';

export const ProblemSection = styled(motion.section)`
  width: 700px;
  margin: 0 auto 150px;

  ${media.laptop} {
    width: 600px;
    margin: 0 auto 120px;
  }

  ${media.tablet} {
    width: 500px;
    margin: 0 auto 100px;
  }

  ${media.mobile} {
    width: 90vw;
    margin: 0 auto 80px;
    padding: 0 20px;
  }
`;

export const ProblemSectionTitle = styled(motion.h2)`
  font-weight: bold;
  text-align: center;
  font-size: 30px;
  margin-bottom: 82px;

  ${media.laptop} {
    font-size: 26px;
    margin-bottom: 60px;
  }

  ${media.tablet} {
    font-size: 22px;
    margin-bottom: 50px;
  }

  ${media.mobile} {
    font-size: 18px;
    margin-bottom: 40px;
  }
`;

export const BubblesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 37px;

  ${media.laptop} {
    gap: 30px;
  }

  ${media.tablet} {
    gap: 25px;
  }

  ${media.mobile} {
    gap: 20px;
  }
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

  ${media.laptop} {
    padding: 12px 32px;
    font-size: 18px;
  }

  ${media.tablet} {
    padding: 10px 28px;
    font-size: 16px;
  }

  ${media.mobile} {
    padding: 8px 24px;
    font-size: 14px;
    border-radius: 30px;
  }
`;