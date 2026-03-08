import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';

export const Container = styled.header`
  position: relative;
  height: 48px;
  background: ${colors.base.white};
  border-bottom: 1px solid ${colors.gray[300]};
  display: flex;
  align-items: center;
  padding: 0 18px;

  ${media.tablet} {
    position: sticky;
    top: 0;
    z-index: 10;
  }
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;

  &:active {
    background: ${colors.gray[100]};
  }
`;

export const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[900]};
`;
