import { motion } from 'framer-motion';
import styled from 'styled-components';
import ClubTag from '@/components/ClubTag/ClubTag';
import { media } from '@/styles/mediaQuery';

export const FeatureSection = styled(motion.section)`
  width: 100%;
  padding: 150px 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

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
  font-size: 24px;
  color: #121212;
  margin-top: 22px;
  margin-bottom: 16px;

  ${media.laptop} {
    font-size: 16px;
    margin-top: 16px;
    margin-bottom: 14px;
  }

  ${media.tablet} {
    font-size: 15px;
    margin-top: 14px;
    margin-bottom: 12px;
  }

  ${media.mobile} {
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 8px;
    text-align: center;
    padding: 0 20px;
  }
`;
export const SearchWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 475px;
  height: 60px;
  padding: 0 16px;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);

  ${media.tablet} {
    height: 52px;
    max-width: 400px;
    padding: 0 12px;
  }

  ${media.mobile} {
    height: 44px;
    max-width: 320px;
    padding: 0 10px;
  }
`;

export const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 8px;

  img {
    width: 20px;
    height: 20px;

    ${media.tablet} {
      width: 18px;
      height: 18px;
    }

    ${media.mobile} {
      width: 16px;
      height: 16px;
    }
  }
`;

export const TypingText = styled.p`
  flex: 1;
  text-align: center;
  align-self: center;
  font-size: 20px;
  font-weight: 600;
  color: #121212;
  line-height: 1.6;
  border-bottom: 1px solid #ff5414;

  ${media.tablet} {
    font-size: 16px;
    line-height: 1.5;
    border-bottom: 1px solid #ff5414;
  }

  ${media.mobile} {
    font-size: 14px;
    line-height: 1.4;
    border-bottom: 0.8px solid #ff5414;
  }
`;

export const TagsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  margin-top: 40px;

  ${media.laptop} {
    gap: 32px;
  }

  ${media.tablet} {
    gap: 28px;
  }

  ${media.mobile} {
    gap: 24px;
  }
`;

export const CustomTag = styled(ClubTag)`
  && {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 1.7rem;
  }
  ${media.tablet} {
    && {
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 1.4rem;
    }
  }
  ${media.mobile} {
    && {
      padding: 6px 10px;
      border-radius: 5px;
      font-size: 0.875rem;
    }
  }
`;

export const TagWindow = styled.div`
  width: 80%;
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 80px;
    height: 100%;
    z-index: 2;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0));
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #ffffff, rgba(255, 255, 255, 0));
  }

  ${media.laptop} {
    &::before,
    &::after {
      width: 60px;
    }
  }

  ${media.tablet} {
    &::before,
    &::after {
      width: 40px;
    }
  }

  ${media.mobile} {
    &::before,
    &::after {
      width: 24px;
    }
  }
`;

export const TagRow = styled(motion.div)`
  display: flex;
  gap: 16px;
  white-space: nowrap;

  ${media.tablet} {
    gap: 12px;
  }

  ${media.mobile} {
    gap: 8px;
  }
`;
