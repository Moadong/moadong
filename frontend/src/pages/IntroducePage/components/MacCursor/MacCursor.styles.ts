// 맥 커서를 데모 화면 맨 위에 띄우고 클릭 원을 화살표 끝에 맞추는 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Layer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 0;
  height: 0;
  pointer-events: none;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));

  svg {
    position: absolute;
    top: -4px;
    left: -4px;
  }
`;

export const Ripple = styled(motion.span)`
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.primary[700]};
`;
