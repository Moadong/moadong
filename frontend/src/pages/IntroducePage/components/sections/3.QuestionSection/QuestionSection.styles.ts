import styled from 'styled-components';
import { motion } from 'framer-motion';

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