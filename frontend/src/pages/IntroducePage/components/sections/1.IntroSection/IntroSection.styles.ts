import styled from 'styled-components';
import { motion } from 'framer-motion';
import { media } from '@/styles/mediaQuery';

export const IntroSection = styled(motion.section)`
  width: 100%;
  padding: 72px 0 150px;
  background: linear-gradient(
    180deg,
    rgba(255, 84, 20, 0.004) 0%,
    rgba(255, 84, 20, 0.08) 55.29%,
    rgba(255, 84, 20, 0.004) 100%
  );
  position: relative;
  overflow: hidden;

  ${media.laptop} {
    padding: 60px 0 120px;
  }

  ${media.tablet} {
    padding: 40px 0 80px;
  }

  ${media.mobile} {
    padding: 30px 0 60px;
  }
`;

export const Container = styled.div`
  width: min(1120px, 92vw);
  margin: 0 auto;
  position: relative;
  z-index: 1;

  ${media.laptop} {
    width: min(900px, 90vw);
  }

  ${media.tablet} {
    width: min(600px, 88vw);
  }

  ${media.mobile} {
    width: min(400px, 85vw);
  }
`;

export const Shape = styled.div<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  laptop?: { top?: string; left?: string; right?: string; bottom?: string };
  tablet?: { top?: string; left?: string; right?: string; bottom?: string };
  mobile?: { top?: string; left?: string; right?: string; bottom?: string };
}>`
  position: absolute;
  z-index: 0;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};

  ${media.laptop} {
    transform: scale(0.85);
    top: ${({ laptop }) => laptop?.top || 'auto'};
    left: ${({ laptop }) => laptop?.left || 'auto'};
    right: ${({ laptop }) => laptop?.right || 'auto'};
    bottom: ${({ laptop }) => laptop?.bottom || 'auto'};
  }

  ${media.tablet} {
    transform: scale(0.7);
    top: ${({ tablet }) => tablet?.top || 'auto'};
    left: ${({ tablet }) => tablet?.left || 'auto'};
    right: ${({ tablet }) => tablet?.right || 'auto'};
    bottom: ${({ tablet }) => tablet?.bottom || 'auto'};
  }

  ${media.mobile} {
    transform: scale(0.5);
    top: ${({ mobile }) => mobile?.top || 'auto'};
    left: ${({ mobile }) => mobile?.left || 'auto'};
    right: ${({ mobile }) => mobile?.right || 'auto'};
    bottom: ${({ mobile }) => mobile?.bottom || 'auto'};
  }
`;

export const TextWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;

  ${media.laptop} {
    margin-top: 60px;
  }

  ${media.tablet} {
    margin-top: 40px;
  }

  ${media.mobile} {
    margin-top: 30px;
  }
`;

export const IntroTitle = styled(motion.h1)`
  color: #ff5414;
  font-size: 80px;

  ${media.laptop} {
    font-size: 64px;
  }

  ${media.tablet} {
    font-size: 48px;
  }

  ${media.mobile} {
    font-size: 36px;
  }
`;

export const IntroSubtitle = styled(motion.h2)`
  font-size: 36px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  margin-bottom: 0.75rem;

  ${media.laptop} {
    font-size: 28px;
  }

  ${media.tablet} {
    font-size: 24px;
  }

  ${media.mobile} {
    font-size: 20px;
  }
`;

export const IntroButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 46px 14px 50px;
  background: #ff5414;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  margin-top: 28px;
  cursor: pointer;

  .icon {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }

  &:hover {
    background: #e04e0f;
    transition:
      background 0.3s,
      box-shadow 0.3s;
  }

  ${media.laptop} {
    padding: 12px 40px 12px 44px;
    font-size: 15px;
    margin-top: 24px;
  }

  ${media.tablet} {
    padding: 10px 36px 10px 40px;
    font-size: 14px;
    margin-top: 20px;
  }

  ${media.mobile} {
    padding: 8px 32px 8px 36px;
    font-size: 13px;
    margin-top: 16px;
    gap: 8px;

    .icon {
      width: 12px;
      height: 12px;
    }
  }
`;

export const VisualWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 29px;
  min-height: 600px;
`;

export const PhoneImageWrapper = styled(motion.div)`
  position: relative;
`;

export const PhoneImage = styled.img`
  width: 375px;
  height: auto;

  ${media.laptop} {
    width: 310px;
  }

  ${media.tablet} {
    width: 290px;
  }

  ${media.mobile} {
    width: 270px;
  }
`;

export const CardImage = styled(motion.div)<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  transform?: string;
}>`
  position: absolute;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
  transform: ${({ transform }) => transform || 'none'};
  z-index: 2;

  ${media.mobile} {
    display: none;
  }
`;
