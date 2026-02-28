import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

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

  ${media.laptop} {
    padding: 120px 0;
  }

  ${media.tablet} {
    padding: 100px 0;
  }

  ${media.mobile} {
    padding: 80px 0;
  }
`;

export const QuestionTitle = styled(motion.h2)`
  font-size: 30px;
  color: #333;
  font-weight: bold;
  z-index: 1;

  ${media.laptop} {
    font-size: 26px;
  }

  ${media.tablet} {
    font-size: 22px;
  }

  ${media.mobile} {
    font-size: 18px;
    text-align: center;
    padding: 0 20px;
  }
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

  ${media.laptop} {
    font-size: 320px;
    line-height: 500px;
  }

  ${media.tablet} {
    font-size: 240px;
    line-height: 380px;
  }

  ${media.mobile} {
    font-size: 180px;
    line-height: 280px;
  }
`;
