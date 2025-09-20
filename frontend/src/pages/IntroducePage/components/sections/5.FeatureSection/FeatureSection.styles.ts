import styled from 'styled-components';
import { motion } from 'framer-motion';

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