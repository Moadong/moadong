import styled from 'styled-components';
import { motion } from 'framer-motion';
import { media } from '@/styles/mediaQuery';

export const FeatureSection = styled(motion.section)`
  width: 100%;
  padding: 150px 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  ${media.laptop} {
    padding: 120px 0;
    gap: 32px;
  }

  ${media.tablet} {
    padding: 100px 0;
    gap: 28px;
  }

  ${media.mobile} {
    padding: 80px 0;
    gap: 24px;
  }
`;

export const FeatureTitle = styled(motion.h2)`
  font-size: 48px;
  font-weight: 900;
  color: #333;

  ${media.laptop} {
    font-size: 40px;
  }

  ${media.tablet} {
    font-size: 32px;
  }

  ${media.mobile} {
    font-size: 24px;
    text-align: center;
    padding: 0 20px;
  }
`;

export const FeatureSubtitle = styled(motion.p)`
  font-size: 18px;
  color: #555;
  margin-top: -20px;
  margin-bottom: 40px; // 태그 컨테이너와의 간격

  ${media.laptop} {
    font-size: 16px;
    margin-top: -16px;
    margin-bottom: 32px;
  }

  ${media.tablet} {
    font-size: 15px;
    margin-top: -12px;
    margin-bottom: 28px;
  }

  ${media.mobile} {
    font-size: 14px;
    margin-top: -8px;
    margin-bottom: 24px;
    text-align: center;
    padding: 0 20px;
  }
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

  ${media.laptop} {
    margin-bottom: 16px;
    
    & > * {
      margin: 0 8px;
    }
  }

  ${media.tablet} {
    margin-bottom: 14px;
    
    & > * {
      margin: 0 6px;
    }
  }

  ${media.mobile} {
    margin-bottom: 12px;
    overflow-x: auto;
    width: 100%;
    padding: 0 20px;
    
    & > * {
      margin: 0 4px;
      flex-shrink: 0;
    }
  }
`;