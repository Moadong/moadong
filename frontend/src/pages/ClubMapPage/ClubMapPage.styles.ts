import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';

const setTypography = (typo: { size: string; weight: number }) => `
  font-size: ${typo.size};
  font-weight: ${typo.weight};
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const BackButton = styled.button`
  position: fixed;
  top: calc(12px + var(--rn-safe-top, 0px));
  left: 16px;
  z-index: 10;
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
`;

export const BottomCardWrapper = styled.div`
  position: fixed;
  bottom: calc(55px + var(--rn-safe-bottom, 0px));
  left: 20px;
  right: 20px;
  z-index: 10;
`;

export const StatusMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${setTypography(typography.paragraph.p4)};
  color: ${colors.gray[700]};
  text-align: center;
`;
