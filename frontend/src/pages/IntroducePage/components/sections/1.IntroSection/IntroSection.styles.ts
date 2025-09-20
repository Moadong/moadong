import styled from 'styled-components';
import { motion } from 'framer-motion';

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
`;

export const Container = styled.div`
  width: min(1120px, 92vw);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const Shape = styled.div<{
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}>`
  position: absolute;
  z-index: 0;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;

export const TextWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

export const IntroTitle = styled(motion.h1)`
  color: #ff5414;
  font-size: 80px;
`;

export const IntroSubtitle = styled(motion.h2)`
  font-size: 36px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  margin-bottom: 0.75rem;
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
`;

export const VisualWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 29px;
  min-height: 600px;
`;

export const PhoneImageWrapper = styled(motion.div)`
  /* 필요에 따라 위치 조정을 위한 스타일 추가 가능 */
`;

export const PhoneImage = styled.img`
  width: 375px;
  height: auto;
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
`;