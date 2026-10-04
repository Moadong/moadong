import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

export const Container = styled.header`
  position: sticky;
  top: 0;
  z-index: ${Z_INDEX.header};
  height: 48px;
  background: ${colors.base.white};
  border-bottom: 1px solid ${colors.gray[300]};
  display: flex;
  align-items: center;
  padding: 0 18px;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;

  ${media.mobile} {
    max-width: 100%;
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
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const RightSpacer = styled.div`
  width: 36px;
  flex-shrink: 0;
`;
