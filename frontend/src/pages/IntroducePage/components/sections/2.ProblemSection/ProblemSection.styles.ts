import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const ProblemSection = styled(motion.section)`
  position: relative;
  isolation: isolate;
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
    width: 100%;
    margin: 0 auto 80px;
    padding: 0 16px;
  }
`;

export const ProblemSectionTitle = styled(motion.h2)`
  font-weight: bold;
  text-align: center;
  font-size: 30px;
  margin-bottom: 48px;

  ${media.laptop} {
    font-size: 26px;
    margin-bottom: 40px;
  }

  ${media.tablet} {
    font-size: 22px;
    margin-bottom: 32px;
  }

  ${media.mobile} {
    font-size: 18px;
    margin-bottom: 24px;
  }
`;
