import styled from 'styled-components';
import TriangleDown from '@/assets/images/icons/triangle_down.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const StatusButtonWrapper = styled.div`
  position: relative;
`;

export const StatusButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 6px 4px 8px;
  gap: 4px;
  height: 29px;
  border-radius: 8px;
  border: 1px solid ${colors.gray[300]};
  background: ${colors.gray[50]};
  ${setTypography(typography.button.button2)}
  color: ${({ $enabled }) => ($enabled ? colors.gray[800] : colors.gray[400])};
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
`;

export const DeleteButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 8px;
  gap: 4px;
  height: 29px;
  border-radius: 8px;
  border: 1px solid
    ${({ $enabled }) => ($enabled ? colors.primary[800] : colors.gray[300])};
  background: ${colors.gray[50]};
  ${setTypography(typography.button.button2)}
  color: ${({ $enabled }) =>
    $enabled ? colors.primary[800] : colors.gray[400]};
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
`;

export const TriangleIcon = styled(TriangleDown)<{ $enabled: boolean }>`
  width: 8px;
  height: 6px;
  flex-shrink: 0;
  display: block;
  margin-top: 1px;
  color: ${({ $enabled }) => ($enabled ? colors.gray[800] : colors.gray[400])};
`;

export const StatusMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[300]};
  border-radius: 8px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 6px 0;
  min-width: 100px;
`;

export const StatusMenuItem = styled.div`
  padding: 10px 16px;
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[900]};
  cursor: pointer;

  &:active {
    background: ${colors.gray[100]};
  }
`;
