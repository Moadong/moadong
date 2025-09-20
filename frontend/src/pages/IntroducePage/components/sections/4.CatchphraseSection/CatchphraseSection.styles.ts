import styled from 'styled-components';
import { motion } from 'framer-motion';

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