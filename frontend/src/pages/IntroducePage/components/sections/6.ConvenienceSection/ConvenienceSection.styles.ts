import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const ConvenienceSection = styled.section`
  max-width: 1180px;
  width: 100%;
  margin: 50px auto 150px;

  ${media.laptop} {
    max-width: 700px;
    margin: 30px auto 100px;
  }
  ${media.tablet} {
    max-width: 500px;
    margin: 20px auto 100px;
  }

  ${media.mobile} {
    padding: 0 20px;
    margin: 10px auto 40px;
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
  font-size: 32px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  text-align: center;

  ${media.laptop} {
    font-size: 28px;
    margin-bottom: 20px;
  }

  ${media.tablet} {
    font-size: 24px;
    margin-bottom: 18px;
  }

  ${media.mobile} {
    font-size: 20px;
    margin-bottom: 16px;
    padding: 0 20px;
  }
`;
