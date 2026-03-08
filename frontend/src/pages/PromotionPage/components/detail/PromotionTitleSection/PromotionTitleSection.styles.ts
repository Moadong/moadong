import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;

  ${media.tablet} {
    padding: 20px;
    align-items: center;
    text-align: center;
  }
`;

export const TagWrapper = styled.div`
  margin-bottom: 8px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.gray[800]};
  word-break: keep-all;

  ${media.tablet} {
    font-size: 24px;
  }
`;