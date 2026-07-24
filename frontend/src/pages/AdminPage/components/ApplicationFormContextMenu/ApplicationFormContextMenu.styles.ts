import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const MenuContainer = styled.div`
  position: absolute;
  top: 60%;
  right: 8px;
  width: 170px;
  height: 110px;
  background-color: ${colors.base.white};
  border-radius: 10px;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  z-index: 10;
`;

export const MenuItem = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  align-self: stretch;
  padding: 4px 12px;
  gap: 11px;
  ${setTypography(typography.paragraph.p6)}
  letter-spacing: -0.02em;
  color: ${({ $danger }) => ($danger ? '#FF3B30' : colors.gray[800])};
  background-color: transparent;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background-color: ${colors.gray[100]};
  }
`;

export const ToggleMenuItem = styled(MenuItem)<{ $active?: boolean }>`
  ${setTypography(typography.paragraph.p5)}
  letter-spacing: -0.02em;
`;

export const EditDeleteGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 1px;
`;

export const MenuIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

export const ToggleIcon = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: ${({ $active }) => ($active ? colors.primary[800] : colors.gray[300])};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Separator = styled.div`
  width: 150px;
  height: 0;
  border: 1px solid ${colors.gray[200]};
  flex-shrink: 0;
`;
