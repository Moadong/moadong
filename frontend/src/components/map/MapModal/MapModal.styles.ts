import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

const CONTROL_Z_INDEX = 10;

export const Container = styled.div`
  position: relative;
  width: 86vw;
  max-width: 1100px;
  height: 73vh;
  max-height: 820px;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${colors.base.white};
  margin-bottom: 40px;

  ${media.tablet} {
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    border-radius: 0;
    margin-bottom: 0;
  }
`;

export const ActionButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: ${CONTROL_Z_INDEX};
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background-color: ${colors.base.white};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  ${media.tablet} {
    top: calc(12px + var(--rn-safe-top, 0px));
    left: 16px;
    right: auto;
  }
`;

export const ZoomControlsWrapper = styled.div`
  position: absolute;
  bottom: 50px;
  right: 40px;
  z-index: ${CONTROL_Z_INDEX};
`;
