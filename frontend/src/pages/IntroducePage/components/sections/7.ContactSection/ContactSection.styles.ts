import styled from 'styled-components';
import { motion } from 'framer-motion';

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
`;

export const ContactTitle = styled.h2`
  margin-top: 55px;
  font-size: 3rem;
  font-weight: bold;
  color: #ff5414;
`;

export const ContactButton = styled.button`
  background: #ffffff;
  color: #ff5414;
  font-size: 1rem;
  font-weight: bold;
  padding: 14px 64px;
  border: 1px solid #ff5414;
  border-radius: 50px;
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