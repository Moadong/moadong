import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;

  ${media.tablet} {
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

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.gray[500]};
  margin: 20px 0;

  ${media.tablet} {
    display: none;
  }
`;
