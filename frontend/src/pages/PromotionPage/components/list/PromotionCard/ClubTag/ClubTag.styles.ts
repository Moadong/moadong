import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${colors.gray[100]};
  padding: 4px 8px;
`;

export const ClubText = styled.span`
  color: ${colors.gray[800]};
  font-size: 14px;
  font-weight: 600;

  ${media.mini_mobile} {
    font-size: 12px;
  }
`;
