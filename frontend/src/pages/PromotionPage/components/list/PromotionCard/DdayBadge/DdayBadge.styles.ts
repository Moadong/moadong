import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;
  border-radius: 50px;

  /* Glass 효과 */
  background: rgba(245, 245, 245, 0.7);
  backdrop-filter: blur(3px);
  box-shadow:
    inset 0px 1px 1px rgb(255, 255, 255),
    inset 0px -1px 1px rgb(255, 255, 255),
    rgba(0, 0, 0, 0.08) 0px 1px 4px;
`;

export const DdayText = styled.h1`
  color: ${colors.gray[800]};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;

  ${media.mini_mobile} {
    font-size: 10px;
  }
`;
