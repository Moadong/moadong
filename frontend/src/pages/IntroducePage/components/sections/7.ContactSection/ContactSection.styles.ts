import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const ContactSection = styled(motion.section)`
  width: 100%;
  height: 500px;
  background-color: rgba(255, 84, 20, 0.08);
  position: relative;
  overflow: hidden;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 53px;

  ${media.laptop} {
    height: 400px;
    gap: 40px;
  }

  ${media.tablet} {
    height: 350px;
    gap: 32px;
  }

  ${media.mobile} {
    height: 300px;
    gap: 24px;
    padding: 0 20px;
  }
`;

export const ContactTitle = styled.h2`
  position: relative;
  z-index: 1;
  text-align: center;
  word-break: keep-all;
  margin-top: 55px;
  font-size: 3rem;
  font-weight: bold;
  color: ${colors.primary[900]};

  ${media.laptop} {
    margin-top: 40px;
    font-size: 2.5rem;
  }

  ${media.tablet} {
    margin-top: 30px;
    font-size: 2rem;
  }

  ${media.mobile} {
    margin-top: 20px;
    font-size: 1.5rem;
    text-align: center;
  }
`;
