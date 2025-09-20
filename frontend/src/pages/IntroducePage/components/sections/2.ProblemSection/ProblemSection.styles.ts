import styled from 'styled-components';
import { motion } from 'framer-motion';

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