import styled from 'styled-components';
import { motion } from 'framer-motion';
import { media } from '@/styles/mediaQuery';

export const ContactSection = styled(motion.section)`
  width: 100%;
  height: 500px;
  background-color: rgba(255, 84, 20, 0.08);
  position: relative;
  overflow: hidden;

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
  margin-top: 55px;
  font-size: 3rem;
  font-weight: bold;
  color: #ff5414;

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

export const ContactButton = styled.a`
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  z-index: 1;

  background: #ffffff;
  color: #ff5414;
  font-size: 1rem;
  font-weight: bold;
  padding: 14px 64px;
  border: 1px solid #ff5414;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5414;
    color: #ffffff;
  }

  ${media.laptop} {
    padding: 12px 56px;
  }

  ${media.tablet} {
    padding: 10px 48px;
  }

  ${media.mobile} {
    padding: 8px 40px;
  }
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
