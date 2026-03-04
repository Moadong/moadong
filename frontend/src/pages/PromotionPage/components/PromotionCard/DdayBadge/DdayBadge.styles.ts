import { colors } from '@/styles/theme/colors';
import styled from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;
  border-radius: 50px;

  /* Glass 효과 */
  background: rgba(245, 245, 245, 0.6);
  backdrop-filter: blur(12px);
  box-shadow:
    inset 0 1px 1px rgb(255, 255, 255),
    0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const DdayText = styled.h1`
 color: ${colors.gray[800]};
 font-size: 10px;
 font-weight: 600;
 letter-spacing: -0.02em;
`;